import type { Request, Response } from "express";
import { loginRequestSchema, registerRequestSchema } from "./auth.request.schema.js";
import { toAuthUserResponse } from "./auth.response.dto.js";
import type { LoginUseCase } from "../application/use-cases/login.usecase.js";
import type { RegisterUseCase } from "../application/use-cases/register.usecase.js";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  register = async (req: Request, res: Response) => {
    const input = registerRequestSchema.parse(req.body);
    const user = await this.registerUseCase.execute(input);
    res.status(201).json({ success: true, user: toAuthUserResponse(user) });
  };

  login = async (req: Request, res: Response) => {
    const input = loginRequestSchema.parse(req.body);
    const result = await this.loginUseCase.execute(input);
    res.json({ success: true, user: toAuthUserResponse(result.user), token: result.token });
  };
}
