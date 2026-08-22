import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = "APP_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function normalizeError(error: unknown) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: { success: false, code: error.code, message: error.message }
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: { success: false, code: "VALIDATION_ERROR", issues: error.issues }
    };
  }

  return {
    statusCode: 500,
    body: { success: false, code: "INTERNAL_SERVER_ERROR", message: "Internal server error" }
  };
}
