'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function signInWithGoogle() {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <p className="text-center text-gray-600 dark:text-gray-400">Sign In with Google</p>

      <Button variant="outline" type="button" disabled={isLoading} onClick={signInWithGoogle}>
        {isLoading ? <Icons.LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  );
}
