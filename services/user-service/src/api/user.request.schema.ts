import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phoneNumber: z.string().min(6).optional(),
  bio: z.string().max(1000).optional()
});
