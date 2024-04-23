import { fetchRedis } from "./fetch-redis";

export const getGameRequests = async (userId: string) => {
  const friendIds = (await fetchRedis("smembers", `user:${userId}:incoming-game-requests`)) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
};
