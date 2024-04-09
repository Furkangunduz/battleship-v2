import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from './Icons';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { SidebarOption } from '@/types/typings';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add-friend',
    Icon: 'UserPlus2',
  },
  {
    id: 2,
    name: 'Incoming Friend requests',
    href: '/dashboard/incoming-friend-requests',
    Icon: 'Loader2',
  },
  {
    id: 3,
    name: 'Outgoing friend requests',
    href: '/dashboard/outgoing-friend-requests',
    Icon: 'User2',
  },
];

export async function Sidebar({ className }: SidebarProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div className={className}>
      <div className="flex flex-col py-4 px-1 h-full">
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight mb-2">Friends</h2>
          <ScrollArea className="h-[350px] px-1">
            <div className="space-y-1 p-2">
              {new Array(10).fill(0).map((friend, i) => (
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
        </div>

        <Separator className="px-4" />
        <div className="px-3 py-2 mt-2">
          <div className="space-y-1">
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="truncate">{option.name}</span>
                </Link>
              );
            })}
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
