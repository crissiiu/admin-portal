import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createHttpLogger } from "@job-portal/logger";
import { createGatewayRouter } from "./api/routes.js";
import { authorizationMiddleware, errorMiddleware, requestIdMiddleware } from "./api/middleware.js";
import { ServiceProxy } from "./infrastructure/external-clients/service-proxy.js";

export function createApp(): Express {
  const app = express();
  const proxy = new ServiceProxy({
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
    users: process.env.USER_SERVICE_URL ?? "http://localhost:3002",
    jobs: process.env.JOB_SERVICE_URL ?? "http://localhost:3003"
  });

  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors({ origin: parseCorsOrigin(), credentials: true }));
  app.use(express.json());
  app.use(createHttpLogger("api-gateway"));
  app.use(authorizationMiddleware);

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));
  app.use("/api", createGatewayRouter(proxy));
  app.use(errorMiddleware);

  return app;
}

function parseCorsOrigin() {
  const origin = process.env.CORS_ORIGIN;
  return origin ? origin.split(",").map((value) => value.trim()).filter(Boolean) : true;
}
