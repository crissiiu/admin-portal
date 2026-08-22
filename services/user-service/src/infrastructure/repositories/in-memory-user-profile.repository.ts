import { UserProfile } from "../../domain/entities/user-profile.entity.js";
import type { UserProfileRepository } from "../../domain/repositories/user-profile.repository.js";

export class InMemoryUserProfileRepository implements UserProfileRepository {
  private readonly profiles = new Map<string, UserProfile>([
    ["demo-user", new UserProfile("demo-user", "demo-auth-user", "Demo User", "demo@example.com", "0000000000", null, "active")]
  ]);

  async findById(id: string) {
    return this.profiles.get(id) ?? null;
  }

  async save(profile: UserProfile) {
    this.profiles.set(profile.id, profile);
  }
}
