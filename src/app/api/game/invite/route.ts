import { fetchRedis } from "@/helpers/fetch-redis";
import ApiError from "@/lib/ApiError";
import ApiResponse from "@/lib/ApiResponse";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { PusherEvents, toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { friendId }: { friendId: string } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) return new Response(new ApiResponse(401, null, "Unauthorized").toJson(), { status: 401 });

    const friendRaw = (await fetchRedis("get", `user:${friendId}`)) as string;
    const friend = JSON.parse(friendRaw) as User;

    if (!friend) return new Response(new ApiResponse(404, null, "User not found").toJson(), { status: 404 });

    const friendList = (await fetchRedis("smembers", `user:${session.user.id}:friends`)) as string[];

    if (!friendList.includes(friend.id)) {
      return new Response(new ApiResponse(401, null, "You are not friend").toJson(), { status: 401 });
    }

    const isGameRequestExists = await db.sismember(`user:${session?.user.id}:outgoing-game-requests`, friend.id);

    if (isGameRequestExists) {
      return new Response(new ApiResponse(400, null, "Invite already exists").toJson(), { status: 400 });
    }

    await pusherServer.trigger(toPusherKey(`user:${friendId}:incoming_game_requests`), PusherEvents.GAME.INCOMING, session.user);

    await db.sadd(`user:${friend.id}:incoming-game-requests`, session?.user.id);
    await db.sadd(`user:${session?.user.id}:outgoing-game-requests`, friend.id);

    return new Response(new ApiResponse(200, null, "Invite created succesfuly ").toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(new ApiError(500, error.message).toJson(), { status: 500 });
    }

    return new Response(new ApiError(500, "Internal Server Error").toJson(), { status: 500 });
  }
}
