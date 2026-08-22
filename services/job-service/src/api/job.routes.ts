import { Router, type Router as ExpressRouter } from "express";
import type { CreateJobUseCase } from "../application/use-cases/create-job.usecase.js";
import type { ListJobsUseCase } from "../application/use-cases/list-jobs.usecase.js";
import type { PublishJobUseCase } from "../application/use-cases/publish-job.usecase.js";
import { JobController } from "./job.controller.js";

export function createJobRouter(
  createJob: CreateJobUseCase,
  listJobs: ListJobsUseCase,
  publishJob: PublishJobUseCase
): ExpressRouter {
  const router = Router();
  const controller = new JobController(createJob, listJobs, publishJob);

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.post("/:id/publish", controller.publish);

  return router;
}
