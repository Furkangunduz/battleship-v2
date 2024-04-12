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

    const isFriend = (await fetchRedis('sismember', `user:${session?.user.id}:friends`, friend.id)) as 0 | 1;

    if (!isFriend) {
      return new Response(new ApiResponse(400, null, 'This user not in your friend list').toJson(), { status: 400 });
    }

    await db.srem(`user:${session?.user.id}:friends`, friend.id);
    await db.srem(`user:${friend.id}:friends`, session?.user.id);

    pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), PusherEvents.FRIENDS.REMOVE, friend);
    pusherServer.trigger(toPusherKey(`user:${friend.id}:friends`), PusherEvents.FRIENDS.REMOVE, session.user);

    return new Response(new ApiResponse(200, null, 'Friend Removed Succesfully').toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(new ApiError(400, 'Validation Error', error.errors).toJson(), { status: 400 });
    }

    console.log(error);

    return new Response(new ApiError(500, 'Something went wrong').toJson(), { status: 500 });
  }
}
