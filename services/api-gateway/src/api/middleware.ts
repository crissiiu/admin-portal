import type { ErrorRequestHandler, RequestHandler } from "express";
import { normalizeError } from "@job-portal/errors";

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
