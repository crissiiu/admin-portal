import { Router, type Router as ExpressRouter } from "express";
import type { LoginUseCase } from "../application/use-cases/login.usecase.js";
import type { RegisterUseCase } from "../application/use-cases/register.usecase.js";
import { AuthController } from "./auth.controller.js";

export function createAuthRouter(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase): ExpressRouter {
  const router = Router();
  const controller = new AuthController(registerUseCase, loginUseCase);

  router.post("/register", controller.register);
  router.post("/login", controller.login);

  return router;
}
