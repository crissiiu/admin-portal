import { AppError } from "@job-portal/errors";
import type { UserProfileRepository } from "../../domain/repositories/user-profile.repository.js";

export type UpdateUserProfileInput = {
  name?: string;
  phoneNumber?: string;
  bio?: string;
};

export class UpdateUserProfileUseCase {
  constructor(private readonly profiles: UserProfileRepository) {}

  async execute(id: string, input: UpdateUserProfileInput) {
    const profile = await this.profiles.findById(id);
    if (!profile) {
      throw new AppError(404, "User profile not found", "USER_PROFILE_NOT_FOUND");
    }

    const updated = profile.update(input);
    await this.profiles.save(updated);

    return updated;
  }
}
