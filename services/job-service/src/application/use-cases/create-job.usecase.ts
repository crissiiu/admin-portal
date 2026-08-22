import type { MessagePublisher } from "@job-portal/message-bus";
import { jobCreatedEvent } from "../../domain/events/job-created.event.js";
import { Job, type JobType } from "../../domain/entities/job.entity.js";
import type { JobRepository } from "../../domain/repositories/job.repository.js";

export type CreateJobInput = {
  employerId: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
};

export class CreateJobUseCase {
  constructor(
    private readonly jobs: JobRepository,
    private readonly publisher: MessagePublisher
  ) {}

  async execute(input: CreateJobInput) {
    const job = Job.create(input);
    await this.jobs.save(job);
    await this.publisher.publish("job.events", jobCreatedEvent({ jobId: job.id, companyId: job.companyId }));
    return job;
  }
}
