import { fetchRedis } from './fetch-redis';

export async function getFriendsByUserId(userId: string) {
  const friendIdList = (await fetchRedis('smembers', `user:${userId}:friends`)) as string[];

  const friends = (await Promise.all(
    friendIdList.map(async (friendId) => {
      return JSON.parse(await fetchRedis('get', `user:${friendId}`)) as User;
    })
  )) as User[];

  return friends;
}
