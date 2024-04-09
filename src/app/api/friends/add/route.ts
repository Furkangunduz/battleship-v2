import { fetchRedis } from '@/helpers/fetch-redis';
import ApiError from '@/lib/ApiError';
import ApiResponse from '@/lib/ApiResponse';
import { db } from '@/lib/db';
import { addFriendSchema } from '@/lib/validations/add-friend';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const { email: emailToAdd } = addFriendSchema.parse({ email });

    const friendId = (await fetchRedis('get', `user:email:${emailToAdd}`)) as string;

    if (!friendId) {
      return new Response(new ApiError(404, 'User not found').toJson(), { status: 404 });
    }

    const friend = JSON.parse(await fetchRedis('get', `user:${friendId}`)) as User;
    const isAlreadyFriend = (await fetchRedis('sismember', `user:${friendId}:friends`, friendId)) as 0 | 1;
    if (isAlreadyFriend) {
      return new Response(new ApiError(404, 'You Are Already Friend').toJson(), { status: 404 });
    }

    const isFriendRequestAlreadySent = (await fetchRedis('sismember', `user:${friendId}:incoming-friend-requests`, friendId)) as 0 | 1;
    if (isFriendRequestAlreadySent) {
      return new Response(new ApiError(404, 'Friend Request Already Sent').toJson(), { status: 404 });
    }

    await db.sadd(`user:${friend.id}:incoming-friend-requests`, friendId);

    return new Response(new ApiResponse(200, null, 'Friend Request Sent Succesfully').toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(new ApiError(400, 'Validation Error', error.errors).toJson(), { status: 400 });
    }

    return new Response(new ApiError(500, 'Something went wrong').toJson(), { status: 500 });
  }
}
