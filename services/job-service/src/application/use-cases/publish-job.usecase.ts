import { AppError } from "@job-portal/errors";
import type { MessagePublisher } from "@job-portal/message-bus";
import { jobPublishedEvent } from "../../domain/events/job-published.event.js";
import type { JobRepository } from "../../domain/repositories/job.repository.js";

export class PublishJobUseCase {
  constructor(
    private readonly jobs: JobRepository,
    private readonly publisher: MessagePublisher
  ) {}

  async execute(id: string) {
    const job = await this.jobs.findById(id);
    if (!job) {
      throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
    }

    const published = job.publish();
    await this.jobs.save(published);
    await this.publisher.publish("job.events", jobPublishedEvent({ jobId: published.id, companyId: published.companyId }));
    return published;
  }
}
