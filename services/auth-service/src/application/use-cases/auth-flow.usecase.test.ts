import { beforeEach, describe, expect, it } from "vitest";
import { AuthUser } from "../../domain/entities/auth-user.entity.js";
import { InMemoryAuthUserRepository } from "../../infrastructure/repositories/in-memory-auth-user.repository.js";
import { LocalGoogleIdentityService } from "../services/google-identity.service.js";
import { VietnamAddressValidationService } from "../services/address.service.js";
import { LocalNotificationService } from "../services/notification.service.js";
import { BcryptPasswordService } from "../services/password.service.js";
import { NoopRateLimiter } from "../services/rate-limit.service.js";
import { JwtTokenService } from "../services/token.service.js";
import { NoopCustomerProfileClient } from "../ports/customer-profile-client.port.js";
import { customerRegisterEmailSchema } from "../../api/auth.request.schema.js";
import { AuthFlowUseCase } from "./auth-flow.usecase.js";

describe("AuthFlowUseCase", () => {
  let repository: InMemoryAuthUserRepository;
  let passwordService: BcryptPasswordService;
  let useCase: AuthFlowUseCase;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";
    process.env.DEV_OTP_CODE = "123456";
    repository = new InMemoryAuthUserRepository();
    passwordService = new BcryptPasswordService();
    const notificationService = new LocalNotificationService();
    useCase = new AuthFlowUseCase(
      repository,
      passwordService,
      new JwtTokenService(),
      new LocalGoogleIdentityService(),
      notificationService,
      notificationService,
      new NoopCustomerProfileClient(),
      new NoopRateLimiter(),
      new VietnamAddressValidationService()
    );
  });

  it("rejects public customer register payloads that try to assign roles", () => {
    expect(() =>
      customerRegisterEmailSchema.parse({
        tenantId: "tenant-1",
        name: "Customer",
        email: "customer@example.com",
        phoneNumber: "0900000000",
        password: "Password1",
        role: "platform_admin",
        defaultAddress: defaultAddress()
      })
    ).toThrow();
  });

  it("rejects legacy three-level Vietnam address fields", () => {
    expect(() =>
      customerRegisterEmailSchema.parse({
        tenantId: "tenant-1",
        name: "Customer",
        email: "customer@example.com",
        phoneNumber: "0900000000",
        password: "Password1",
        defaultAddress: {
          fullName: "Customer",
          phoneNumber: "0900000000",
          line1: "123 Main Street",
          ward: "Phuong Cu",
          district: "Quan Cu",
          city: "Ho Chi Minh",
          country: "VN"
        }
      })
    ).toThrow();
  });

  it("requires verified phone before customer email registration", async () => {
    await expect(
      useCase.registerCustomerWithEmail({
        tenantId: "tenant-1",
        name: "Customer",
        email: "customer@example.com",
        phoneNumber: "0900000000",
        password: "Password1",
        defaultAddress: defaultAddress()
      })
    ).rejects.toMatchObject({ code: "AUTH_PHONE_NOT_VERIFIED" });
  });

  it("registers and logs in a customer with customer context only", async () => {
    await verifyPhone("tenant-1", "0900000000");
    const registered = await useCase.registerCustomerWithEmail({
      tenantId: "tenant-1",
      name: "Customer",
      email: "customer@example.com",
      phoneNumber: "0900000000",
      password: "Password1",
      defaultAddress: defaultAddress()
    });

    expect(registered.session.actorType).toBe("customer");
    expect(registered.session.roles).toEqual(["customer_registered"]);
    expect(registered.permissions).toContain("customer.read_own");
    expect(registered.permissions).not.toContain("tenant.dashboard.access");

    const loggedIn = await useCase.loginCustomerWithEmail({
      tenantId: "tenant-1",
      email: "customer@example.com",
      password: "Password1"
    });
    expect(loggedIn.session.actorType).toBe("customer");
    expect(loggedIn.session.tenantId).toBe("tenant-1");
  });

  it("resets a customer password with phone OTP", async () => {
    await verifyPhone("tenant-1", "0900000000");
    await useCase.registerCustomerWithPhone({
      tenantId: "tenant-1",
      name: "Customer",
      phoneNumber: "0900000000",
      password: "Password1",
      defaultAddress: defaultAddress()
    });

    await useCase.forgotPassword({
      actorType: "customer",
      tenantId: "tenant-1",
      identifier: "0900000000"
    });
    await useCase.resetPassword({
      actorType: "customer",
      tenantId: "tenant-1",
      identifier: "0900000000",
      token: "123456",
      newPassword: "Password2"
    });

    const loggedIn = await useCase.loginCustomerWithPhone({
      tenantId: "tenant-1",
      phoneNumber: "0900000000",
      password: "Password2"
    });
    expect(loggedIn.session.actorType).toBe("customer");
  });

  it("logs in tenant users from active tenant roles without platform permissions", async () => {
    const user = AuthUser.create({
      name: "Tenant Admin",
      email: "tenant@example.com",
      phoneNumber: "0911111111",
      passwordHash: await passwordService.hash("Password1"),
      phoneVerifiedAt: new Date().toISOString(),
      actorType: "tenant_user",
      tenantId: "tenant-1",
      role: "tenant_admin"
    });
    await repository.save(user);
    await repository.assignTenantRoles(user.id, "tenant-1", ["tenant_admin"]);

    const loggedIn = await useCase.loginTenant({
      tenantId: "tenant-1",
      identifier: "tenant@example.com",
      password: "Password1"
    });

    expect(loggedIn.session.actorType).toBe("tenant_user");
    expect(loggedIn.session.roles).toEqual(["tenant_admin"]);
    expect(loggedIn.permissions).toContain("tenant.dashboard.access");
    expect(loggedIn.permissions).not.toContain("platform.admin.manage");
  });

  it("logs in platform users from platform roles without tenant context", async () => {
    const user = AuthUser.create({
      name: "Platform Owner",
      email: "owner@example.com",
      phoneNumber: "0922222222",
      passwordHash: await passwordService.hash("Password1"),
      phoneVerifiedAt: new Date().toISOString(),
      actorType: "platform_user",
      role: "platform_owner"
    });
    await repository.save(user);
    await repository.assignPlatformRoles(user.id, ["platform_owner"]);

    const loggedIn = await useCase.loginPlatform({
      identifier: "owner@example.com",
      password: "Password1"
    });

    expect(loggedIn.session.actorType).toBe("platform_user");
    expect(loggedIn.session.tenantId).toBeNull();
    expect(loggedIn.permissions).toContain("platform.admin.manage");
  });

  async function verifyPhone(tenantId: string, phoneNumber: string) {
    await useCase.requestPhoneVerification({ tenantId, phoneNumber, purpose: "register" });
    await useCase.verifyPhone({ tenantId, phoneNumber, purpose: "register", code: "123456" });
  }
});

function defaultAddress() {
  return {
    fullName: "Customer",
    phoneNumber: "0900000000",
    addressLine: "123 Main Street",
    provinceCode: 79,
    provinceName: "Thành phố Hồ Chí Minh",
    provinceCodename: "ho_chi_minh",
    provinceDivisionType: "thành phố trung ương",
    wardCode: 26734,
    wardName: "Phường Sài Gòn",
    wardCodename: "phuong_sai_gon",
    wardDivisionType: "phường",
    countryCode: "VN" as const,
    administrativeVersion: "VN_2025_07" as const
  };
}
