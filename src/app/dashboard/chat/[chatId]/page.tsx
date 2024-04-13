import ChatInput from "@/components/Chat/ChatInput";
import Messages from "@/components/Chat/Messages";
import { getPreviousChatMessagesByChatId } from "@/helpers/get-previous-chat-messages-by-chat-id";
import { getUserById } from "@/helpers/get-user-by-id";
import { authOptions } from "@/lib/auth";
import { Message } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartner = (await getUserById(chatPartnerId)) as User;
  const initialMessages = (await getPreviousChatMessagesByChatId(chatId)) as Message[];

  return (
    <div className="flex h-full max-h-[calc(100vh-3rem)] flex-1 flex-col justify-between">
      <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
        <Link href={`/dashboard/friend/${chatPartnerId}`} className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image fill referrerPolicy="no-referrer" src={chatPartner.image} alt={`${chatPartner.name} profile picture`} className="rounded-full" />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 font-semibold text-gray-700">{chatPartner.name}</span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </Link>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
