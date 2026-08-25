import { AppError } from "@job-portal/errors";
import {
  canAny,
  getPermissionsForRoles,
  isPlatformRole,
  isStaffRole,
  isTenantAdminRole,
  type ActorType,
  type Permission,
  type Role
} from "@job-portal/auth-contracts";
import type { AuthRole } from "../../domain/entities/auth-user.entity.js";
import { AuthUser } from "../../domain/entities/auth-user.entity.js";
import type { AuthSession, AuthUserRepository, PhoneVerificationRecord } from "../../domain/repositories/auth-user.repository.js";
import type { CustomerProfileClient, DefaultAddressInput } from "../ports/customer-profile-client.port.js";
import type { GoogleIdentityService } from "../services/google-identity.service.js";
import type { AddressValidationService } from "../services/address.service.js";
import type { OtpSender, PasswordResetSender } from "../services/notification.service.js";
import type { PasswordService } from "../services/password.service.js";
import type { RateLimiter } from "../services/rate-limit.service.js";
import {
  createOpaqueToken,
  daysFromNow,
  hashOpaqueToken,
  minutesFromNow
} from "../services/session-token.service.js";
import type { AccessTokenPayload, TokenService } from "../services/token.service.js";

const CUSTOMER_ROLES: AuthRole[] = ["customer_registered", "customer_loyalty"];
const TENANT_USER_CREATE_PERMISSIONS: Permission[] = ["tenant.admin.manage", "tenant.staff.manage", "hr.role.assign"];

export type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  session: AuthSession;
  permissions: Permission[];
  customerProfileId?: string;
};

export class AuthFlowUseCase {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly googleIdentity: GoogleIdentityService,
    private readonly otpSender: OtpSender,
    private readonly passwordResetSender: PasswordResetSender,
    private readonly customerProfiles: CustomerProfileClient,
    private readonly rateLimiter: RateLimiter,
    private readonly addressValidation: AddressValidationService
  ) {}

  async requestPhoneVerification(input: { tenantId: string; phoneNumber: string; purpose: PhoneVerificationRecord["purpose"] }) {
    await this.rateLimiter.consume(`otp:${input.tenantId}:${input.phoneNumber}`);
    const code = process.env.NODE_ENV === "production" ? Math.floor(100000 + Math.random() * 900000).toString() : (process.env.DEV_OTP_CODE ?? "123456");
    const record: PhoneVerificationRecord = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      phoneNumber: input.phoneNumber,
      codeHash: await this.passwordService.hash(code),
      purpose: input.purpose,
      attempts: 0,
      expiresAt: minutesFromNow(10),
      verifiedAt: null,
      consumedAt: null,
      createdAt: new Date().toISOString()
    };
    await this.users.savePhoneVerification(record);
    await this.otpSender.sendPhoneOtp({ phoneNumber: input.phoneNumber, code, purpose: input.purpose });
    return { expiresAt: record.expiresAt };
  }

  async verifyPhone(input: { tenantId: string; phoneNumber: string; purpose: PhoneVerificationRecord["purpose"]; code: string }) {
    const record = await this.findLatestPhoneVerification(input.phoneNumber, input.tenantId, input.purpose);
    if (!record || record.consumedAt || new Date(record.expiresAt).getTime() <= Date.now()) {
      throw new AppError(400, "Invalid verification code", "AUTH_INVALID_PHONE_VERIFICATION");
    }
    if (record.attempts >= 5) {
      throw new AppError(429, "Too many verification attempts", "AUTH_PHONE_VERIFICATION_LOCKED");
    }

    const valid = await this.passwordService.compare(input.code, record.codeHash);
    const updated = {
      ...record,
      attempts: record.attempts + 1,
      verifiedAt: valid ? new Date().toISOString() : record.verifiedAt
    };
    await this.users.updatePhoneVerification(updated);

    if (!valid) {
      throw new AppError(400, "Invalid verification code", "AUTH_INVALID_PHONE_VERIFICATION");
    }

    return { verified: true };
  }

  async registerCustomerWithEmail(input: CustomerRegisterInput & { email: string; password: string }) {
    await this.rateLimiter.consume(`register:customer:${input.tenantId}`);
    await this.assertVerifiedPhone(input.tenantId, input.phoneNumber, "register");
    await this.assertNewCustomer(input.tenantId, input.email, input.phoneNumber);
    await this.addressValidation.validateDefaultAddress(input.defaultAddress);

    const user = AuthUser.create({
      name: input.name,
      email: input.email,
      phoneNumber: input.phoneNumber,
      passwordHash: await this.passwordService.hash(input.password),
      phoneVerifiedAt: new Date().toISOString(),
      tenantId: input.tenantId,
      role: "customer_registered",
      actorType: "customer"
    });
    await this.users.save(user);
    await this.users.markPhoneVerificationConsumed((await this.findLatestPhoneVerification(input.phoneNumber, input.tenantId, "register"))!.id);
    const profile = await this.customerProfiles.createCustomerProfile({ ...input, authUserId: user.id, email: user.email });
    return this.issueAuth(user, "customer", ["customer_registered"], input.tenantId, profile.customerProfileId);
  }

  async registerCustomerWithPhone(input: CustomerRegisterInput & { password: string }) {
    await this.rateLimiter.consume(`register:customer:${input.tenantId}`);
    await this.assertVerifiedPhone(input.tenantId, input.phoneNumber, "register");
    await this.assertNewCustomer(input.tenantId, null, input.phoneNumber);
    await this.addressValidation.validateDefaultAddress(input.defaultAddress);

    const user = AuthUser.create({
      name: input.name,
      phoneNumber: input.phoneNumber,
      passwordHash: await this.passwordService.hash(input.password),
      phoneVerifiedAt: new Date().toISOString(),
      tenantId: input.tenantId,
      role: "customer_registered",
      actorType: "customer"
    });
    await this.users.save(user);
    await this.users.markPhoneVerificationConsumed((await this.findLatestPhoneVerification(input.phoneNumber, input.tenantId, "register"))!.id);
    const profile = await this.customerProfiles.createCustomerProfile({ ...input, authUserId: user.id, email: null });
    return this.issueAuth(user, "customer", ["customer_registered"], input.tenantId, profile.customerProfileId);
  }

  async registerCustomerWithGoogle(input: CustomerRegisterInput & { idToken: string }) {
    await this.rateLimiter.consume(`register:customer:${input.tenantId}`);
    await this.assertVerifiedPhone(input.tenantId, input.phoneNumber, "register");
    const googleProfile = await this.googleIdentity.verifyIdToken(input.idToken);
    await this.assertNewCustomer(input.tenantId, googleProfile.email, input.phoneNumber);
    await this.addressValidation.validateDefaultAddress(input.defaultAddress);

    const user = AuthUser.create({
      name: input.name || googleProfile.name || "Customer",
      email: googleProfile.email,
      phoneNumber: input.phoneNumber,
      phoneVerifiedAt: new Date().toISOString(),
      googleSubject: googleProfile.subject,
      tenantId: input.tenantId,
      role: "customer_registered",
      actorType: "customer"
    });
    await this.users.save(user);
    await this.users.markPhoneVerificationConsumed((await this.findLatestPhoneVerification(input.phoneNumber, input.tenantId, "register"))!.id);
    const profile = await this.customerProfiles.createCustomerProfile({ ...input, name: user.name, authUserId: user.id, email: user.email });
    return this.issueAuth(user, "customer", ["customer_registered"], input.tenantId, profile.customerProfileId);
  }

  async loginCustomerWithEmail(input: { tenantId: string; email: string; password: string }) {
    await this.rateLimiter.consume(`login:customer:${input.tenantId}`);
    const user = await this.users.findCustomerByEmail(input.tenantId, input.email);
    await this.assertPasswordLogin(user, input.password);
    this.assertPhoneVerified(user!);
    return this.issueAuth(user!, "customer", [user!.role], input.tenantId);
  }

  async loginCustomerWithPhone(input: { tenantId: string; phoneNumber: string; password: string }) {
    await this.rateLimiter.consume(`login:customer:${input.tenantId}`);
    const user = await this.users.findCustomerByPhone(input.tenantId, input.phoneNumber);
    await this.assertPasswordLogin(user, input.password);
    this.assertPhoneVerified(user!);
    return this.issueAuth(user!, "customer", [user!.role], input.tenantId);
  }

  async loginCustomerWithGoogle(input: { tenantId: string; idToken: string }) {
    await this.rateLimiter.consume(`login:customer:${input.tenantId}`);
    const profile = await this.googleIdentity.verifyIdToken(input.idToken);
    const user = await this.users.findByGoogleSubject(input.tenantId, profile.subject);
    if (!user || user.status !== "active") {
      throw this.invalidCredentials();
    }
    this.assertPhoneVerified(user);
    return this.issueAuth(user, "customer", [user.role], input.tenantId);
  }

  async loginTenant(input: { tenantId: string; identifier: string; password: string }) {
    await this.rateLimiter.consume(`login:tenant:${input.tenantId}`);
    const user = await this.users.findTenantUserByIdentifier(input.tenantId, input.identifier);
    await this.assertPasswordLogin(user, input.password);
    const roles = await this.users.getTenantRoles(user!.id, input.tenantId);
    if (roles.length === 0) {
      throw this.invalidCredentials();
    }
    return this.issueAuth(user!, "tenant_user", roles, input.tenantId);
  }

  async loginPlatform(input: { identifier: string; password: string }) {
    await this.rateLimiter.consume("login:platform");
    const user = await this.users.findPlatformByIdentifier(input.identifier);
    await this.assertPasswordLogin(user, input.password);
    const roles = await this.users.getPlatformRoles(user!.id);
    if (roles.length === 0) {
      throw this.invalidCredentials();
    }
    return this.issueAuth(user!, "platform_user", roles, null);
  }

  async forgotPassword(input: { actorType: "customer" | "tenant_user" | "platform_user"; tenantId?: string; identifier: string }) {
    await this.rateLimiter.consume(`forgot:${input.actorType}:${input.tenantId ?? "global"}`);
    if (input.actorType === "customer" && input.tenantId && !input.identifier.includes("@")) {
      await this.requestPhoneVerification({ tenantId: input.tenantId, phoneNumber: input.identifier, purpose: "reset_password" });
      return { accepted: true };
    }

    const user = await this.findUserForPasswordFlow(input);
    if (user) {
      const token = createOpaqueToken();
      await this.users.savePasswordResetToken({
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash: hashOpaqueToken(token),
        actorType: input.actorType,
        expiresAt: minutesFromNow(30),
        usedAt: null,
        createdAt: new Date().toISOString()
      });
      await this.passwordResetSender.sendPasswordReset({ email: user.email, phoneNumber: user.phoneNumber, token });
    }
    return { accepted: true };
  }

  async resetPassword(input: { actorType: "customer" | "tenant_user" | "platform_user"; tenantId?: string; identifier: string; token: string; newPassword: string }) {
    const user = await this.findUserForPasswordFlow(input);
    if (!user) {
      throw new AppError(400, "Invalid reset token", "AUTH_INVALID_RESET_TOKEN");
    }

    if (input.actorType === "customer" && input.tenantId && !input.identifier.includes("@")) {
      await this.verifyPhone({
        tenantId: input.tenantId,
        phoneNumber: input.identifier,
        purpose: "reset_password",
        code: input.token
      });
      const record = await this.findLatestPhoneVerification(input.identifier, input.tenantId, "reset_password");
      if (record) await this.users.markPhoneVerificationConsumed(record.id);
      await this.users.updatePassword(user.id, await this.passwordService.hash(input.newPassword));
      return { updated: true };
    }

    const tokens = await this.users.findPasswordResetTokens(user.id);
    const resetToken = await this.findMatchingPasswordResetToken(tokens, input.token);
    if (!resetToken || resetToken.usedAt || new Date(resetToken.expiresAt).getTime() <= Date.now()) {
      throw new AppError(400, "Invalid reset token", "AUTH_INVALID_RESET_TOKEN");
    }

    await this.users.updatePassword(user.id, await this.passwordService.hash(input.newPassword));
    await this.users.markPasswordResetTokenUsed(resetToken.id);
    return { updated: true };
  }

  async updatePassword(input: { payload: AccessTokenPayload; currentPassword: string; newPassword: string }) {
    const user = await this.users.findById(input.payload.sub);
    await this.assertPasswordLogin(user, input.currentPassword);
    await this.users.updatePassword(user!.id, await this.passwordService.hash(input.newPassword));
    return { updated: true };
  }

  async refresh(input: { refreshToken: string }) {
    const tokenHash = hashOpaqueToken(input.refreshToken);
    const current = await this.users.findRefreshTokenByHash(tokenHash);
    if (!current || current.revokedAt || new Date(current.expiresAt).getTime() <= Date.now()) {
      throw new AppError(401, "Invalid refresh token", "AUTH_INVALID_REFRESH_TOKEN");
    }
    const session = await this.users.findSession(current.sessionId);
    if (!session || session.status !== "active" || new Date(session.expiresAt).getTime() <= Date.now()) {
      throw new AppError(401, "Invalid refresh token", "AUTH_INVALID_REFRESH_TOKEN");
    }
    const newRefreshToken = createOpaqueToken();
    const newRefreshRecord = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      tokenHash: hashOpaqueToken(newRefreshToken),
      expiresAt: daysFromNow(Number(process.env.REFRESH_TOKEN_DAYS ?? 30)),
      revokedAt: null,
      rotatedToTokenId: null,
      createdAt: new Date().toISOString()
    };
    await this.users.saveRefreshToken(newRefreshRecord);
    await this.users.revokeRefreshToken(current.id, newRefreshRecord.id);
    const user = await this.users.findById(session.userId);
    if (!user) throw new AppError(401, "Invalid refresh token", "AUTH_INVALID_REFRESH_TOKEN");
    const accessToken = this.signAccessToken(user, session);
    return { accessToken, refreshToken: newRefreshToken, user, session, permissions: getPermissionsForRoles(session.roles) };
  }

  async logout(input: { payload: AccessTokenPayload }) {
    await this.users.revokeSession(input.payload.sid);
    const tokens = await this.users.findRefreshTokensBySession(input.payload.sid);
    await Promise.all(tokens.map((token) => this.users.revokeRefreshToken(token.id)));
    return { loggedOut: true };
  }

  async me(input: { payload: AccessTokenPayload }) {
    const user = await this.users.findById(input.payload.sub);
    const session = await this.users.findSession(input.payload.sid);
    if (!user || !session || session.status !== "active") {
      throw new AppError(401, "Invalid session", "AUTH_INVALID_SESSION");
    }
    return {
      user,
      actorType: session.actorType,
      roles: session.roles,
      permissions: getPermissionsForRoles(session.roles),
      tenantId: session.tenantId,
      phoneVerified: Boolean(user.phoneVerifiedAt)
    };
  }

  async createTenantUser(input: { actor: AccessTokenPayload; tenantId: string; name: string; email: string; phoneNumber: string; password: string; roles: AuthRole[] }) {
    this.assertCanAssignTenantRoles(input.actor, input.roles);
    const passwordHash = await this.passwordService.hash(input.password);
    const user = AuthUser.create({
      name: input.name,
      email: input.email,
      phoneNumber: input.phoneNumber,
      passwordHash,
      role: input.roles[0],
      tenantId: input.tenantId,
      actorType: "tenant_user",
      phoneVerifiedAt: new Date().toISOString()
    });
    await this.users.save(user);
    await this.users.assignTenantRoles(user.id, input.tenantId, input.roles);
    return { user };
  }

  async createPlatformUser(input: { actor: AccessTokenPayload; name: string; email: string; phoneNumber: string; password: string; roles: AuthRole[] }) {
    if (!canAny({ actorType: input.actor.actorType, actorId: input.actor.sub, roles: input.actor.roles }, ["platform.admin.manage"])) {
      throw new AppError(403, "Missing permission", "AUTH_FORBIDDEN");
    }
    if (!input.roles.every((role) => isPlatformRole(role))) {
      throw new AppError(400, "Invalid platform roles", "AUTH_INVALID_ROLE");
    }
    const user = AuthUser.create({
      name: input.name,
      email: input.email,
      phoneNumber: input.phoneNumber,
      passwordHash: await this.passwordService.hash(input.password),
      role: input.roles[0],
      actorType: "platform_user",
      phoneVerifiedAt: new Date().toISOString()
    });
    await this.users.save(user);
    await this.users.assignPlatformRoles(user.id, input.roles);
    return { user };
  }

  private async issueAuth(user: AuthUser, actorType: Exclude<ActorType, "guest">, roles: AuthRole[], tenantId: string | null, customerProfileId?: string): Promise<AuthResult> {
    const session: AuthSession = {
      id: crypto.randomUUID(),
      userId: user.id,
      actorType,
      roles,
      tenantId,
      status: "active",
      expiresAt: daysFromNow(Number(process.env.SESSION_DAYS ?? 30)),
      revokedAt: null,
      createdAt: new Date().toISOString()
    };
    const refreshToken = createOpaqueToken();
    await this.users.saveSession(session);
    await this.users.saveRefreshToken({
      id: crypto.randomUUID(),
      sessionId: session.id,
      tokenHash: hashOpaqueToken(refreshToken),
      expiresAt: daysFromNow(Number(process.env.REFRESH_TOKEN_DAYS ?? 30)),
      revokedAt: null,
      rotatedToTokenId: null,
      createdAt: new Date().toISOString()
    });

    return {
      user,
      accessToken: this.signAccessToken(user, session),
      refreshToken,
      session,
      permissions: getPermissionsForRoles(roles),
      customerProfileId
    };
  }

  private signAccessToken(user: AuthUser, session: AuthSession) {
    return this.tokenService.sign({
      sub: user.id,
      sid: session.id,
      actorType: session.actorType,
      roles: session.roles,
      tenantId: session.tenantId ?? undefined,
      phoneVerified: Boolean(user.phoneVerifiedAt)
    });
  }

  private async assertPasswordLogin(user: AuthUser | null, password: string) {
    if (!user || user.status !== "active" || !user.passwordHash) {
      throw this.invalidCredentials();
    }
    const valid = await this.passwordService.compare(password, user.passwordHash);
    if (!valid) {
      throw this.invalidCredentials();
    }
  }

  private assertPhoneVerified(user: AuthUser) {
    if (!user.phoneVerifiedAt) {
      throw new AppError(403, "Phone number is not verified", "AUTH_PHONE_NOT_VERIFIED");
    }
  }

  private async assertNewCustomer(tenantId: string, email: string | null, phoneNumber: string) {
    const existingByPhone = await this.users.findCustomerByPhone(tenantId, phoneNumber);
    const existingByEmail = email ? await this.users.findCustomerByEmail(tenantId, email) : null;
    if (existingByPhone || existingByEmail) {
      throw new AppError(409, "Customer already exists", "AUTH_CUSTOMER_EXISTS");
    }
  }

  private async assertVerifiedPhone(tenantId: string, phoneNumber: string, purpose: PhoneVerificationRecord["purpose"]) {
    const record = await this.findLatestPhoneVerification(phoneNumber, tenantId, purpose);
    if (!record || !record.verifiedAt || record.consumedAt || new Date(record.expiresAt).getTime() <= Date.now()) {
      throw new AppError(403, "Phone number is not verified", "AUTH_PHONE_NOT_VERIFIED");
    }
  }

  private async findLatestPhoneVerification(phoneNumber: string, tenantId: string | null, purpose: PhoneVerificationRecord["purpose"]) {
    const records = await this.users.findPhoneVerifications(phoneNumber, tenantId, purpose);
    return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
  }

  private async findUserForPasswordFlow(input: { actorType: "customer" | "tenant_user" | "platform_user"; tenantId?: string; identifier: string }) {
    if (input.actorType === "customer") {
      if (!input.tenantId) return null;
      return input.identifier.includes("@")
        ? this.users.findCustomerByEmail(input.tenantId, input.identifier)
        : this.users.findCustomerByPhone(input.tenantId, input.identifier);
    }
    if (input.actorType === "tenant_user") {
      if (!input.tenantId) return null;
      return this.users.findTenantUserByIdentifier(input.tenantId, input.identifier);
    }
    return this.users.findPlatformByIdentifier(input.identifier);
  }

  private async findMatchingPasswordResetToken(tokens: Awaited<ReturnType<AuthUserRepository["findPasswordResetTokens"]>>, token: string) {
    for (const record of tokens) {
      if (hashOpaqueToken(token) === record.tokenHash) {
        return record;
      }
    }
    return null;
  }

  private assertCanAssignTenantRoles(actor: AccessTokenPayload, roles: AuthRole[]) {
    const requestedRolesAreTenantScoped = roles.every((role) => isTenantAdminRole(role) || isStaffRole(role));
    if (!requestedRolesAreTenantScoped) {
      throw new AppError(400, "Invalid tenant roles", "AUTH_INVALID_ROLE");
    }
    if (!canAny({ actorType: actor.actorType, actorId: actor.sub, roles: actor.roles, tenantId: actor.tenantId }, TENANT_USER_CREATE_PERMISSIONS)) {
      throw new AppError(403, "Missing permission", "AUTH_FORBIDDEN");
    }
  }

  private invalidCredentials() {
    return new AppError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }
}

export type CustomerRegisterInput = {
  tenantId: string;
  name: string;
  phoneNumber: string;
  defaultAddress: DefaultAddressInput;
};
