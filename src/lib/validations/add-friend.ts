import { z } from 'zod';

export const addFriendSchema = z.object({
  email: z.string().email(),
});

export type AddFriendFormValues = z.infer<typeof addFriendSchema>;
