import type { ActorType, Role, ServiceEntitlement } from "@job-portal/auth-contracts";
import type { AuthRole, AuthUser } from "../entities/auth-user.entity.js";

export type AuthSession = {
  id: string;
  userId: string;
  actorType: Exclude<ActorType, "guest">;
  roles: AuthRole[];
  tenantId: string | null;
  status: "active" | "revoked";
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
};

export type RefreshTokenRecord = {
  id: string;
  sessionId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt: string | null;
  rotatedToTokenId: string | null;
  createdAt: string;
};

export type PasswordResetTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  actorType: Exclude<ActorType, "guest">;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type PhoneVerificationRecord = {
  id: string;
  tenantId: string | null;
  phoneNumber: string;
  codeHash: string;
  purpose: "register" | "reset_password";
  attempts: number;
  expiresAt: string;
  verifiedAt: string | null;
  consumedAt: string | null;
  createdAt: string;
};

export interface AuthUserRepository {
  findById(id: string): Promise<AuthUser | null>;
  findByEmail(email: string): Promise<AuthUser | null>;
  findCustomerByEmail(tenantId: string, email: string): Promise<AuthUser | null>;
  findCustomerByPhone(tenantId: string, phoneNumber: string): Promise<AuthUser | null>;
  findByGoogleSubject(tenantId: string | null, googleSubject: string): Promise<AuthUser | null>;
  findPlatformByIdentifier(identifier: string): Promise<AuthUser | null>;
  findTenantUserByIdentifier(tenantId: string, identifier: string): Promise<AuthUser | null>;
  save(user: AuthUser): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  getPlatformRoles(userId: string): Promise<AuthRole[]>;
  getTenantRoles(userId: string, tenantId: string): Promise<AuthRole[]>;
  getTenantServices(tenantId: string): Promise<ServiceEntitlement[]>;
  assignPlatformRoles(userId: string, roles: AuthRole[]): Promise<void>;
  assignTenantRoles(userId: string, tenantId: string, roles: AuthRole[]): Promise<void>;
  saveSession(session: AuthSession): Promise<void>;
  findSession(sessionId: string): Promise<AuthSession | null>;
  revokeSession(sessionId: string): Promise<void>;
  saveRefreshToken(token: RefreshTokenRecord): Promise<void>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  findRefreshTokensBySession(sessionId: string): Promise<RefreshTokenRecord[]>;
  revokeRefreshToken(tokenId: string, rotatedToTokenId?: string): Promise<void>;
  savePasswordResetToken(token: PasswordResetTokenRecord): Promise<void>;
  findPasswordResetTokens(userId: string): Promise<PasswordResetTokenRecord[]>;
  markPasswordResetTokenUsed(tokenId: string): Promise<void>;
  savePhoneVerification(record: PhoneVerificationRecord): Promise<void>;
  findPhoneVerifications(phoneNumber: string, tenantId: string | null, purpose: PhoneVerificationRecord["purpose"]): Promise<PhoneVerificationRecord[]>;
  updatePhoneVerification(record: PhoneVerificationRecord): Promise<void>;
  markPhoneVerificationConsumed(id: string): Promise<void>;
}
