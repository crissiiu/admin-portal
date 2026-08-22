import type { Request, Response } from "express";
import { updateUserProfileSchema } from "./user.request.schema.js";
import { toUserProfileResponse } from "./user.response.dto.js";
import type { GetUserProfileUseCase } from "../application/use-cases/get-user-profile.usecase.js";
import type { UpdateUserProfileUseCase } from "../application/use-cases/update-user-profile.usecase.js";

export class UserController {
  constructor(
    private readonly getProfile: GetUserProfileUseCase,
    private readonly updateProfile: UpdateUserProfileUseCase
  ) {}

  getById = async (req: Request, res: Response) => {
    const profile = await this.getProfile.execute(String(req.params.id));
    res.json({ success: true, user: toUserProfileResponse(profile) });
  };

  update = async (req: Request, res: Response) => {
    const input = updateUserProfileSchema.parse(req.body);
    const profile = await this.updateProfile.execute(String(req.params.id), input);
    res.json({ success: true, user: toUserProfileResponse(profile) });
  };
}
