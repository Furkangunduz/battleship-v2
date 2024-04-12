'use client';

import { FC, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addFriendSchema, AddFriendFormValues } from '@/lib/validations/add-friend';
import axios, { AxiosError } from 'axios';
import { Icons } from '@/components/Icons';
import toast from 'react-hot-toast';

const Page: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccesState, setShowSuccesState] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AddFriendFormValues>({
    resolver: zodResolver(addFriendSchema),
  });

  async function onSubmit(values: AddFriendFormValues) {
    try {
      setIsLoading(true);
      const validatedValues = addFriendSchema.parse(values);
      await axios.post('/api/friends/requests/send', validatedValues);

      setShowSuccesState(true);
      toast.success('Friend request sent');
    } catch (error) {
      toast.error('Failed to send friend request');

      if (error instanceof z.ZodError) {
        error.errors.forEach((error) => {
          error.path &&
            error.path.forEach((path) => {
              setError(path as any, {
                message: error.message,
              });
            });
        });
        return;
      }

      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data.message });
        return;
      }
      setError('email', { message: 'Something went wrong.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccesState(false);
      }, 10 * 1000);

      setTimeout(() => {
        setError('email', { message: '' });
      }, 10 * 1000);
    }
  }

  return (
    <div className="mt-6 max-w-md">
      <h1 className="text-2xl font-medium mb-5">Add Friend </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 my-4">
        <div>
          <Input placeholder="friends Email" {...register('email')} />
          <p className="mt-1  ml-2 text-sm text-red-600">{errors.email?.message}</p>
          {showSuccesState && <p className="mt-1  ml-2 text-sm text-green-600"> Friend request sent</p>}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Add
        </Button>
      </form>
    </div>
  );
};

export default Page;
