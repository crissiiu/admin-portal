import type { AccessContext, AccessDecision } from "./actor-context.js";
import { ALL_PERMISSIONS, type Permission } from "./permissions.js";
import { getPermissionsForRoles } from "./role-permissions.js";
import { isPlatformRole } from "./roles.js";
import { ALL_SERVICE_ENTITLEMENTS, type ServiceEntitlement } from "./service-entitlements.js";

export class AccessDeniedError extends Error {
  /** Lưu mã lỗi ổn định để tầng API map lỗi phân quyền nhất quán. */
  constructor(message: string, public readonly code = "ACCESS_DENIED") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

/** Kiểm tra context hiện tại đã được gắn với một tenant/doanh nghiệp hay chưa. */
export function hasTenantContext(context: AccessContext): boolean {
  return typeof context.tenantId === "string" && context.tenantId.length > 0;
}

/** Kiểm tra actor hiện tại có đang thao tác bằng quyền cấp nền tảng hay không. */
export function isPlatformContext(context: AccessContext): boolean {
  return context.actorType === "platform_user" && context.roles.some(isPlatformRole);
}

/** Kiểm tra một permission cụ thể có được cấp bởi bất kỳ role nào trong context không. */
export function can(context: AccessContext, permission: Permission): boolean {
  if (!ALL_PERMISSIONS.has(permission)) {
    return false;
  }

  return getPermissionsForRoles(context.roles).includes(permission);
}

/** Kiểm tra context có ít nhất một permission trong danh sách yêu cầu hay không. */
export function canAny(context: AccessContext, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => can(context, permission));
}

/** Kiểm tra context có đầy đủ tất cả permission trong danh sách yêu cầu hay không. */
export function canAll(context: AccessContext, permissions: readonly Permission[]): boolean {
  return permissions.every((permission) => can(context, permission));
}

/** Kiểm tra tenant hiện tại đã mua hoặc bật một module dịch vụ cụ thể hay chưa. */
export function hasService(context: AccessContext, service: ServiceEntitlement): boolean {
  if (!ALL_SERVICE_ENTITLEMENTS.has(service)) {
    return false;
  }

  return context.tenantServices?.includes(service) ?? false;
}

/** Kiểm tra tenant có đầy đủ tất cả module dịch vụ được yêu cầu hay không. */
export function hasAllServices(
  context: AccessContext,
  services: readonly ServiceEntitlement[]
): boolean {
  return services.every((service) => hasService(context, service));
}

/** Ném lỗi khi actor không có permission bắt buộc. */
export function assertCan(context: AccessContext, permission: Permission): void {
  if (!can(context, permission)) {
    throw new AccessDeniedError(`Missing permission: ${permission}`, "MISSING_PERMISSION");
  }
}

/** Ném lỗi khi tenant chưa bật module dịch vụ bắt buộc. */
export function assertServiceEnabled(context: AccessContext, service: ServiceEntitlement): void {
  if (!hasService(context, service)) {
    throw new AccessDeniedError(`Service is not enabled: ${service}`, "SERVICE_NOT_ENABLED");
  }
}

/** Chặn actor cấp tenant đọc hoặc sửa tài nguyên thuộc tenant khác. */
export function assertTenantBoundary(context: AccessContext): void {
  if (isPlatformContext(context)) {
    return;
  }

  if (!hasTenantContext(context)) {
    throw new AccessDeniedError("Missing tenant context", "MISSING_TENANT_CONTEXT");
  }

  if (context.resourceTenantId !== undefined && context.resourceTenantId !== context.tenantId) {
    throw new AccessDeniedError("Resource belongs to another tenant", "TENANT_BOUNDARY_VIOLATION");
  }
}

/** Trả về quyết định phân quyền không ném lỗi, dùng cho UI guard hoặc soft-check. */
export function decidePermission(
  context: AccessContext,
  permission: Permission,
  services: readonly ServiceEntitlement[] = []
): AccessDecision {
  if (!can(context, permission)) {
    return { allowed: false, reason: `Missing permission: ${permission}` };
  }

  for (const service of services) {
    if (!hasService(context, service)) {
      return { allowed: false, reason: `Service is not enabled: ${service}` };
    }
  }

  return { allowed: true };
}

/** Kiểm tra tài nguyên có thuộc actor hiện tại hay không, dùng cho permission hậu tố `_own`. */
export function isOwnResource(context: AccessContext): boolean {
  return (
    context.actorId !== undefined &&
    context.resourceOwnerId !== undefined &&
    context.actorId === context.resourceOwnerId
  );
}
