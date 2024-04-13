"use client";

import { pusherClient } from "@/lib/pusher";
import { PusherEvents, toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../Icons";

interface SideBarIncomingFriendRequestOptionProps {
  sessionId?: string;
  unseenRequestCount: number;
}

const SideBarIncomingFriendRequestOption: FC<SideBarIncomingFriendRequestOptionProps> = ({ sessionId, unseenRequestCount }) => {
  const [count, setCount] = useState<number>(unseenRequestCount);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));

    const friendRequestHandler = (user: User) => {
      if (user.id) {
        toast.success(`${user.name} has sent you a friend request`);
        setCount((prev) => prev + 1);
      }
    };

    const denyHandler = () => {
      setCount((prev) => prev - 1);
    };

    const cancelHandler = () => {
      setCount((prev) => prev - 1);
    };

    const acceptHandler = () => {
      setCount((prev) => prev - 1);
    };

    pusherClient.bind(PusherEvents.REQUESTS.INCOMING, friendRequestHandler);
    pusherClient.bind(PusherEvents.REQUESTS.DENY, denyHandler);
    pusherClient.bind(PusherEvents.REQUESTS.CANCEL, cancelHandler);
    pusherClient.bind(PusherEvents.REQUESTS.ACCEPT, acceptHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
      pusherClient.unbind(PusherEvents.REQUESTS.INCOMING, friendRequestHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.DENY, denyHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.CANCEL, cancelHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.ACCEPT, acceptHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href={"/dashboard/incoming-friend-requests"}
      className="group flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <Icons.LoaderCircle className="h-4 w-4" />
      </span>

      <span className="truncate">Incoming Friend Request</span>

      {count > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{count}</span>}
    </Link>
  );
};

export default SideBarIncomingFriendRequestOption;
