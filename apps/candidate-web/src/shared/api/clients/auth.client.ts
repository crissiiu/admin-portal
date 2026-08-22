import "server-only";

import { httpClient } from "@/shared/api/http-client";

export interface SignInDto {
  email: string;
  password: string;
}

export function signIn(dto: SignInDto) {
  return httpClient<{ accessToken: string }>("/auth/sign-in", {
    body: JSON.stringify(dto),
    method: "POST"
  });
}

