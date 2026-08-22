import type { ErrorRequestHandler } from "express";
import { normalizeError } from "@job-portal/errors";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const normalized = normalizeError(error);
  res.status(normalized.statusCode).json(normalized.body);
};
