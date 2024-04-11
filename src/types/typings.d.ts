import { Icon } from '@/components/Icons';

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

interface FriendOption {
  id: number;
  label: string;
  Icon: Icon;
  onPress?: () => void;
  separator?: boolean;
  IconClor?: ClassValue;
}
