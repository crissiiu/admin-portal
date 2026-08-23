export const PLATFORM_PERMISSIONS = [
  "platform.tenant.read",
  "platform.tenant.create",
  "platform.tenant.update",
  "platform.tenant.suspend",
  "platform.tenant.impersonate_support",
  "platform.service_catalog.read",
  "platform.service_catalog.manage",
  "platform.subscription.read",
  "platform.subscription.manage",
  "platform.billing.read",
  "platform.billing.manage",
  "platform.audit_log.read",
  "platform.admin.manage"
] as const;

export const TENANT_PERMISSIONS = [
  "tenant.dashboard.access",
  "tenant.settings.read",
  "tenant.settings.manage",
  "tenant.admin.manage",
  "tenant.staff.read",
  "tenant.staff.manage",
  "tenant.audit_log.read",
  "tenant.domain.read",
  "tenant.domain.manage",
  "tenant.theme.read",
  "tenant.theme.manage",
  "tenant.service.read",
  "tenant.service.request"
] as const;

export const COMMERCE_PERMISSIONS = [
  "product.read",
  "product.create",
  "product.update",
  "product.publish",
  "product.delete",
  "category.read",
  "category.manage",
  "collection.read",
  "collection.manage",
  "cart.read_own",
  "cart.update_own",
  "checkout.create",
  "order.create",
  "order.read_own",
  "order.cancel_own",
  "order.read",
  "order.create_manual",
  "order.update_status",
  "order.refund",
  "customer.read_own",
  "customer.update_own",
  "customer.read",
  "customer.manage",
  "customer.loyalty_read",
  "customer.loyalty_manage",
  "inventory.read",
  "inventory.update",
  "inventory.adjust",
  "repair.read",
  "repair.create",
  "repair.update_status",
  "repair.assign",
  "repair.invoice",
  "hr.employee.read",
  "hr.employee.manage",
  "hr.role.assign",
  "discount.read",
  "discount.manage",
  "content.read",
  "content.manage",
  "support.ticket.read",
  "support.ticket.manage",
  "finance.payment.read",
  "finance.payment.refund"
] as const;

export const PERMISSIONS = [
  ...PLATFORM_PERMISSIONS,
  ...TENANT_PERMISSIONS,
  ...COMMERCE_PERMISSIONS
] as const;

export type PlatformPermission = (typeof PLATFORM_PERMISSIONS)[number];
export type TenantPermission = (typeof TENANT_PERMISSIONS)[number];
export type CommercePermission = (typeof COMMERCE_PERMISSIONS)[number];
export type Permission = (typeof PERMISSIONS)[number];

export const ALL_PERMISSIONS = new Set<Permission>(PERMISSIONS);
