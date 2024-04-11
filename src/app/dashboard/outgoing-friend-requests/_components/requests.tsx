'use client';

import { FC, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import { Icons } from '@/components/Icons';

interface RequestsProps {
  requests: User[];
}

const Requests: FC<RequestsProps> = ({ requests }) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [items, setItems] = useState<User[]>(requests);

  return (
    <ScrollArea className="max-h-screen flex flex-col">
      <div className="flex flex-col gap-5 p-2">
        {items.map((friend) => (
          <div key={friend.id} className="flex gap-5 items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden relative">
              <Image fill referrerPolicy="no-referrer" className="rounded-full" src={friend.image || ''} alt={friend.name + ' image'} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{friend.name}</span>
              <span className="text-gray-500">{friend.email}</span>
            </div>

            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold p-1 rounded"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await axios.post('/api/friends/cancel-friend-request', { friendId: friend.id });
                  setItems((prev) => prev.filter((item) => item.id !== friend.id));
                } catch (error) {
                  if (error instanceof AxiosError) {
                    console.error(error.response?.data);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? <Icons.Loader2 className="animate-spin" /> : <Icons.X />}
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Requests;
