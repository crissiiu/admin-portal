import { z } from "zod";

export const registerRequestSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  phoneNumber: z.string().min(6)
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});
