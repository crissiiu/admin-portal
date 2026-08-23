import type { Role } from "@job-portal/auth-contracts";

export type AuthRole = Exclude<Role, "guest" | "customer_guest_checkout">;

export class AuthUser {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly role: AuthRole,
    public readonly passwordHash: string,
    public readonly createdAt: string
  ) {}

  /** Tạo định danh auth và mặc định đăng ký public là tài khoản khách hàng. */
  static create(input: {
    name: string;
    email: string;
    phoneNumber: string;
    role?: AuthRole;
    passwordHash: string;
  }) {
    return new AuthUser(
      crypto.randomUUID(),
      input.name,
      input.email.toLowerCase(),
      input.phoneNumber,
      input.role ?? "customer_registered",
      input.passwordHash,
      new Date().toISOString()
    );
  }
}
