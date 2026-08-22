export type FeatureFlag = "candidateProfile" | "savedJobs" | "applicationSubmit";

const defaults: Record<FeatureFlag, boolean> = {
  candidateProfile: true,
  savedJobs: false,
  applicationSubmit: true
};

export function isFeatureEnabled(flag: FeatureFlag) {
  return defaults[flag];
}

