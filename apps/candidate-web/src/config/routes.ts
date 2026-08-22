export const routes = {
  jobs: () => "/jobs",
  jobDetail: (jobId: string) => `/jobs/${jobId}`,
  signIn: () => "/sign-in",
  signUp: () => "/sign-up",
  profile: () => "/profile",
  applications: () => "/applications"
} as const;

