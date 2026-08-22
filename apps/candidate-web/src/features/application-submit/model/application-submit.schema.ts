import { z } from "zod";

export const applicationSubmitSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().trim().max(2000).optional()
});

export type ApplicationSubmitInput = z.infer<typeof applicationSubmitSchema>;

