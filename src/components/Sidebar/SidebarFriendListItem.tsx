"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, cn, PusherEvents, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { FriendOption } from "@/types/typings";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../Icons";

interface SideBarFriendListItemProps {
  friend: User;
  sessionId: string;
}

const friendOptions: FriendOption[] = [
  {
    id: 1,
    label: "Invite to Game",
    Icon: "Ship",
  },
  {
    id: 2,
    label: "Chat",
    Icon: "MessageSquareMore",
    separator: true,
    href: "/dashboard/chat",
  },
  {
    id: 3,
    label: "Remove Friend",
    Icon: "UserMinus2",
    IconClor: "text-red-500",
  },
];

const SideBarFriendListItem: FC<SideBarFriendListItemProps> = ({ friend, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isRemoveFriendDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false);
  const [isInviteGameDialogOpen, setIsInviteGameDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unSeendMessageCount, setUnSeendMessageCount] = useState<number>(0);

  function optionClickHandler(option: FriendOption) {
    switch (option.label) {
      case "Invite to Game":
        setIsInviteGameDialogOpen(true);
        break;
      case "Chat":
        setUnSeendMessageCount(0);
        router.push(option.href + "/" + chatHrefConstructor(friend.id, sessionId));
        break;
      case "Remove Friend":
        setIsRemoveDialogOpen(true);
        break;
    }
  }

  async function removeFriend(friendId: string) {
    try {
      setIsLoading(true);
      await axios.post("/api/friends/remove", { friendId });
      toast.success("Friend removed successfully");
    } catch (error) {
      toast.error("Failed to remove friend");
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        return;
      }
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRemoveDialogOpen(false);
    }
  }

  async function sendInvite(friendId: string) {
    try {
      setIsLoading(true);
      await axios.post("/api/game/invite", { friendId });
      toast.success("Invite sent successfully");
    } catch (error) {
      toast.error("Failed to send invite");
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        return;
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));

    const newMessageHandler = (message: Message) => {
      if (pathname?.includes("chat")) return;
      if (message.senderId === friend.id) {
        setUnSeendMessageCount((prev) => prev + 1);
        toast.success("New message from " + friend.name);
      }
    };

    pusherClient.bind(PusherEvents.MESSAGES.NEW, newMessageHandler);

    return () => {
      pusherClient.unbind(PusherEvents.MESSAGES.NEW, newMessageHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, pathname]);

  return (
    <>
      <span
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          " group w-full"
        )}
      >
        <Link
          className="flex w-full items-center justify-between gap-2 font-normal hover:text-indigo-600"
          key={`$friend-${friend.id}`}
          href={`/dashboard/friend/${friend.id}`}
        >
          <span className="flex items-center gap-2">
            <span className="rounded-2xl border border-gray-200 p-1 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
              {friend.image ? (
                <Image width={20} height={20} src={friend.image} alt={friend.name} className="size-7 rounded-full" />
              ) : (
                <Icons.User2 size={18} className="text-slate-500" />
              )}
            </span>
            <span className="truncate">{friend.name}</span>

            {unSeendMessageCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{unSeendMessageCount}</span>
            )}
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
                    <Button variant={"ghost"} className="w-full items-center justify-start gap-2 p-0">
                      <span className="ml-2">{option.label}</span>
                      <Icon className={cn("size-4", option?.IconClor)} />
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

      {/* Remove Friend Dialog  */}
      <Dialog
        open={isRemoveFriendDialogOpen}
        onOpenChange={(open) => {
          setIsRemoveDialogOpen(open);
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
                removeFriend(friend.id);
              }}
            >
              <Button type="button" variant="secondary" className="bg-red-500 text-white hover:bg-red-400">
                {isLoading ? <Icons.LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "delete"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Game Dialog */}
      <Dialog
        open={isInviteGameDialogOpen}
        onOpenChange={(open) => {
          setIsInviteGameDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Game</DialogTitle>
          </DialogHeader>

          <div>
            Invite will be sent to <span className="font-semibold">{friend.name}</span>. When they accept, you will be able to play games together.
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                setIsInviteGameDialogOpen(false);
                sendInvite(friend.id);
              }}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideBarFriendListItem;
