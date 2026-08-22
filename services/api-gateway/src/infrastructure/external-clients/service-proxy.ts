import type { Request } from "express";
import { AppError } from "@job-portal/errors";

export type ServiceName = "auth" | "users" | "jobs";

type ServiceUrls = Record<ServiceName, string>;

export class ServiceProxy {
  constructor(private readonly urls: ServiceUrls) {}

  async forward(serviceName: ServiceName, req: Request) {
    const baseUrl = this.urls[serviceName];
    const upstreamPath = req.originalUrl.replace(`/api/${serviceName}`, "/api");
    const upstream = new URL(upstreamPath, baseUrl);

    const response = await fetch(upstream, {
      method: req.method,
      headers: this.forwardHeaders(req),
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body)
    });

    const body = await response.text();
    return {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
      body
    };
  }

  private forwardHeaders(req: Request) {
    const requestId = req.headers["x-request-id"];
    const authorization = req.headers.authorization;
    const headers: Record<string, string> = { "content-type": "application/json" };

    if (requestId) headers["x-request-id"] = requestId.toString();
    if (authorization) headers.authorization = authorization;
    if (!req.method) throw new AppError(400, "Invalid request method", "GATEWAY_INVALID_METHOD");

    return headers;
  }
}
