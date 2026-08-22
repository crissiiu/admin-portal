import type { AuthUser } from "../domain/entities/auth-user.entity.js";

export function toAuthUserResponse(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt
  };
}
