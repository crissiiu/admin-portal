export type Permission = "job.apply" | "profile.update" | "application.read";

export function hasPermission(permissions: Permission[], permission: Permission) {
  return permissions.includes(permission);
}

