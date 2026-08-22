import type { UserProfile } from "../entities/user-profile.entity.js";

export interface UserProfileRepository {
  findById(id: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
}
