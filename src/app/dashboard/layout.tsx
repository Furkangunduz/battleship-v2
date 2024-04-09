import { Sidebar } from '@/components/SideBar';
import { FC, ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar className="max-w-xs bg-slate-50" />
      <aside className="flex-1  px-2 py-1">{children}</aside>
    </div>
  );
};

export default layout;
