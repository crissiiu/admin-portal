import type { DomainEvent } from "@job-portal/message-bus";

export type UserRegisteredPayload = {
  authUserId: string;
  email: string;
  role: string;
};

export function userRegisteredEvent(payload: UserRegisteredPayload): DomainEvent<UserRegisteredPayload> {
  return {
    id: crypto.randomUUID(),
    name: "user.registered.v1",
    version: 1,
    occurredAt: new Date().toISOString(),
    payload
  };
}
