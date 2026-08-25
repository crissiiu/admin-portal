import { AppError } from "@job-portal/errors";

export type GoogleProfile = {
  subject: string;
  email: string | null;
  name: string | null;
};

export interface GoogleIdentityService {
  verifyIdToken(idToken: string): Promise<GoogleProfile>;
}

export class LocalGoogleIdentityService implements GoogleIdentityService {
  async verifyIdToken(idToken: string): Promise<GoogleProfile> {
    if (process.env.NODE_ENV === "production" && !process.env.GOOGLE_CLIENT_ID) {
      throw new AppError(500, "Google client is not configured", "AUTH_GOOGLE_NOT_CONFIGURED");
    }

    if (!idToken.startsWith("google:")) {
      throw new AppError(401, "Invalid Google token", "AUTH_INVALID_GOOGLE_TOKEN");
    }

    const [, subject, email = "", name = ""] = idToken.split(":");
    if (!subject) {
      throw new AppError(401, "Invalid Google token", "AUTH_INVALID_GOOGLE_TOKEN");
    }

    return {
      subject,
      email: email.length > 0 ? email.toLowerCase() : null,
      name: name.length > 0 ? name : null
    };
  }
}
