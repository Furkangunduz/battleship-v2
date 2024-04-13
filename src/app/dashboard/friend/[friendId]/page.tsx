import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    friendId: string;
  };
}

const page = async ({ params }: pageProps) => {
  const friendId = params.friendId;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return <div>friendId : {friendId}</div>;
};

export default page;
