import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createHttpLogger } from "@job-portal/logger";
import { errorMiddleware } from "./api/middleware.js";
import { createAuthRouter } from "./api/auth.routes.js";
import { InMemoryAuthUserRepository } from "./infrastructure/repositories/in-memory-auth-user.repository.js";
import { BcryptPasswordService } from "./application/services/password.service.js";
import { JwtTokenService } from "./application/services/token.service.js";
import { RegisterUseCase } from "./application/use-cases/register.usecase.js";
import { LoginUseCase } from "./application/use-cases/login.usecase.js";

export function createApp(): Express {
  const app = express();
  const repository = new InMemoryAuthUserRepository();
  const passwordService = new BcryptPasswordService();
  const tokenService = new JwtTokenService();
  const registerUseCase = new RegisterUseCase(repository, passwordService);
  const loginUseCase = new LoginUseCase(repository, passwordService, tokenService);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(createHttpLogger("auth-service"));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }));
  app.use("/api/auth", createAuthRouter(registerUseCase, loginUseCase));
  app.use(errorMiddleware);

  return app;
}
