import type { Request, Response } from "express";
import { AppError } from "@job-portal/errors";
import { ROLES, type Role } from "@job-portal/auth-contracts";
import {
  customerLoginEmailSchema,
  customerLoginGoogleSchema,
  customerLoginPhoneSchema,
  customerRegisterEmailSchema,
  customerRegisterGoogleSchema,
  customerRegisterPhoneSchema,
  forgotPasswordSchema,
  phoneVerificationRequestSchema,
  phoneVerificationVerifySchema,
  platformLoginSchema,
  platformUserCreateSchema,
  refreshSchema,
  resetPasswordSchema,
  tenantLoginSchema,
  tenantUserCreateSchema,
  updatePasswordSchema
} from "./auth.request.schema.js";
import { toAuthResultResponse, toAuthUserResponse } from "./auth.response.dto.js";
import type { TokenService } from "../application/services/token.service.js";
import type { AuthFlowUseCase } from "../application/use-cases/auth-flow.usecase.js";

const ACCESS_COOKIE = "sales_builder_access_token";
const REFRESH_COOKIE = "sales_builder_refresh_token";
const roleSet = new Set<Role>(ROLES);

export class AuthController {
  constructor(
    private readonly auth: AuthFlowUseCase,
    private readonly tokenService: TokenService
  ) {}

  requestPhoneVerification = async (req: Request, res: Response) => {
    const result = await this.auth.requestPhoneVerification(phoneVerificationRequestSchema.parse(req.body));
    res.status(202).json({ success: true, ...result });
  };

  verifyPhone = async (req: Request, res: Response) => {
    const result = await this.auth.verifyPhone(phoneVerificationVerifySchema.parse(req.body));
    res.json({ success: true, ...result });
  };

  registerCustomerWithEmail = async (req: Request, res: Response) => {
    const result = await this.auth.registerCustomerWithEmail(customerRegisterEmailSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json(toAuthResultResponse(result));
  };

  registerCustomerWithPhone = async (req: Request, res: Response) => {
    const result = await this.auth.registerCustomerWithPhone(customerRegisterPhoneSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json(toAuthResultResponse(result));
  };

  registerCustomerWithGoogle = async (req: Request, res: Response) => {
    const result = await this.auth.registerCustomerWithGoogle(customerRegisterGoogleSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json(toAuthResultResponse(result));
  };

  loginCustomerWithEmail = async (req: Request, res: Response) => {
    const result = await this.auth.loginCustomerWithEmail(customerLoginEmailSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  loginCustomerWithPhone = async (req: Request, res: Response) => {
    const result = await this.auth.loginCustomerWithPhone(customerLoginPhoneSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  loginCustomerWithGoogle = async (req: Request, res: Response) => {
    const result = await this.auth.loginCustomerWithGoogle(customerLoginGoogleSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  loginTenant = async (req: Request, res: Response) => {
    const result = await this.auth.loginTenant(tenantLoginSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  loginPlatform = async (req: Request, res: Response) => {
    const result = await this.auth.loginPlatform(platformLoginSchema.parse(req.body));
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  customerForgotPassword = async (req: Request, res: Response) => {
    const input = forgotPasswordSchema.parse(req.body);
    const result = await this.auth.forgotPassword({ ...input, actorType: "customer" });
    res.status(202).json({ success: true, ...result });
  };

  tenantForgotPassword = async (req: Request, res: Response) => {
    const input = forgotPasswordSchema.parse(req.body);
    const result = await this.auth.forgotPassword({ ...input, actorType: "tenant_user" });
    res.status(202).json({ success: true, ...result });
  };

  platformForgotPassword = async (req: Request, res: Response) => {
    const input = forgotPasswordSchema.parse(req.body);
    const result = await this.auth.forgotPassword({ ...input, actorType: "platform_user" });
    res.status(202).json({ success: true, ...result });
  };

  customerResetPassword = async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    const result = await this.auth.resetPassword({ ...input, actorType: "customer" });
    res.json({ success: true, ...result });
  };

  tenantResetPassword = async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    const result = await this.auth.resetPassword({ ...input, actorType: "tenant_user" });
    res.json({ success: true, ...result });
  };

  platformResetPassword = async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    const result = await this.auth.resetPassword({ ...input, actorType: "platform_user" });
    res.json({ success: true, ...result });
  };

  updatePassword = async (req: Request, res: Response) => {
    const input = updatePasswordSchema.parse(req.body);
    const result = await this.auth.updatePassword({ payload: this.requirePayload(req), ...input });
    res.json({ success: true, ...result });
  };

  refresh = async (req: Request, res: Response) => {
    const input = refreshSchema.parse(req.body);
    const refreshToken = input.refreshToken ?? this.getCookie(req, REFRESH_COOKIE);
    if (!refreshToken) {
      throw new AppError(401, "Missing refresh token", "AUTH_REFRESH_TOKEN_MISSING");
    }
    const result = await this.auth.refresh({ refreshToken });
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json(toAuthResultResponse(result));
  };

  logout = async (req: Request, res: Response) => {
    const result = await this.auth.logout({ payload: this.requirePayload(req) });
    this.clearAuthCookies(res);
    res.json({ success: true, ...result });
  };

  me = async (req: Request, res: Response) => {
    const result = await this.auth.me({ payload: this.requirePayload(req) });
    res.json({
      success: true,
      user: toAuthUserResponse(result.user),
      actorType: result.actorType,
      roles: result.roles,
      permissions: result.permissions,
      tenantId: result.tenantId,
      phoneVerified: result.phoneVerified
    });
  };

  createTenantUser = async (req: Request, res: Response) => {
    const input = tenantUserCreateSchema.parse(req.body);
    const result = await this.auth.createTenantUser({
      ...input,
      actor: this.requirePayload(req),
      roles: this.parseRoles(input.roles)
    });
    res.status(201).json({ success: true, user: toAuthUserResponse(result.user) });
  };

  createPlatformUser = async (req: Request, res: Response) => {
    const input = platformUserCreateSchema.parse(req.body);
    const result = await this.auth.createPlatformUser({
      ...input,
      actor: this.requirePayload(req),
      roles: this.parseRoles(input.roles)
    });
    res.status(201).json({ success: true, user: toAuthUserResponse(result.user) });
  };

  private requirePayload(req: Request) {
    const token = this.getBearerToken(req) ?? this.getCookie(req, ACCESS_COOKIE);
    if (!token) {
      throw new AppError(401, "Missing access token", "AUTH_TOKEN_MISSING");
    }
    return this.tokenService.verify(token);
  }

  private parseRoles(roles: string[]) {
    for (const role of roles) {
      if (!roleSet.has(role as Role)) {
        throw new AppError(400, "Invalid role", "AUTH_INVALID_ROLE");
      }
    }
    return roles as Exclude<Role, "guest" | "customer_guest_checkout">[];
  }

  private getBearerToken(req: Request) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length);
  }

  private getCookie(req: Request, name: string) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    for (const cookie of cookieHeader.split(";")) {
      const [key, ...value] = cookie.trim().split("=");
      if (key === name) return decodeURIComponent(value.join("="));
    }
    return null;
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const secure = process.env.NODE_ENV === "production";
    const refreshMaxAge = Number(process.env.REFRESH_TOKEN_DAYS ?? 30) * 24 * 60 * 60;
    res.cookie(ACCESS_COOKIE, accessToken, { httpOnly: true, secure, sameSite: "lax", maxAge: 15 * 60 * 1000, path: "/" });
    res.cookie(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure, sameSite: "lax", maxAge: refreshMaxAge * 1000, path: "/api/auth" });
  }

  private clearAuthCookies(res: Response) {
    const secure = process.env.NODE_ENV === "production";
    res.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure, sameSite: "lax", path: "/" });
    res.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure, sameSite: "lax", path: "/api/auth" });
  }
}
