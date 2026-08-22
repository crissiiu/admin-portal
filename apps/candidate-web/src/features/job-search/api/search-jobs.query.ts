import "server-only";

import { mapJobDto } from "@/entities/job";
import { getJobs } from "@/shared/api/clients/job.client";

export async function searchJobs() {
  const jobs = await getJobs();
  return jobs.map(mapJobDto);
}

