import "server-only";

import type { ProblemDetails } from "@job-portal/api-contracts";

import { env } from "@/config/env";
import { ApiError } from "@/shared/errors/api-error";

interface RequestOptions extends RequestInit {
  requestId?: string;
}

export async function httpClient<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const response = await fetch(new URL(path, env.API_BASE_URL), {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.requestId ? { "x-request-id": options.requestId } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const problem = (await response.json().catch(() => undefined)) as ProblemDetails | undefined;
    throw new ApiError(problem?.title ?? "API request failed", response.status, problem);
  }

  return (await response.json()) as TResponse;
}

