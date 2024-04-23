"use client";

import { pusherClient } from "@/lib/pusher";
import { PusherEvents, toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../Icons";

interface SideBarGameRequestOptionProps {
  sessionId: string;
  unseenRequestCount: number;
}

const SideBarGameRequestOption: FC<SideBarGameRequestOptionProps> = ({ unseenRequestCount, sessionId }) => {
  const [count, setCount] = useState<number>(unseenRequestCount);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_game_requests`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:outgoing_game_requests`));

    const gameRequestHandler = (user: User) => {
      if (user.id) {
        toast.success(`${user.name} has sent you a game request`);
        setCount((prev) => prev + 1);
      }
    };

    const denyHandler = (user: User) => {
      toast.error(`Game request denied by ${user.name}`);
      setCount((prev) => prev - 1);
    };

    pusherClient.bind(PusherEvents.GAME.DENY, denyHandler);
    pusherClient.bind(PusherEvents.GAME.INCOMING, gameRequestHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_game_requests`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:outgoing_game_requests`));
      pusherClient.unbind(PusherEvents.GAME.INCOMING, gameRequestHandler);
      pusherClient.unbind(PusherEvents.GAME.DENY, denyHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href={"/dashboard/game-requests"}
      className="group flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <Icons.Ship className="h-4 w-4" />
      </span>

      <span className="truncate">Game Requests</span>

      {count > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{count}</span>}
    </Link>
  );
};

export default SideBarGameRequestOption;
