import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  name: z.string().max(20),
  image: z.any(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
