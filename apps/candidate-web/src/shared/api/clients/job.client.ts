import "server-only";

import { httpClient } from "@/shared/api/http-client";
import type { JobDto } from "@/shared/api/contracts/job.dto";

export function getJobs() {
  return httpClient<JobDto[]>("/jobs");
}

export function getJobById(jobId: string) {
  return httpClient<JobDto>(`/jobs/${jobId}`);
}

