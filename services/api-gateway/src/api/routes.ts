import { Router, type Router as ExpressRouter } from "express";
import type { ServiceProxy } from "../infrastructure/external-clients/service-proxy.js";
import { GatewayController } from "./controller.js";

export function createGatewayRouter(proxy: ServiceProxy): ExpressRouter {
  const router = Router();
  const controller = new GatewayController(proxy);

  router.use("/auth", controller.forward("auth"));
  router.use("/users", controller.forward("users"));
  router.use("/jobs", controller.forward("jobs"));

  return router;
}
