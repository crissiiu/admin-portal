import "server-only";

import { httpClient } from "@/shared/api/http-client";

export function getCurrentUser() {
  return httpClient<{ id: string; email: string; name: string }>("/users/me");
}

