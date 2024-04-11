'use client';

import { FC } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import SideBarFriendListItem from './SidebarFriendListItem';

interface SideBarFriendListProps {
  sessionId: string;
  friends: User[];
}

const SideBarFriendList: FC<SideBarFriendListProps> = ({ sessionId, friends }) => {
  return (
    <ScrollArea className="max-h-[350px] px-1">
      <div className="space-y-1 p-2">
        {friends && friends.length === 0 && <p className="text-gray-400 text-sm font-normal pl-4">You have no friends yet</p>}

        {friends && friends.map((friend, i) => <SideBarFriendListItem key={friend.id} friend={friend} />)}
      </div>
    </ScrollArea>
  );
};

export default SideBarFriendList;
