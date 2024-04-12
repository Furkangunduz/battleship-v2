import { fetchRedis } from '@/helpers/fetch-redis';
import ApiError from '@/lib/ApiError';
import ApiResponse from '@/lib/ApiResponse';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { PusherEvents, toPusherKey } from '@/lib/utils';
import { addFriendSchema } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(new ApiError(401, 'Unauthorized').toJson(), { status: 401 });
    }

    const { friendId } = await req.json();
    const { friendId: friendIdToCancel } = z
      .object({
        friendId: z.string(),
      })
      .parse({ friendId });

    if (!friendIdToCancel) {
      return new Response(new ApiError(400, 'Validation Error', 'friendId is required').toJson(), { status: 400 });
    }

    const friendRaw = (await fetchRedis('get', `user:${friendId}`)) as string;
    const friend = JSON.parse(friendRaw) as User;

    if (!friend) {
      return new Response(new ApiError(404, 'Friend not found').toJson(), { status: 404 });
    }

    const isFriendRequestSent = (await fetchRedis('sismember', `user:${friend.id}:incoming-friend-requests`, session?.user.id)) as 0 | 1;
    if (!isFriendRequestSent) {
      return new Response(new ApiError(400, 'Friend Request not found').toJson(), { status: 400 });
    }

    await db.srem(`user:${friend.id}:incoming-friend-requests`, session?.user.id);
    await db.srem(`user:${session?.user.id}:outgoing-friend-requests`, friend.id);

    await pusherServer.trigger(toPusherKey(`user:${friendId}:incoming_friend_requests`), PusherEvents.REQUESTS.CANCEL, session.user);
    await pusherServer.trigger(toPusherKey(`user:${session.user.id}:outgoing_friend_requests`), PusherEvents.REQUESTS.CANCEL, null);

    return new Response(new ApiResponse(200, null, 'Friend Request cancelled Succesfully').toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(new ApiError(400, 'Validation Error', error.errors).toJson(), { status: 400 });
    }

    console.log(error);

    return new Response(new ApiError(500, 'Something went wrong').toJson(), { status: 500 });
  }
}
