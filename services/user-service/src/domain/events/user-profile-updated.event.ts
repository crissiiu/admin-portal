import type { DomainEvent } from "@job-portal/message-bus";

export type UserProfileUpdatedPayload = {
  userId: string;
};

export function userProfileUpdatedEvent(payload: UserProfileUpdatedPayload): DomainEvent<UserProfileUpdatedPayload> {
  return {
    id: crypto.randomUUID(),
    name: "user.profile_updated.v1",
    version: 1,
    occurredAt: new Date().toISOString(),
    payload
  };
}
