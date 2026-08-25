import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createHttpLogger } from "@job-portal/logger";
import { errorMiddleware } from "./api/middleware.js";
import { createAuthRouter } from "./api/auth.routes.js";
import { InMemoryAuthUserRepository } from "./infrastructure/repositories/in-memory-auth-user.repository.js";
import { BcryptPasswordService } from "./application/services/password.service.js";
import { JwtTokenService } from "./application/services/token.service.js";
import { AuthFlowUseCase } from "./application/use-cases/auth-flow.usecase.js";
import { LocalGoogleIdentityService } from "./application/services/google-identity.service.js";
import { LocalNotificationService } from "./application/services/notification.service.js";
import { NoopCustomerProfileClient } from "./application/ports/customer-profile-client.port.js";
import { NoopRateLimiter } from "./application/services/rate-limit.service.js";
import { VietnamAddressValidationService } from "./application/services/address.service.js";
import { AuthUser } from "./domain/entities/auth-user.entity.js";

export async function createApp(): Promise<Express> {
  const app = express();
  const repository = new InMemoryAuthUserRepository();
  const passwordService = new BcryptPasswordService();
  const tokenService = new JwtTokenService();
  const notificationService = new LocalNotificationService();
  const authUseCase = new AuthFlowUseCase(
    repository,
    passwordService,
    tokenService,
    new LocalGoogleIdentityService(),
    notificationService,
    notificationService,
    new NoopCustomerProfileClient(),
    new NoopRateLimiter(),
    new VietnamAddressValidationService()
  );

  await seedLocalPlatformOwner(repository, passwordService);

  app.use(helmet());
  app.use(cors({ origin: parseCorsOrigin(), credentials: true }));
  app.use(express.json());
  app.use(createHttpLogger("auth-service"));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }));
  app.use("/api/auth", createAuthRouter(authUseCase, tokenService));
  app.use(errorMiddleware);

  return app;
}

function parseCorsOrigin() {
  const origin = process.env.CORS_ORIGIN;
  return origin ? origin.split(",").map((value) => value.trim()).filter(Boolean) : true;
}

async function seedLocalPlatformOwner(repository: InMemoryAuthUserRepository, passwordService: BcryptPasswordService) {
  const email = process.env.SEED_PLATFORM_OWNER_EMAIL;
  const password = process.env.SEED_PLATFORM_OWNER_PASSWORD;
  if (!email || !password) return;

  const existing = await repository.findPlatformByIdentifier(email);
  if (existing) return;

  const owner = AuthUser.create({
    name: "Platform Owner",
    email,
    phoneNumber: process.env.SEED_PLATFORM_OWNER_PHONE ?? "0000000000",
    passwordHash: await passwordService.hash(password),
    role: "platform_owner",
    actorType: "platform_user",
    phoneVerifiedAt: new Date().toISOString()
  });
  await repository.save(owner);
  await repository.assignPlatformRoles(owner.id, ["platform_owner"]);
}
