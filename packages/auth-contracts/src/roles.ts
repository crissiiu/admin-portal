export const PLATFORM_ROLES = [
  "platform_owner",
  "platform_admin",
  "platform_sales_admin",
  "platform_support",
  "platform_billing"
] as const;

export const TENANT_ADMIN_ROLES = [
  "tenant_owner",
  "tenant_admin",
  "tenant_manager",
  "tenant_theme_admin"
] as const;

export const STAFF_ROLES = [
  "sales_staff",
  "repair_staff",
  "inventory_staff",
  "hr_staff",
  "content_staff",
  "support_staff",
  "finance_staff"
] as const;

export const CUSTOMER_ROLES = [
  "guest",
  "customer_guest_checkout",
  "customer_registered",
  "customer_loyalty"
] as const;

export const ROLES = [
  ...PLATFORM_ROLES,
  ...TENANT_ADMIN_ROLES,
  ...STAFF_ROLES,
  ...CUSTOMER_ROLES
] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];
export type TenantAdminRole = (typeof TENANT_ADMIN_ROLES)[number];
export type StaffRole = (typeof STAFF_ROLES)[number];
export type CustomerRole = (typeof CUSTOMER_ROLES)[number];
export type Role = (typeof ROLES)[number];

const platformRoleSet = new Set<Role>(PLATFORM_ROLES);
const tenantAdminRoleSet = new Set<Role>(TENANT_ADMIN_ROLES);
const staffRoleSet = new Set<Role>(STAFF_ROLES);
const customerRoleSet = new Set<Role>(CUSTOMER_ROLES);

/** Kiểm tra role có thuộc nhóm vận hành nền tảng Sales Builder hay không. */
export function isPlatformRole(role: Role): role is PlatformRole {
  return platformRoleSet.has(role);
}

/** Kiểm tra role có phải nhóm admin trong một tenant/doanh nghiệp hay không. */
export function isTenantAdminRole(role: Role): role is TenantAdminRole {
  return tenantAdminRoleSet.has(role);
}

/** Kiểm tra role có phải một trong các nhóm nhân viên vận hành của tenant hay không. */
export function isStaffRole(role: Role): role is StaffRole {
  return staffRoleSet.has(role);
}

/** Kiểm tra role có thuộc nhóm truy cập storefront/khách hàng hay không. */
export function isCustomerRole(role: Role): role is CustomerRole {
  return customerRoleSet.has(role);
}
