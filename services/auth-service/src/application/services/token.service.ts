import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { AppError } from "@job-portal/errors";
import type { ActorType, Role } from "@job-portal/auth-contracts";

export interface TokenService {
  sign(payload: AccessTokenPayload): string;
  verify(token: string): AccessTokenPayload;
}

export type AccessTokenPayload = {
  sub: string;
  sid: string;
  actorType: Exclude<ActorType, "guest">;
  roles: Role[];
  tenantId?: string;
  phoneVerified: boolean;
};

export class JwtTokenService implements TokenService {
  sign(payload: AccessTokenPayload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, "JWT secret is not configured", "AUTH_JWT_SECRET_MISSING");
    }

    const options: SignOptions = { expiresIn: (process.env.ACCESS_TOKEN_TTL ?? "15m") as SignOptions["expiresIn"] };
    return jwt.sign(payload, secret, options);
  }

  verify(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, "JWT secret is not configured", "AUTH_JWT_SECRET_MISSING");
    }

    try {
      const payload = jwt.verify(token, secret) as AccessTokenPayload;
      return payload;
    } catch {
      throw new AppError(401, "Invalid token", "AUTH_INVALID_TOKEN");
    }
  }
}
