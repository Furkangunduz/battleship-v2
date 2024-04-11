import Link from 'next/link';
import { FC } from 'react';
import { Icons } from '../Icons';

interface SideBarGameRequestOptionProps {
  sessionId: string;
  unseenRequestCount: number;
}

const SideBarGameRequestOption: FC<SideBarGameRequestOptionProps> = ({ unseenRequestCount }) => {
  return (
    <Link
      href={'/dashboard/game-requests'}
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center cursor-pointer"
    >
      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <Icons.Ship className="h-4 w-4" />
      </span>

      <span className="truncate">Game Requests</span>

      {unseenRequestCount > 0 && (
        <span className="text-xs bg-indigo-500 text-white size-5 rounded-full flex items-center justify-center">{unseenRequestCount}</span>
      )}
    </Link>
  );
};

export default SideBarGameRequestOption;
