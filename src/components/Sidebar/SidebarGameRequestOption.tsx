import Link from "next/link";
import { FC } from "react";
import { Icons } from "../Icons";

interface SideBarGameRequestOptionProps {
  sessionId: string;
  unseenRequestCount: number;
}

const SideBarGameRequestOption: FC<SideBarGameRequestOptionProps> = ({ unseenRequestCount }) => {
  return (
    <Link
      href={"/dashboard/game-requests"}
      className="group flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <Icons.Ship className="h-4 w-4" />
      </span>

      <span className="truncate">Game Requests</span>

      {unseenRequestCount > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{unseenRequestCount}</span>
      )}
    </Link>
  );
};

export default SideBarGameRequestOption;
