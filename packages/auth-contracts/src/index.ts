export type { AccessContext, AccessDecision, ActorType } from "./actor-context.js";
export {
  AccessDeniedError,
  assertCan,
  assertServiceEnabled,
  assertTenantBoundary,
  can,
  canAll,
  canAny,
  decidePermission,
  hasAllServices,
  hasService,
  hasTenantContext,
  isOwnResource,
  isPlatformContext
} from "./access-control.js";
export {
  ALL_PERMISSIONS,
  COMMERCE_PERMISSIONS,
  PERMISSIONS,
  PLATFORM_PERMISSIONS,
  TENANT_PERMISSIONS
} from "./permissions.js";
export type { CommercePermission, Permission, PlatformPermission, TenantPermission } from "./permissions.js";
export {
  expandPermissionPattern,
  getPermissionsForRoles,
  ROLE_PERMISSION_RULES
} from "./role-permissions.js";
export {
  CUSTOMER_ROLES,
  isCustomerRole,
  isPlatformRole,
  isStaffRole,
  isTenantAdminRole,
  PLATFORM_ROLES,
  ROLES,
  STAFF_ROLES,
  TENANT_ADMIN_ROLES
} from "./roles.js";
export type { CustomerRole, PlatformRole, Role, StaffRole, TenantAdminRole } from "./roles.js";
export { ALL_SERVICE_ENTITLEMENTS, SERVICE_ENTITLEMENTS } from "./service-entitlements.js";
export type { ServiceEntitlement } from "./service-entitlements.js";
export { findRoutePolicy, ROUTE_POLICIES } from "./route-policies.js";
export type { RouteAccess, RoutePolicy, RouteSurface } from "./route-policies.js";
