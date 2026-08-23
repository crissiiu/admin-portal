import { AppError } from "@job-portal/errors";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository.js";
import type { PasswordService } from "../services/password.service.js";
import { AuthUser } from "../../domain/entities/auth-user.entity.js";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export class RegisterUseCase {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly passwordService: PasswordService
  ) {}

  /** Đăng ký tài khoản storefront public và không nhận role đặc quyền từ request. */
  async execute(input: RegisterInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "Email already exists", "AUTH_EMAIL_EXISTS");
    }

    const passwordHash = await this.passwordService.hash(input.password);
    const user = AuthUser.create({ ...input, role: "customer_registered", passwordHash });
    await this.users.save(user);

    return user;
  }
}
