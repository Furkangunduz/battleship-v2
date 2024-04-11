import { getOutGoingFriendRequests } from '@/helpers/get-outgoing-friend-requests';
import { authOptions } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';

import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { Icons } from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getIncomingFriendRequests } from '@/helpers/get-incoming-friend-requests';
import Requests from './_components/requests';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const requests = (await getIncomingFriendRequests(session.user.id)) as User[];

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-medium mb-5">Incoming Friend Requests</h1>

      {requests.length > 0 ? (
        <ScrollArea className="max-h-screen flex flex-col">
          <div className="flex flex-col gap-5 p-2">
            <Requests requests={requests} />
          </div>
        </ScrollArea>
      ) : (
        <span className="text-sm font-normal text-gray-400">Nothing to see here... </span>
      )}
    </div>
  );
};

export default page;
