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

    const gameRequestExist = (await fetchRedis("sismember", `user:${session.user.id}:incoming-game-requests`, friendId)) as boolean;

    if (!gameRequestExist) {
      return new Response(new ApiResponse(400, null, "Game request not found").toJson(), { status: 400 });
    }

    await pusherServer.trigger(toPusherKey(`user:${friendId}:outgoing_game_requests`), PusherEvents.GAME.DENY, session.user);

    await db.srem(`user:${friendId}:outgoing-game-requests`, session.user.id);
    await db.srem(`user:${session.user.id}:incoming-game-requests`, friendId);

    return new Response(new ApiResponse(200, null, "Game request denied").toJson(), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(new ApiError(500, error.message).toJson(), { status: 500 });
    }

    return new Response(new ApiError(500, "Internal Server Error").toJson(), { status: 500 });
  }
}
