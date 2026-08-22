import "dotenv/config";
import { z } from "zod";

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  KAFKA_BROKERS: z.string().default("localhost:9092"),
  REDIS_URL: z.string().optional()
});

export type ServiceConfig = z.infer<typeof baseSchema> & {
  serviceName: string;
  kafkaBrokers: string[];
};

export function loadConfig(serviceName: string): ServiceConfig {
  const parsed = baseSchema.parse(process.env);

  return {
    ...parsed,
    serviceName,
    kafkaBrokers: parsed.KAFKA_BROKERS.split(",").map((broker) => broker.trim()).filter(Boolean)
  };
}
