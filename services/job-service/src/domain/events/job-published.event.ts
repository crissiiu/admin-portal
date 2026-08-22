import type { DomainEvent } from "@job-portal/message-bus";

export type JobPublishedPayload = {
  jobId: string;
  companyId: string;
};

export function jobPublishedEvent(payload: JobPublishedPayload): DomainEvent<JobPublishedPayload> {
  return {
    id: crypto.randomUUID(),
    name: "job.published.v1",
    version: 1,
    occurredAt: new Date().toISOString(),
    payload
  };
}
