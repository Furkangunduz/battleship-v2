import { fetchRedis } from '@/helpers/fetch-redis';
import ApiError from '@/lib/ApiError';
import ApiResponse from '@/lib/ApiResponse';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { addFriendSchema } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(new ApiResponse(401, 'Unauthorized').toJson(), { status: 401 });
    }

    const { email } = await req.json();
    const { email: emailToAdd } = addFriendSchema.parse({ email });

    if (emailToAdd === session?.user.email) {
      return new Response(new ApiResponse(400, null, 'You cannot add yourself as a friend').toJson(), { status: 400 });
    }

    const friendId = (await fetchRedis('get', `user:email:${emailToAdd}`)) as string;

    if (!friendId) {
      return new Response(new ApiResponse(404, null, 'User not found').toJson(), { status: 404 });
    }

    const isAlreadyFriend = (await fetchRedis('sismember', `user:${friendId}:friends`, friendId)) as 0 | 1;
    if (isAlreadyFriend) {
      return new Response(new ApiResponse(404, null, 'You Are Already Friend').toJson(), { status: 404 });
    }

    const isFriendRequestAlreadySent = (await fetchRedis('sismember', `user:${friendId}:incoming-friend-requests`, session?.user.id)) as
      | 0
      | 1;

    if (isFriendRequestAlreadySent) {
      return new Response(new ApiResponse(404, null, 'Friend Request Already Sent').toJson(), { status: 404 });
    }

    await db.sadd(`user:${friendId}:incoming-friend-requests`, session?.user.id);
    await db.sadd(`user:${session?.user.id}:outgoing-friend-requests`, friendId);

    return new Response(new ApiResponse(200, null, 'Friend Request Sent Succesfully').toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(new ApiError(400, 'Validation Error', error.errors).toJson(), { status: 400 });
    }

    return new Response(new ApiError(500, 'Something went wrong').toJson(), { status: 500 });
  }
}
