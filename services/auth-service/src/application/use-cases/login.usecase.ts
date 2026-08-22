import { AppError } from "@job-portal/errors";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository.js";
import type { PasswordService } from "../services/password.service.js";
import type { TokenService } from "../services/token.service.js";

export type LoginInput = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginInput) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
    }

    const validPassword = await this.passwordService.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
    }

    return { user, token: this.tokenService.sign({ sub: user.id, role: user.role }) };
  }
}
