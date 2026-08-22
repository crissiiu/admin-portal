import type { JobDto } from "@/shared/api/contracts/job.dto";

import type { Job } from "./job.types";

export function mapJobDto(dto: JobDto): Job {
  return {
    id: dto.id,
    title: dto.title,
    companyName: dto.companyName,
    location: dto.location,
    salaryRange:
      dto.salaryMin && dto.salaryMax
        ? {
            min: dto.salaryMin,
            max: dto.salaryMax
          }
        : undefined,
    status: dto.status
  };
}

