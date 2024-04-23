import { Icons } from "@/components/Icons";
import SidebarFriendList from "@/components/Sidebar/SidebarFriendList";
import SidebarGameRequestOption from "@/components/Sidebar/SidebarGameRequestOption";
import SidebarIncomingFriendRequestOption from "@/components/Sidebar/SidebarIncomingFriendRequestOption";
import SidebarOutgoingFriendRequestOption from "@/components/Sidebar/SidebarOutgoingFriendRequestOption";
import SignOutButton from "@/components/Sidebar/SignOutButton";
import { Separator } from "@/components/ui/separator";
import { fetchRedis } from "@/helpers/fetch-redis";
import { getFriends } from "@/helpers/get-friends";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function Sidebar({ className }: SidebarProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const unSeenIncomingFriendRequests = ((await fetchRedis("smembers", `user:${session.user.id}:incoming-friend-requests`)) as string[]).length ?? 0;
  const unSeenOutgoingFriendRequests = ((await fetchRedis("smembers", `user:${session.user.id}:outgoing-friend-requests`)) as string[]).length ?? 0;
  const unSeenGameRequests = ((await fetchRedis("smembers", `user:${session.user.id}:incoming-game-requests`)) as string[]).length ?? 0;

  const friendList = (await getFriends(session.user.id)) as User[];

  return (
    <div className={className}>
      <div className="flex h-full flex-col px-1 py-4">
        <Link href={"/dashboard"} className="mb-5 flex items-center py-2 pl-8">
          <Icons.Ship size={40} />
          <h1 className="ml-2 text-2xl font-semibold tracking-tight">NavalWarfare</h1>
        </Link>

        <div className="flex flex-col py-2">
          <h2 className="relative mb-2 px-7 text-lg font-semibold tracking-tight">Friends</h2>
          <Separator className="w-[80%] self-center" />

          <SidebarFriendList sessionId={session.user.id} friends={friendList} />
        </div>

        <div className="mt-2 flex flex-col py-2">
          <h2 className="relative mb-2 px-7 text-lg font-semibold tracking-tight">Requests</h2>
          <Separator className="w-[80%] self-center" />

          <div className="space-y-1 pl-5">
            <Link
              key={"add-friend"}
              href={"/dashboard/add-friend"}
              className="group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                <Icons.UserPlus2 className="h-4 w-4" />
              </span>

              <span className="truncate">Add friend</span>
            </Link>

            <SidebarIncomingFriendRequestOption sessionId={session.user.id} unseenRequestCount={unSeenIncomingFriendRequests} />

            <SidebarOutgoingFriendRequestOption sessionId={session.user.id} unseenRequestCount={unSeenOutgoingFriendRequests} />

            <SidebarGameRequestOption sessionId={session.user.id} unseenRequestCount={unSeenGameRequests} />
          </div>
        </div>

        <Link href={"/dashboard/profile"} className="group mt-auto">
          <div className="mx-1 flex items-center rounded-md bg-slate-50 px-1 py-1 group-hover:bg-slate-200">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="relative h-8 w-8">
                <Image fill referrerPolicy="no-referrer" className="rounded-full" src={session?.user.image || ""} alt="Your profile picture" />
              </div>

              <span className="sr-only">Your profile</span>
              <div className="flex max-w-[140px] flex-col">
                <span className="truncate" aria-hidden="true">
                  {session.user.name}
                </span>
                <span className="truncate text-xs text-zinc-400" aria-hidden="true">
                  {session.user.email}
                </span>
              </div>
            </div>

            <SignOutButton />
          </div>
        </Link>
      </div>
    </div>
  );
}
