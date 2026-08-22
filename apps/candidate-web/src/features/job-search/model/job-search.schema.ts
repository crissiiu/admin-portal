import { z } from "zod";

export const jobSearchSchema = z.object({
  keyword: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional()
});

export type JobSearchInput = z.infer<typeof jobSearchSchema>;

