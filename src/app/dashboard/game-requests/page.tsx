import { authOptions } from "@/lib/auth";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getGameRequests } from "@/helpers/get-game-requests";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import Requests from "./_components/requests";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const requests = (await getGameRequests(session.user.id)) as User[];

  return (
    <div className="mt-6">
      <h1 className="mb-5 text-2xl font-medium">Game Requests</h1>

      {requests.length > 0 ? (
        <ScrollArea className="flex max-h-screen flex-col">
          <div className="flex flex-col gap-5 p-2">
            <Requests requests={requests} sessionId={session.user.id} />
          </div>
        </ScrollArea>
      ) : (
        <span className="text-sm font-normal text-gray-400">Nothing to see here... </span>
      )}
    </div>
  );
};

export default page;
