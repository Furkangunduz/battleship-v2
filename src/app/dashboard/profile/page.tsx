import PreviousGames from "@/components/PreviousGames";
import ProfileForm from "@/components/ProfileForm";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  return (
    <div className="mt-6 max-w-md xl:mx-auto">
      <h1 className="mb-5 text-2xl font-medium">Profile </h1>

      <Separator className="w-full" />

      <ProfileForm session={session} />

      <h1 className="mb-1 mt-2 text-2xl font-medium">Previous Games </h1>

      <Separator className="mb-5 w-full" />

      <PreviousGames />
    </div>
  );
};

export default page;
