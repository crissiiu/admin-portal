import { AppError } from "@job-portal/errors";

export class JobNotFoundError extends AppError {
  constructor() {
    super(404, "Job not found", "JOB_NOT_FOUND");
  }
}
