'use client';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { buttonVariants } from '../ui/button';
import { Icons } from '../Icons';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FriendOption } from '@/types/typings';

interface SideBarFriendListItemProps {
  friend: User;
}

const friendOptions: FriendOption[] = [
  {
    id: 1,
    label: 'Invite to Game',
    Icon: 'Ship',
  },
  { id: 2, label: 'Chat', Icon: 'MessageSquareMore', separator: true },
  {
    id: 3,
    label: 'Remove Friend',
    Icon: 'UserMinus2',
    IconClor: 'text-red-500',
  },
];

const SideBarFriendListItem: FC<SideBarFriendListItemProps> = ({ friend }) => {
  return (
    <Link
      key={`$friend-${friend.id}`}
      href={`/dashboard/friend/${friend.id}`}
      className={cn(
        buttonVariants({
          variant: 'ghost',
        }),
        'w-full flex gap-2 justify-between items-center font-normal hover:text-indigo-600 group pr-2'
      )}
    >
      <span className="flex gap-2 items-center">
        <span className=" border rounded-lg p-1 text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 ">
          <Icons.User2 size={18} className="text-slate-500 " />
        </span>
        <span className="truncate">{friend.name}</span>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.DotsHorizontalIcon className="size-6 px-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {friendOptions.map((option) => {
            const Icon = Icons[option.Icon];

            return (
              <>
                <DropdownMenuItem key={option.id}>
                  <span className="flex items-center gap-3 w-full justify-between cursor-pointer">
                    <span className="ml-2">{option.label}</span>
                    <Icon className={cn('size-4', option?.IconClor)} />
                  </span>
                </DropdownMenuItem>
                {option?.separator && (
                  <span className="mt-4">
                    <DropdownMenuSeparator />
                  </span>
                )}
              </>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
};

export default SideBarFriendListItem;
