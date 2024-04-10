'use client';

import { FC, useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { Icons } from './Icons';
import toast from 'react-hot-toast';
import { getFriends } from '@/helpers/get-friends';

interface SideBarFriendListProps {
  sessionId: string;
}

const SideBarFriendList: FC<SideBarFriendListProps> = ({ sessionId }) => {
  const [friends, setFriends] = useState<User[] | null>([]);

  useEffect(() => {
    async function init() {
      try {
        const friends = (await getFriends(sessionId)) as User[];

        setFriends(friends);
      } catch (error) {
        toast.error('There was a problem fetching your friends');
      }
    }

    init();
  }, [sessionId]);

  return (
    <ScrollArea className="max-h-[350px] px-1">
      <div className="space-y-1 p-2">
        {friends && friends.length === 0 && <p className="text-gray-400 text-sm font-normal pl-4">You have no friends yet</p>}

        {friends &&
          friends.map((friend, i) => (
            <Link
              key={`$friend-${i}`}
              href={`/dashboard/friend/${i}`}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'w-full flex gap-2 justify-start font-normal hover:text-indigo-600 group'
              )}
            >
              <span className=" border rounded-lg p-1 text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 ">
                <Icons.User2 size={18} className="text-slate-500 " />
              </span>
              friend
            </Link>
          ))}
      </div>
    </ScrollArea>
  );
};

export default SideBarFriendList;
