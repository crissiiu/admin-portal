import type { Job } from "../../domain/entities/job.entity.js";
import type { JobRepository } from "../../domain/repositories/job.repository.js";

export class InMemoryJobRepository implements JobRepository {
  private readonly jobs = new Map<string, Job>();

  async findAll() {
    return Array.from(this.jobs.values());
  }

  async findById(id: string) {
    return this.jobs.get(id) ?? null;
  }

  async save(job: Job) {
    this.jobs.set(job.id, job);
  }
}
