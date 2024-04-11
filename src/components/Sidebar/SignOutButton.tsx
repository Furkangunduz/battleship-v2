'use client';

import { signOut } from 'next-auth/react';
import { ButtonHTMLAttributes, FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Icons } from '../Icons';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  return (
    <Button
      {...props}
      variant={'ghost'}
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error('There was a problem signing out');
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? <Icons.Loader2 className="animate-spin h-4 w-4" /> : <Icons.LogOut className="w-4 h-4" />}
    </Button>
  );
};

export default SignOutButton;
