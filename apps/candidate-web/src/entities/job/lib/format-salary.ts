import type { Job } from "../model/job.types";

export function formatSalary(job: Job) {
  if (!job.salaryRange) {
    return "Thỏa thuận";
  }

  return `${job.salaryRange.min.toLocaleString("vi-VN")} - ${job.salaryRange.max.toLocaleString("vi-VN")} VND`;
}

