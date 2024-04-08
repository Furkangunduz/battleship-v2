import { Sidebar } from '@/components/SideBar';
import { FC, ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar className="max-w-xs" />
      <aside className="flex-1 bg-slate-100">{children}</aside>
    </div>
  );
};

export default layout;
