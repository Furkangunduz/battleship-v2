import { fetchRedis } from '@/helpers/fetch-redis';
import ApiError from '@/lib/ApiError';
import ApiResponse from '@/lib/ApiResponse';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { PusherEvents, toPusherKey } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(new ApiResponse(401, null, 'Unauthorized').toJson(), { status: 401 });
    }

    const { friendId } = await req.json();
    const { friendId: friendToAccept } = z
      .object({
        friendId: z.string(),
      })
      .parse({ friendId });

    if (!friendToAccept) {
      return new Response(new ApiResponse(400, null, 'friendId is required').toJson(), { status: 400 });
    }

    const friendRaw = (await fetchRedis('get', `user:${friendToAccept}`)) as string;
    const friend = JSON.parse(friendRaw) as User;

    if (!friend) {
      return new Response(new ApiResponse(404, null, 'Friend not found').toJson(), { status: 404 });
    }

    const isFriendRequestExist = (await fetchRedis('sismember', `user:${session.user.id}:incoming-friend-requests`, friend.id)) as 0 | 1;

    if (!isFriendRequestExist) {
      return new Response(new ApiResponse(400, null, 'Friend Request not found').toJson(), { status: 400 });
    }

    const isAlreadyFriend = (await fetchRedis('sismember', `user:${session?.user.id}:friends`, friend.id)) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response(new ApiResponse(400, null, 'Already Friends').toJson(), { status: 400 });
    }

    await db.sadd(`user:${session?.user.id}:friends`, friend.id);
    await db.sadd(`user:${friend.id}:friends`, session?.user.id);
    await db.srem(`user:${session?.user.id}:incoming-friend-requests`, friend.id);
    await db.srem(`user:${friend.id}:outgoing-friend-requests`, session?.user.id);

    pusherServer.trigger(toPusherKey(`user:${friend.id}:friends`), PusherEvents.FRIENDS.NEW, session.user);
    pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), PusherEvents.FRIENDS.NEW, friend);
    pusherServer.trigger(toPusherKey(`user:${session.user.id}:outgoing_friend_requests`), PusherEvents.REQUESTS.ACCEPT, friend);
    pusherServer.trigger(toPusherKey(`user:${friend.id}:incoming_friend_requests`), PusherEvents.REQUESTS.ACCEPT, session.user);

    return new Response(new ApiResponse(200, null, 'Friend Added Succesfully').toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(new ApiError(400, 'Validation Error', error.errors).toJson(), { status: 400 });
    }

    console.log(error);

    return new Response(new ApiError(500, 'Something went wrong').toJson(), { status: 500 });
  }
}
