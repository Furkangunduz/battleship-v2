import Image from 'next/image';
import SignOutButton from './SignOutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import SideBarFriendList from './SideBarFriendList';
import SideBarIncomingFriendRequestOption from './SideBarIncomingFriendRequestOption';
import { fetchRedis } from '@/helpers/fetch-redis';
import { Icons } from './Icons';
import SideBarOutgoingFriendRequestOption from './SideBarOutgoingFriendRequestOption';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function Sidebar({ className }: SidebarProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const unSeenIncomingFriendRequests =
    ((await fetchRedis('smembers', `user:${session.user.id}:incoming-friend-requests`)) as string[]).length ?? 0;

  const unSeenOutgoingFriendRequests =
    ((await fetchRedis('smembers', `user:${session.user.id}:outgoing-friend-requests`)) as string[]).length ?? 0;

  return (
    <div className={className}>
      <div className="flex flex-col py-4 px-1 h-full">
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight mb-2">Friends</h2>
          <SideBarFriendList sessionId={session.user.id} />
        </div>

        <Separator className="px-4" />
        <div className="px-3 py-2 mt-2">
          <div className="space-y-1">
            <Link
              key={'add-friend'}
              href={'/dashboard/add-friend'}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                <Icons.UserPlus2 className="h-4 w-4" />
              </span>

              <span className="truncate">Add friend</span>
            </Link>

            <SideBarIncomingFriendRequestOption sessionId={session.user.id} unseenRequestCount={unSeenIncomingFriendRequests} />

            <SideBarOutgoingFriendRequestOption sessionId={session.user.id} unseenRequestCount={unSeenOutgoingFriendRequests} />
          </div>
        </div>

        <Link href={'/profile'} className="mt-auto group">
          <div className="flex items-center px-1 py-1 bg-slate-50 group-hover:bg-slate-200 rounded-md mx-1">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="relative h-8 w-8 bg-gray-50">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session?.user.image || ''}
                  alt="Your profile picture"
                />
              </div>

              <span className="sr-only">Your profile</span>
              <div className="flex flex-col max-w-[140px]">
                <span className="truncate" aria-hidden="true">
                  {session.user.name}
                </span>
                <span className="text-xs text-zinc-400  truncate" aria-hidden="true">
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
