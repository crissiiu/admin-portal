import type { ActorType, Role } from "@job-portal/auth-contracts";

export type AuthRole = Exclude<Role, "guest" | "customer_guest_checkout">;
export type AuthProvider = "password" | "google";

export class AuthUser {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phoneNumber: string,
    public readonly role: AuthRole,
    public readonly passwordHash: string | null,
    public readonly createdAt: string,
    public readonly status: "active" | "blocked" | "deleted",
    public readonly phoneVerifiedAt: string | null,
    public readonly googleSubject: string | null,
    public readonly tenantId: string | null,
    public readonly actorType: Exclude<ActorType, "guest">
  ) {}

  /** Tạo định danh auth và mặc định đăng ký public là tài khoản khách hàng. */
  static create(input: {
    name: string;
    email?: string | null;
    phoneNumber: string;
    role?: AuthRole;
    passwordHash?: string | null;
    phoneVerifiedAt?: string | null;
    googleSubject?: string | null;
    tenantId?: string | null;
    actorType?: Exclude<ActorType, "guest">;
  }) {
    return new AuthUser(
      crypto.randomUUID(),
      input.name,
      input.email?.toLowerCase() ?? null,
      input.phoneNumber,
      input.role ?? "customer_registered",
      input.passwordHash ?? null,
      new Date().toISOString(),
      "active",
      input.phoneVerifiedAt ?? null,
      input.googleSubject ?? null,
      input.tenantId ?? null,
      input.actorType ?? "customer"
    );
  }

  withPasswordHash(passwordHash: string) {
    return new AuthUser(
      this.id,
      this.name,
      this.email,
      this.phoneNumber,
      this.role,
      passwordHash,
      this.createdAt,
      this.status,
      this.phoneVerifiedAt,
      this.googleSubject,
      this.tenantId,
      this.actorType
    );
  }
}
