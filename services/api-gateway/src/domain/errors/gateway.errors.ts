import { AppError } from "@job-portal/errors";

export class UpstreamServiceError extends AppError {
  constructor() {
    super(502, "Upstream service error", "GATEWAY_UPSTREAM_ERROR");
  }
}
