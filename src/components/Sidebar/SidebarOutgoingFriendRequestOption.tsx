"use client";

import { pusherClient } from "@/lib/pusher";
import { PusherEvents, toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../Icons";

interface SideBarOutgoingFriendRequestOptionProps {
  sessionId?: string;
  unseenRequestCount: number;
}

const SideBarOutgoingFriendRequestOption: FC<SideBarOutgoingFriendRequestOptionProps> = ({ sessionId, unseenRequestCount }) => {
  const [count, setCount] = useState<number>(unseenRequestCount);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:outgoing_friend_requests`));

    const friendRequestHandler = (user: User) => {
      if (user.id) {
        setCount((prev) => prev + 1);
      }
    };

    const denyHandler = (user: User) => {
      toast.error(`${user.name} has denied your friend request`);
      setCount((prev) => prev - 1);
    };

    const cancelHandler = (user: User) => {
      toast.error(`${user.name} has cancelled friend request`);
      setCount((prev) => prev - 1);
    };

    const acceptHandler = (user: User) => {
      toast.success(`${user.name} has accepted your friend request`);
      setCount((prev) => prev - 1);
    };

    pusherClient.bind(PusherEvents.REQUESTS.OUTGOING, friendRequestHandler);
    pusherClient.bind(PusherEvents.REQUESTS.DENY, denyHandler);
    pusherClient.bind(PusherEvents.REQUESTS.CANCEL, cancelHandler);
    pusherClient.bind(PusherEvents.REQUESTS.ACCEPT, acceptHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:outgoing_friend_requests`));
      pusherClient.unbind(PusherEvents.REQUESTS.OUTGOING, friendRequestHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.DENY, denyHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.CANCEL, cancelHandler);
      pusherClient.unbind(PusherEvents.REQUESTS.ACCEPT, acceptHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href={"/dashboard/outgoing-friend-requests"}
      className="group flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <Icons.LoaderCircle className="h-4 w-4" />
      </span>

      <span className="truncate">Outgoing Friend Request</span>

      {count > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{count}</span>}
    </Link>
  );
};

export default SideBarOutgoingFriendRequestOption;
