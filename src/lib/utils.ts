import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export const PusherEvents = {
  REQUESTS: {
    INCOMING: "incoming_friend_requests",
    OUTGOING: "outgoing_friend_requests",
    DENY: "deny_request",
    ACCEPT: "accept_request",
    CANCEL: "cancel_request",
  },
  FRIENDS: {
    NEW: "new_friend",
    REMOVE: "remove_friend",
  },
  MESSAGES: {
    INCOMING: "incoming_message",
    NEW: "new_message",
  },
  GAME: {
    INCOMING: "incoming_game_requests",
    ACCEPT: "accept_game_request",
    DENY: "deny_game_request",
  },
};

export type PusherRequestEvent = (typeof PusherEvents.REQUESTS)[keyof typeof PusherEvents.REQUESTS];
