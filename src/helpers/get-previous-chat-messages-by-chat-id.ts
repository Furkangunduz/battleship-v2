import { Message, messageArrayValidator } from '@/lib/validations/message';
import { fetchRedis } from './fetch-redis';

export const getPreviousChatMessagesByChatId = async (chatId: string) => {
  const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1);

  const dbMessages = results.map((message) => JSON.parse(message) as Message);

  const reversedDbMessages = dbMessages.reverse();

  const messages = messageArrayValidator.parse(reversedDbMessages) as Message[];

  return messages;
};
