import jwt from "jsonwebtoken";
import { AppError } from "@job-portal/errors";

export interface TokenService {
  sign(payload: Record<string, unknown>): string;
}

export class JwtTokenService implements TokenService {
  sign(payload: Record<string, unknown>) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, "JWT secret is not configured", "AUTH_JWT_SECRET_MISSING");
    }

    return jwt.sign(payload, secret, { expiresIn: "7d" });
  }
}
