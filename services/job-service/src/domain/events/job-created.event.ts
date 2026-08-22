import type { DomainEvent } from "@job-portal/message-bus";

export type JobCreatedPayload = {
  jobId: string;
  companyId: string;
};

export function jobCreatedEvent(payload: JobCreatedPayload): DomainEvent<JobCreatedPayload> {
  return {
    id: crypto.randomUUID(),
    name: "job.created.v1",
    version: 1,
    occurredAt: new Date().toISOString(),
    payload
  };
}
