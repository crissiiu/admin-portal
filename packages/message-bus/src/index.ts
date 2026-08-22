import { Kafka } from "kafkajs";

export type DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  name: string;
  version: number;
  occurredAt: string;
  payload: TPayload;
};

export interface MessagePublisher {
  publish<TPayload extends Record<string, unknown>>(topic: string, event: DomainEvent<TPayload>): Promise<void>;
}

export class KafkaMessagePublisher implements MessagePublisher {
  private readonly producer;

  constructor(clientId: string, brokers: string[]) {
    this.producer = new Kafka({ clientId, brokers }).producer();
  }

  async publish<TPayload extends Record<string, unknown>>(topic: string, event: DomainEvent<TPayload>) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ key: event.id, value: JSON.stringify(event) }]
    });
  }
}

export class NoopMessagePublisher implements MessagePublisher {
  async publish() {
    return undefined;
  }
}
