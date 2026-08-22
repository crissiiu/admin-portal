import type { ProblemDetails } from "@job-portal/api-contracts";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly problem?: ProblemDetails
  ) {
    super(message);
    this.name = "ApiError";
  }
}

