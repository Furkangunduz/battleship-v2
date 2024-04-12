'use client';
import { chatHrefConstructor, cn } from '@/lib/utils';
import { FC, useState } from 'react';
import { Button, buttonVariants } from '../ui/button';
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
import { useRouter } from 'next/navigation';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface SideBarFriendListItemProps {
  friend: User;
  sessionId: string;
}

const friendOptions: FriendOption[] = [
  {
    id: 1,
    label: 'Invite to Game',
    Icon: 'Ship',
  },
  {
    id: 2,
    label: 'Chat',
    Icon: 'MessageSquareMore',
    separator: true,
    href: '/dashboard/chat',
  },
  {
    id: 3,
    label: 'Remove Friend',
    Icon: 'UserMinus2',
    IconClor: 'text-red-500',
  },
];

const SideBarFriendListItem: FC<SideBarFriendListItemProps> = ({ friend, sessionId }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function optionClickHandler(option: FriendOption) {
    switch (option.label) {
      case 'Invite to Game':
        break;
      case 'Chat':
        router.push(option.href + '/' + chatHrefConstructor(option.id.toString(), sessionId));
        break;
      case 'Remove Friend':
        setIsDialogOpen(true);
        break;
    }
  }

  async function removeFriend(friendId: string) {
    try {
      setLoading(true);
      await axios.post('/api/friends/remove', { friendId });
      toast.success('Friend removed successfully');
    } catch (error) {
      toast.error('Failed to remove friend');
      if (error instanceof AxiosError) {
        console.error(error.response?.data);

        return;
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span
        className={cn(
          buttonVariants({
            variant: 'ghost',
          }),
          ' group w-full'
        )}
      >
        <Link
          className="w-full flex gap-2 justify-between items-center font-normal hover:text-indigo-600"
          key={`$friend-${friend.id}`}
          href={`/dashboard/friend/${friend.id}`}
        >
          <span className="flex gap-2 items-center">
            <span className=" border rounded-lg p-1 text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 ">
              <Icons.User2 size={18} className="text-slate-500 " />
            </span>
            <span className="truncate">{friend.name}</span>
          </span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.DotsHorizontalIcon className="size-6 px-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {friendOptions.map((option) => {
              const Icon = Icons[option.Icon];

              return (
                <>
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => {
                      optionClickHandler(option);
                    }}
                  >
                    <Button variant={'ghost'} className="p-0 gap-2 w-full items-center justify-start">
                      <span className="ml-2">{option.label}</span>
                      <Icon className={cn('size-4', option?.IconClor)} />
                    </Button>
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
      </span>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Friend</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold">{friend.name}</span> from your friend list?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <DialogClose
              asChild
              onClick={() => {
                setIsDialogOpen(false);
                removeFriend(friend.id);
              }}
            >
              <Button type="button" variant="secondary" className="bg-red-400 text-white">
                I am sure
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideBarFriendListItem;
