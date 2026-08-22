import type { JobRepository } from "../../domain/repositories/job.repository.js";

export class ListJobsUseCase {
  constructor(private readonly jobs: JobRepository) {}

  execute() {
    return this.jobs.findAll();
  }
}
