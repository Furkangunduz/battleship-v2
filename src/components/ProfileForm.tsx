"use client";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileFormValues, profileSchema } from "@/lib/validations/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProfileFormProps {
  session: Session;
}

const ProfileForm: FC<ProfileFormProps> = ({ session }) => {
  const route = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: session?.user?.email!,
      name: session?.user?.name!,
      image: session?.user?.image!,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(session.user.image ?? null);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setImage(file);
    } else {
      setPreviewImage(null);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "navalWars");

    const response = await fetch("https://api.cloudinary.com/v1_1/daxvgvogn/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (mode === "view") {
        toggleMode();
        return;
      }
      setIsLoading(true);

      const imageUrl = await uploadImageToCloudinary(image!);
      values.image = imageUrl;

      const validatedValues = profileSchema.parse(values);

      await axios.put("/api/profile/update", validatedValues);

      setShowSuccessMessage(true);
      toast.success("Profile updated successfully");
      route.refresh();
    } catch (error) {
      toast.error("Failed to update profile");

      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path) {
            setError(err.path as any, {
              message: err.message,
            });
          }
        });
      } else if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized");
        }
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }
  };

  const toggleMode = () => {
    setMode(mode === "view" ? "edit" : "view");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4 flex flex-col space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          {previewImage && <Image width={100} height={100} src={previewImage} alt="Preview" className="size-20 rounded-full object-cover" />}
          <Input disabled={mode === "view"} type="file" placeholder="Profile Picture" {...register("image")} onChange={handleFileChange} />
        </div>
        <p className="ml-2 mt-1 text-sm text-red-600">{errors.image?.message?.toString()}</p>

        <Input disabled={mode === "view"} placeholder="Email" {...register("email")} />
        <p className="ml-2 mt-1 text-sm text-red-600">{errors.email?.message}</p>

        <Input disabled={mode === "view"} placeholder="Name" {...register("name")} />
        <p className="ml-2 mt-1 text-sm text-red-600">{errors.name?.message}</p>
        {showSuccessMessage && <p className="ml-2 mt-1 text-sm text-green-600">Profile updated successfully</p>}
      </div>

      <div className="flex gap-4 self-end">
        {mode === "edit" && <Button onClick={toggleMode}>Cancel</Button>}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "view" ? "Edit" : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
