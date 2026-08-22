import type { DomainEvent } from "@job-portal/message-bus";

export type GatewayRequestRoutedPayload = {
  serviceName: string;
  path: string;
};

export function gatewayRequestRoutedEvent(payload: GatewayRequestRoutedPayload): DomainEvent<GatewayRequestRoutedPayload> {
  return {
    id: crypto.randomUUID(),
    name: "gateway.request_routed.v1",
    version: 1,
    occurredAt: new Date().toISOString(),
    payload
  };
}
