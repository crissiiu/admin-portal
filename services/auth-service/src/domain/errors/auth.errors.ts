import { AppError } from "@job-portal/errors";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }
}
