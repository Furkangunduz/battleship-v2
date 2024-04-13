"use client";

import { pusherClient } from "@/lib/pusher";
import { PusherEvents, toPusherKey } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import SideBarFriendListItem from "./SidebarFriendListItem";

interface SideBarFriendListProps {
  sessionId: string;
  friends: User[];
}

const SideBarFriendList: FC<SideBarFriendListProps> = ({ sessionId, friends }) => {
  const [items, setItems] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
    const friendHandler = (user: User) => {
      setItems((prev) => [...prev, user]);
    };

    const removeHandler = (user: User) => {
      setItems((prev) => prev.filter((item) => item.id !== user.id));
    };

    pusherClient.bind(PusherEvents.FRIENDS.NEW, friendHandler);
    pusherClient.bind(PusherEvents.FRIENDS.REMOVE, removeHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind(PusherEvents.FRIENDS.NEW, friendHandler);
      pusherClient.unbind(PusherEvents.FRIENDS.REMOVE, removeHandler);
    };
  }, [sessionId, items, setItems]);

  return (
    <ScrollArea className="max-h-[350px] px-1">
      <div className="space-y-1 p-2">
        {items && items.length === 0 && <p className="pl-4 text-sm font-normal text-gray-400">You have no friends yet</p>}

        {items && items.map((friend, i) => <SideBarFriendListItem key={friend.id} friend={friend} sessionId={sessionId} />)}
      </div>
    </ScrollArea>
  );
};

export default SideBarFriendList;
