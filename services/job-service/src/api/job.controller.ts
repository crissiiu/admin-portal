import type { Request, Response } from "express";
import { createJobRequestSchema } from "./job.request.schema.js";
import { toJobResponse } from "./job.response.dto.js";
import type { CreateJobUseCase } from "../application/use-cases/create-job.usecase.js";
import type { ListJobsUseCase } from "../application/use-cases/list-jobs.usecase.js";
import type { PublishJobUseCase } from "../application/use-cases/publish-job.usecase.js";

export class JobController {
  constructor(
    private readonly createJob: CreateJobUseCase,
    private readonly listJobs: ListJobsUseCase,
    private readonly publishJob: PublishJobUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createJobRequestSchema.parse(req.body);
    const job = await this.createJob.execute(input);
    res.status(201).json({ success: true, job: toJobResponse(job) });
  };

  list = async (_req: Request, res: Response) => {
    const jobs = await this.listJobs.execute();
    res.json({ success: true, jobs: jobs.map(toJobResponse) });
  };

  publish = async (req: Request, res: Response) => {
    const job = await this.publishJob.execute(String(req.params.id));
    res.json({ success: true, job: toJobResponse(job) });
  };
}
