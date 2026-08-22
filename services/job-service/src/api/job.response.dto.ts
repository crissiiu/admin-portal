import type { Job } from "../domain/entities/job.entity.js";

export function toJobResponse(job: Job) {
  return {
    id: job.id,
    employerId: job.employerId,
    companyId: job.companyId,
    title: job.title,
    description: job.description,
    location: job.location,
    jobType: job.jobType,
    status: job.status,
    createdAt: job.createdAt,
    publishedAt: job.publishedAt
  };
}
