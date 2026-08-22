import { z } from "zod";

export const createJobRequestSchema = z.object({
  employerId: z.string().min(1),
  companyId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  jobType: z.enum(["full_time", "part_time", "contract", "internship", "remote"])
});
