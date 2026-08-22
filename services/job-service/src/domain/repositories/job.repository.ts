import type { Job } from "../entities/job.entity.js";

export interface JobRepository {
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  save(job: Job): Promise<void>;
}
