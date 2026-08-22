import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createHttpLogger } from "@job-portal/logger";
import { NoopMessagePublisher } from "@job-portal/message-bus";
import { errorMiddleware } from "./api/middleware.js";
import { createJobRouter } from "./api/job.routes.js";
import { CreateJobUseCase } from "./application/use-cases/create-job.usecase.js";
import { ListJobsUseCase } from "./application/use-cases/list-jobs.usecase.js";
import { PublishJobUseCase } from "./application/use-cases/publish-job.usecase.js";
import { InMemoryJobRepository } from "./infrastructure/repositories/in-memory-job.repository.js";

export function createApp(): Express {
  const app = express();
  const repository = new InMemoryJobRepository();
  const publisher = new NoopMessagePublisher();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(createHttpLogger("job-service"));
  app.get("/health", (_req, res) => res.json({ status: "ok", service: "job-service" }));
  app.use("/api/jobs", createJobRouter(
    new CreateJobUseCase(repository, publisher),
    new ListJobsUseCase(repository),
    new PublishJobUseCase(repository, publisher)
  ));
  app.use(errorMiddleware);

  return app;
}
