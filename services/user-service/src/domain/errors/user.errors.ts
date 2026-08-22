import { AppError } from "@job-portal/errors";

export class UserProfileNotFoundError extends AppError {
  constructor() {
    super(404, "User profile not found", "USER_PROFILE_NOT_FOUND");
  }
}
