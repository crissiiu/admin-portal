import type { AuthUser } from "../../domain/entities/auth-user.entity.js";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository.js";

export class InMemoryAuthUserRepository implements AuthUserRepository {
  private readonly users = new Map<string, AuthUser>();

  async findByEmail(email: string) {
    return this.users.get(email.toLowerCase()) ?? null;
  }

  async save(user: AuthUser) {
    this.users.set(user.email, user);
  }
}
