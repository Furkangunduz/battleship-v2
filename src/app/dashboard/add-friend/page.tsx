"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddFriendFormValues, addFriendSchema } from "@/lib/validations/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

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
      await axios.post("/api/friends/requests/send", validatedValues);

      setShowSuccesState(true);
      toast.success("Friend request sent");
    } catch (error) {
      toast.error("Failed to send friend request");

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
        setError("email", { message: error.response?.data.message });
        return;
      }
      setError("email", { message: "Something went wrong." });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccesState(false);
      }, 10 * 1000);

      setTimeout(() => {
        setError("email", { message: "" });
      }, 10 * 1000);
    }
  }

  return (
    <div className="mt-6 max-w-md">
      <h1 className="mb-5 text-2xl font-medium">Add Friend </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-8">
        <div>
          <Input placeholder="friends Email" {...register("email")} />
          <p className="ml-2 mt-1 text-sm text-red-600">{errors.email?.message}</p>
          {showSuccesState && <p className="ml-2 mt-1 text-sm text-green-600"> Friend request sent</p>}
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
