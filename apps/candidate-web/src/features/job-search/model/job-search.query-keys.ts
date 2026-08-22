import type { JobSearchInput } from "./job-search.schema";

export const jobSearchQueryKeys = {
  all: ["jobs"] as const,
  search: (input: JobSearchInput) => [...jobSearchQueryKeys.all, "search", input] as const
};

