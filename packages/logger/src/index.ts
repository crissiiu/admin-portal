import pino from "pino";
import { pinoHttp } from "pino-http";

export function createLogger(serviceName: string) {
  return pino({
    name: serviceName,
    level: process.env.LOG_LEVEL ?? "info"
  });
}

export function createHttpLogger(serviceName: string) {
  return pinoHttp({
    logger: createLogger(serviceName),
    genReqId: (request) => request.headers["x-request-id"]?.toString() ?? crypto.randomUUID()
  });
}
