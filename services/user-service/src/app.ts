import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createHttpLogger } from "@job-portal/logger";
import { errorMiddleware } from "./api/middleware.js";
import { createUserRouter } from "./api/user.routes.js";
import { InMemoryUserProfileRepository } from "./infrastructure/repositories/in-memory-user-profile.repository.js";
import { GetUserProfileUseCase } from "./application/use-cases/get-user-profile.usecase.js";
import { UpdateUserProfileUseCase } from "./application/use-cases/update-user-profile.usecase.js";

export function createApp(): Express {
  const app = express();
  const repository = new InMemoryUserProfileRepository();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(createHttpLogger("user-service"));
  app.get("/health", (_req, res) => res.json({ status: "ok", service: "user-service" }));
  app.use("/api/users", createUserRouter(new GetUserProfileUseCase(repository), new UpdateUserProfileUseCase(repository)));
  app.use(errorMiddleware);

  return app;
}
