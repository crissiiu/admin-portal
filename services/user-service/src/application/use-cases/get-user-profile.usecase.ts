import { AppError } from "@job-portal/errors";
import type { UserProfileRepository } from "../../domain/repositories/user-profile.repository.js";

export class GetUserProfileUseCase {
  constructor(private readonly profiles: UserProfileRepository) {}

  async execute(id: string) {
    const profile = await this.profiles.findById(id);
    if (!profile) {
      throw new AppError(404, "User profile not found", "USER_PROFILE_NOT_FOUND");
    }

    return profile;
  }
}
