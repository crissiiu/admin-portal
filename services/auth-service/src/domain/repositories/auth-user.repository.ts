import type { AuthUser } from "../entities/auth-user.entity.js";

export interface AuthUserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  save(user: AuthUser): Promise<void>;
}
