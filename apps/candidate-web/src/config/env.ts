import { z } from "zod";

const serverEnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:8080")
});

export const env = serverEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL
});
