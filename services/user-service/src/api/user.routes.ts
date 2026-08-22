import { Router, type Router as ExpressRouter } from "express";
import type { GetUserProfileUseCase } from "../application/use-cases/get-user-profile.usecase.js";
import type { UpdateUserProfileUseCase } from "../application/use-cases/update-user-profile.usecase.js";
import { UserController } from "./user.controller.js";

export function createUserRouter(getProfile: GetUserProfileUseCase, updateProfile: UpdateUserProfileUseCase): ExpressRouter {
  const router = Router();
  const controller = new UserController(getProfile, updateProfile);

  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);

  return router;
}
