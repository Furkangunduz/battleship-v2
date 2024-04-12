import { fetchRedis } from './fetch-redis';

export const getUserById = async (userId: string) => {
  const user = (await fetchRedis('get', `user:${userId}`)) as string;
  const parsedUser = JSON.parse(user) as User;
  return parsedUser;
};
