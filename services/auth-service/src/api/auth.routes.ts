import { Router, type Router as ExpressRouter } from "express";
import type { TokenService } from "../application/services/token.service.js";
import type { AuthFlowUseCase } from "../application/use-cases/auth-flow.usecase.js";
import { AuthController } from "./auth.controller.js";

export function createAuthRouter(authUseCase: AuthFlowUseCase, tokenService: TokenService): ExpressRouter {
  const router = Router();
  const controller = new AuthController(authUseCase, tokenService);

  router.post("/customer/phone-verifications/request", controller.requestPhoneVerification);
  router.post("/customer/phone-verifications/verify", controller.verifyPhone);
  router.post("/customer/register/email", controller.registerCustomerWithEmail);
  router.post("/customer/register/phone", controller.registerCustomerWithPhone);
  router.post("/customer/register/google", controller.registerCustomerWithGoogle);
  router.post("/customer/login/email", controller.loginCustomerWithEmail);
  router.post("/customer/login/phone", controller.loginCustomerWithPhone);
  router.post("/customer/login/google", controller.loginCustomerWithGoogle);
  router.post("/customer/password/forgot", controller.customerForgotPassword);
  router.post("/customer/password/reset", controller.customerResetPassword);
  router.post("/customer/password/update", controller.updatePassword);

  router.post("/tenant/login", controller.loginTenant);
  router.post("/tenant/password/forgot", controller.tenantForgotPassword);
  router.post("/tenant/password/reset", controller.tenantResetPassword);
  router.post("/tenant/password/update", controller.updatePassword);
  router.post("/tenant/users", controller.createTenantUser);

  router.post("/platform/login", controller.loginPlatform);
  router.post("/platform/password/forgot", controller.platformForgotPassword);
  router.post("/platform/password/reset", controller.platformResetPassword);
  router.post("/platform/password/update", controller.updatePassword);
  router.post("/platform/users", controller.createPlatformUser);

  router.post("/refresh", controller.refresh);
  router.post("/logout", controller.logout);
  router.get("/me", controller.me);

  return router;
}
