import type { AuthUser } from "../domain/entities/auth-user.entity.js";
import type { AuthResult } from "../application/use-cases/auth-flow.usecase.js";

export function toAuthUserResponse(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    actorType: user.actorType,
    tenantId: user.tenantId,
    phoneVerified: Boolean(user.phoneVerifiedAt),
    createdAt: user.createdAt
  };
}

export function toAuthResultResponse(result: AuthResult) {
  return {
    success: true,
    user: toAuthUserResponse(result.user),
    actorType: result.session.actorType,
    roles: result.session.roles,
    permissions: result.permissions,
    tenantId: result.session.tenantId,
    phoneVerified: Boolean(result.user.phoneVerifiedAt),
    customerProfileId: result.customerProfileId
  };
}
