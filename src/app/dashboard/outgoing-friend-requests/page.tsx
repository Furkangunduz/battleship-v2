import { getOutGoingFriendRequests } from '@/helpers/get-outgoing-friend-requests';
import { authOptions } from '@/lib/auth';

import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import Requests from './_components/requests';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const requests = (await getOutGoingFriendRequests(session.user.id)) as User[];

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-medium mb-5">Outgoing Friend Requests</h1>

      {requests.length > 0 ? (
        <Requests requests={requests} sessionId={session.user.id} />
      ) : (
        <span className="text-sm font-normal text-gray-400">Nothing to see here... </span>
      )}
    </div>
  );
};

export default page;
