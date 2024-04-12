'use client';

import { FC, useEffect, useState } from 'react';
import { Icons } from '../Icons';
import Link from 'next/link';
import { pusherClient } from '@/lib/pusher';
import { PusherEvents, toPusherKey } from '@/lib/utils';
import toast from 'react-hot-toast';

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
      href={'/dashboard/outgoing-friend-requests'}
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center cursor-pointer"
    >
      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <Icons.LoaderCircle className="h-4 w-4" />
      </span>

      <span className="truncate">Outgoing Friend Request</span>

      {count > 0 && <span className="text-xs bg-indigo-500 text-white size-5 rounded-full flex items-center justify-center">{count}</span>}
    </Link>
  );
};

export default SideBarOutgoingFriendRequestOption;
