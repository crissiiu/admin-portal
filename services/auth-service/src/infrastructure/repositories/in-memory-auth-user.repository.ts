import type { ServiceEntitlement } from "@job-portal/auth-contracts";
import { SERVICE_ENTITLEMENTS } from "@job-portal/auth-contracts";
import type { AuthRole, AuthUser } from "../../domain/entities/auth-user.entity.js";
import type {
  AuthSession,
  AuthUserRepository,
  PasswordResetTokenRecord,
  PhoneVerificationRecord,
  RefreshTokenRecord
} from "../../domain/repositories/auth-user.repository.js";

export class InMemoryAuthUserRepository implements AuthUserRepository {
  private readonly usersById = new Map<string, AuthUser>();
  private readonly platformRolesByUserId = new Map<string, AuthRole[]>();
  private readonly tenantRolesByUserAndTenant = new Map<string, AuthRole[]>();
  private readonly tenantServicesByTenant = new Map<string, ServiceEntitlement[]>();
  private readonly sessions = new Map<string, AuthSession>();
  private readonly refreshTokens = new Map<string, RefreshTokenRecord>();
  private readonly passwordResetTokens = new Map<string, PasswordResetTokenRecord>();
  private readonly phoneVerifications = new Map<string, PhoneVerificationRecord>();

  async findById(id: string) {
    return this.usersById.get(id) ?? null;
  }

  async findByEmail(email: string) {
    const normalized = email.toLowerCase();
    return [...this.usersById.values()].find((user) => user.email === normalized) ?? null;
  }

  async findCustomerByEmail(tenantId: string, email: string) {
    const normalized = email.toLowerCase();
    return (
      [...this.usersById.values()].find(
        (user) => user.actorType === "customer" && user.tenantId === tenantId && user.email === normalized
      ) ?? null
    );
  }

  async findCustomerByPhone(tenantId: string, phoneNumber: string) {
    return (
      [...this.usersById.values()].find(
        (user) => user.actorType === "customer" && user.tenantId === tenantId && user.phoneNumber === phoneNumber
      ) ?? null
    );
  }

  async findByGoogleSubject(tenantId: string | null, googleSubject: string) {
    return (
      [...this.usersById.values()].find(
        (user) => user.tenantId === tenantId && user.googleSubject === googleSubject
      ) ?? null
    );
  }

  async findPlatformByIdentifier(identifier: string) {
    const normalized = identifier.toLowerCase();
    return (
      [...this.usersById.values()].find(
        (user) =>
          user.actorType === "platform_user" &&
          (user.email === normalized || user.phoneNumber === identifier) &&
          (this.platformRolesByUserId.get(user.id)?.length ?? 0) > 0
      ) ?? null
    );
  }

  async findTenantUserByIdentifier(tenantId: string, identifier: string) {
    const normalized = identifier.toLowerCase();
    return (
      [...this.usersById.values()].find(
        (user) =>
          user.actorType === "tenant_user" &&
          (user.email === normalized || user.phoneNumber === identifier) &&
          (this.tenantRolesByUserAndTenant.get(this.tenantRoleKey(user.id, tenantId))?.length ?? 0) > 0
      ) ?? null
    );
  }

  async save(user: AuthUser) {
    this.usersById.set(user.id, user);
    if (user.actorType === "platform_user") {
      await this.assignPlatformRoles(user.id, [user.role]);
    }
    if (user.actorType === "tenant_user" && user.tenantId) {
      await this.assignTenantRoles(user.id, user.tenantId, [user.role]);
    }
    if (user.tenantId && !this.tenantServicesByTenant.has(user.tenantId)) {
      this.tenantServicesByTenant.set(user.tenantId, [...SERVICE_ENTITLEMENTS]);
    }
  }

  async updatePassword(userId: string, passwordHash: string) {
    const user = this.usersById.get(userId);
    if (user) {
      this.usersById.set(userId, user.withPasswordHash(passwordHash));
    }
  }

  async getPlatformRoles(userId: string) {
    return this.platformRolesByUserId.get(userId) ?? [];
  }

  async getTenantRoles(userId: string, tenantId: string) {
    return this.tenantRolesByUserAndTenant.get(this.tenantRoleKey(userId, tenantId)) ?? [];
  }

  async getTenantServices(tenantId: string) {
    return this.tenantServicesByTenant.get(tenantId) ?? [];
  }

  async assignPlatformRoles(userId: string, roles: AuthRole[]) {
    this.platformRolesByUserId.set(userId, roles);
  }

  async assignTenantRoles(userId: string, tenantId: string, roles: AuthRole[]) {
    this.tenantRolesByUserAndTenant.set(this.tenantRoleKey(userId, tenantId), roles);
    if (!this.tenantServicesByTenant.has(tenantId)) {
      this.tenantServicesByTenant.set(tenantId, [...SERVICE_ENTITLEMENTS]);
    }
  }

  async saveSession(session: AuthSession) {
    this.sessions.set(session.id, session);
  }

  async findSession(sessionId: string) {
    return this.sessions.get(sessionId) ?? null;
  }

  async revokeSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.set(sessionId, { ...session, status: "revoked", revokedAt: new Date().toISOString() });
    }
  }

  async saveRefreshToken(token: RefreshTokenRecord) {
    this.refreshTokens.set(token.id, token);
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return [...this.refreshTokens.values()].find((token) => token.tokenHash === tokenHash) ?? null;
  }

  async findRefreshTokensBySession(sessionId: string) {
    return [...this.refreshTokens.values()].filter((token) => token.sessionId === sessionId);
  }

  async revokeRefreshToken(tokenId: string, rotatedToTokenId?: string) {
    const token = this.refreshTokens.get(tokenId);
    if (token) {
      this.refreshTokens.set(tokenId, {
        ...token,
        revokedAt: new Date().toISOString(),
        rotatedToTokenId: rotatedToTokenId ?? token.rotatedToTokenId
      });
    }
  }

  async savePasswordResetToken(token: PasswordResetTokenRecord) {
    this.passwordResetTokens.set(token.id, token);
  }

  async findPasswordResetTokens(userId: string) {
    return [...this.passwordResetTokens.values()].filter((token) => token.userId === userId);
  }

  async markPasswordResetTokenUsed(tokenId: string) {
    const token = this.passwordResetTokens.get(tokenId);
    if (token) {
      this.passwordResetTokens.set(tokenId, { ...token, usedAt: new Date().toISOString() });
    }
  }

  async savePhoneVerification(record: PhoneVerificationRecord) {
    this.phoneVerifications.set(record.id, record);
  }

  async findPhoneVerifications(phoneNumber: string, tenantId: string | null, purpose: PhoneVerificationRecord["purpose"]) {
    return [...this.phoneVerifications.values()].filter(
      (record) => record.phoneNumber === phoneNumber && record.tenantId === tenantId && record.purpose === purpose
    );
  }

  async updatePhoneVerification(record: PhoneVerificationRecord) {
    this.phoneVerifications.set(record.id, record);
  }

  async markPhoneVerificationConsumed(id: string) {
    const record = this.phoneVerifications.get(id);
    if (record) {
      this.phoneVerifications.set(id, { ...record, consumedAt: new Date().toISOString() });
    }
  }

  private tenantRoleKey(userId: string, tenantId: string) {
    return `${tenantId}:${userId}`;
  }
}
