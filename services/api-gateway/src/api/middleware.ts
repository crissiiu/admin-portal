import jwt from "jsonwebtoken";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "@job-portal/errors";
import { normalizeError } from "@job-portal/errors";
import { canAll, hasAllServices, type ActorType, type Permission, type Role, type ServiceEntitlement } from "@job-portal/auth-contracts";

type GatewayTokenPayload = {
  sub: string;
  sid: string;
  actorType: Exclude<ActorType, "guest">;
  roles: Role[];
  tenantId?: string;
  phoneVerified: boolean;
};

type BackendPolicy = {
  access: "public" | "auth";
  permissions?: Permission[];
  services?: ServiceEntitlement[];
};

const publicAuthPaths = [
  "/api/auth/customer/phone-verifications/request",
  "/api/auth/customer/phone-verifications/verify",
  "/api/auth/customer/register/email",
  "/api/auth/customer/register/phone",
  "/api/auth/customer/register/google",
  "/api/auth/customer/login/email",
  "/api/auth/customer/login/phone",
  "/api/auth/customer/login/google",
  "/api/auth/customer/password/forgot",
  "/api/auth/customer/password/reset",
  "/api/auth/tenant/login",
  "/api/auth/tenant/password/forgot",
  "/api/auth/tenant/password/reset",
  "/api/auth/platform/login",
  "/api/auth/platform/password/forgot",
  "/api/auth/platform/password/reset",
  "/api/auth/refresh"
];

export const authorizationMiddleware: RequestHandler = (req, _res, next) => {
  try {
    const policy = resolveBackendPolicy(req.method, req.path);
    if (policy.access === "public") {
      next();
      return;
    }

    const token = getBearerToken(req) ?? getCookie(req, "sales_builder_access_token");
    if (!token) {
      throw new AppError(401, "Missing access token", "GATEWAY_AUTH_REQUIRED");
    }

    const payload = verifyGatewayToken(token);
    const context = {
      actorType: payload.actorType,
      actorId: payload.sub,
      roles: payload.roles,
      tenantId: payload.tenantId,
      tenantServices: parseTenantServices(req)
    };

    if (policy.permissions && !canAll(context, policy.permissions)) {
      throw new AppError(403, "Missing permission", "GATEWAY_FORBIDDEN");
    }
    if (policy.services && !hasAllServices(context, policy.services)) {
      throw new AppError(403, "Service is not enabled", "GATEWAY_SERVICE_NOT_ENABLED");
    }

    req.headers["x-actor-id"] = payload.sub;
    req.headers["x-actor-type"] = payload.actorType;
    req.headers["x-actor-roles"] = payload.roles.join(",");
    req.headers["x-session-id"] = payload.sid;
    if (payload.tenantId) req.headers["x-tenant-id"] = payload.tenantId;
    next();
  } catch (error) {
    next(error);
  }
};

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = req.headers["x-request-id"]?.toString() ?? crypto.randomUUID();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const normalized = normalizeError(error);
  res.status(normalized.statusCode).json(normalized.body);
};

function resolveBackendPolicy(method: string, path: string): BackendPolicy {
  if (path === "/health" || publicAuthPaths.includes(path)) {
    return { access: "public" };
  }

  if (path.startsWith("/api/auth/")) {
    return { access: "auth" };
  }

  if (path.startsWith("/api/users")) {
    return { access: "auth", permissions: method === "GET" ? ["customer.read_own"] : ["customer.update_own"] };
  }

  if (path.startsWith("/api/jobs") && method === "GET") {
    return { access: "public" };
  }

  if (path.startsWith("/api/jobs")) {
    return { access: "auth", permissions: ["product.create"], services: ["service.product_catalog"] };
  }

  return { access: "auth" };
}

function verifyGatewayToken(token: string): GatewayTokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, "JWT secret is not configured", "GATEWAY_JWT_SECRET_MISSING");
  }

  try {
    return jwt.verify(token, secret) as GatewayTokenPayload;
  } catch {
    throw new AppError(401, "Invalid access token", "GATEWAY_INVALID_TOKEN");
  }
}

function getBearerToken(req: Parameters<RequestHandler>[0]) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

function getCookie(req: Parameters<RequestHandler>[0], name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  for (const cookie of cookieHeader.split(";")) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function parseTenantServices(req: Parameters<RequestHandler>[0]) {
  const header = req.headers["x-tenant-services"]?.toString();
  if (!header) return [];
  return header.split(",").map((service) => service.trim()).filter(Boolean) as ServiceEntitlement[];
}
