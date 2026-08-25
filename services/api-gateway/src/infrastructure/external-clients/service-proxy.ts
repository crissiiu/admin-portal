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
      headers: this.responseHeaders(response),
      body
    };
  }

  private forwardHeaders(req: Request) {
    const requestId = req.headers["x-request-id"];
    const authorization = req.headers.authorization;
    const cookie = req.headers.cookie;
    const headers: Record<string, string> = { "content-type": "application/json" };
    const actorHeaders = [
      "x-actor-id",
      "x-actor-type",
      "x-actor-roles",
      "x-tenant-id",
      "x-session-id",
      "x-request-id"
    ];

    if (requestId) headers["x-request-id"] = requestId.toString();
    if (authorization) headers.authorization = authorization;
    if (cookie) headers.cookie = cookie;
    for (const header of actorHeaders) {
      const value = req.headers[header];
      if (value) headers[header] = value.toString();
    }
    if (!req.method) throw new AppError(400, "Invalid request method", "GATEWAY_INVALID_METHOD");

    return headers;
  }

  private responseHeaders(response: Response) {
    const headers: Record<string, string | string[]> = {
      "content-type": response.headers.get("content-type") ?? "application/json"
    };
    const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
    const setCookies = getSetCookie?.call(response.headers);
    if (setCookies?.length) {
      headers["set-cookie"] = setCookies;
    } else {
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) headers["set-cookie"] = setCookie;
    }
    return headers;
  }
}
