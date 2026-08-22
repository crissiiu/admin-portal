import "server-only";

import { mapJobDto } from "@/entities/job";
import { getJobById } from "@/shared/api/clients/job.client";

export async function getJobDetail(jobId: string) {
  return mapJobDto(await getJobById(jobId));
}

