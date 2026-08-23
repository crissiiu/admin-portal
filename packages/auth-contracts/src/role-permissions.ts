import { COMMERCE_PERMISSIONS, PERMISSIONS, PLATFORM_PERMISSIONS, TENANT_PERMISSIONS } from "./permissions.js";
import type { Permission } from "./permissions.js";
import type { Role } from "./roles.js";

type PermissionPattern = Permission | "*" | "platform.*" | "tenant.*" | "commerce.*";

const TENANT_OWNER_PERMISSIONS = [
  ...TENANT_PERMISSIONS,
  ...COMMERCE_PERMISSIONS
] satisfies readonly Permission[];

export const ROLE_PERMISSION_RULES = {
  platform_owner: ["*"],
  platform_admin: [
    "platform.tenant.read",
    "platform.tenant.create",
    "platform.tenant.update",
    "platform.tenant.suspend",
    "platform.tenant.impersonate_support",
    "platform.service_catalog.read",
    "platform.subscription.read",
    "platform.audit_log.read"
  ],
  platform_sales_admin: [
    "platform.tenant.read",
    "platform.tenant.create",
    "platform.subscription.read",
    "platform.subscription.manage",
    "platform.service_catalog.read",
    "platform.billing.read"
  ],
  platform_support: [
    "platform.tenant.read",
    "platform.tenant.impersonate_support",
    "platform.audit_log.read"
  ],
  platform_billing: [
    "platform.billing.read",
    "platform.billing.manage",
    "platform.subscription.read",
    "platform.subscription.manage",
    "platform.tenant.read"
  ],
  tenant_owner: TENANT_OWNER_PERMISSIONS,
  tenant_admin: TENANT_OWNER_PERMISSIONS.filter(
    (permission) =>
      ![
        "tenant.admin.manage",
        "tenant.service.request",
        "tenant.audit_log.read"
      ].includes(permission)
  ),
  tenant_manager: [
    "tenant.dashboard.access",
    "product.read",
    "product.create",
    "product.update",
    "product.publish",
    "category.read",
    "category.manage",
    "collection.read",
    "collection.manage",
    "order.read",
    "order.update_status",
    "customer.read",
    "inventory.read",
    "inventory.update",
    "discount.read"
  ],
  tenant_theme_admin: [
    "tenant.dashboard.access",
    "tenant.theme.read",
    "tenant.theme.manage",
    "tenant.domain.read",
    "content.read",
    "content.manage"
  ],
  sales_staff: [
    "tenant.dashboard.access",
    "product.read",
    "order.read",
    "order.create_manual",
    "order.update_status",
    "customer.read",
    "discount.read"
  ],
  repair_staff: [
    "tenant.dashboard.access",
    "customer.read",
    "repair.read",
    "repair.create",
    "repair.update_status"
  ],
  inventory_staff: [
    "tenant.dashboard.access",
    "product.read",
    "inventory.read",
    "inventory.update",
    "inventory.adjust"
  ],
  hr_staff: [
    "tenant.dashboard.access",
    "hr.employee.read",
    "hr.employee.manage",
    "tenant.staff.read"
  ],
  content_staff: [
    "tenant.dashboard.access",
    "content.read",
    "content.manage",
    "product.read",
    "category.read",
    "collection.read"
  ],
  support_staff: [
    "tenant.dashboard.access",
    "customer.read",
    "order.read",
    "support.ticket.read",
    "support.ticket.manage"
  ],
  finance_staff: [
    "tenant.dashboard.access",
    "order.read",
    "finance.payment.read",
    "finance.payment.refund"
  ],
  guest: [
    "content.read",
    "product.read",
    "category.read",
    "collection.read",
    "cart.read_own",
    "cart.update_own"
  ],
  customer_guest_checkout: [
    "content.read",
    "product.read",
    "category.read",
    "collection.read",
    "cart.read_own",
    "cart.update_own",
    "checkout.create",
    "order.create"
  ],
  customer_registered: [
    "content.read",
    "product.read",
    "category.read",
    "collection.read",
    "cart.read_own",
    "cart.update_own",
    "checkout.create",
    "order.create",
    "customer.read_own",
    "customer.update_own",
    "order.read_own",
    "order.cancel_own"
  ],
  customer_loyalty: [
    "content.read",
    "product.read",
    "category.read",
    "collection.read",
    "cart.read_own",
    "cart.update_own",
    "checkout.create",
    "order.create",
    "customer.read_own",
    "customer.update_own",
    "order.read_own",
    "order.cancel_own",
    "customer.loyalty_read"
  ]
} as const satisfies Record<Role, readonly PermissionPattern[]>;

/** Mở rộng rule permission dạng wildcard thành danh sách permission cụ thể để runtime kiểm tra. */
export function expandPermissionPattern(pattern: PermissionPattern): readonly Permission[] {
  if (pattern === "*") {
    return PERMISSIONS;
  }

  if (pattern === "platform.*") {
    return PLATFORM_PERMISSIONS;
  }

  if (pattern === "tenant.*") {
    return TENANT_PERMISSIONS;
  }

  if (pattern === "commerce.*") {
    return COMMERCE_PERMISSIONS;
  }

  return [pattern];
}

/** Trả về danh sách permission cụ thể, đã loại trùng, được cấp bởi một tập role. */
export function getPermissionsForRoles(roles: readonly Role[]): Permission[] {
  const permissions = new Set<Permission>();

  for (const role of roles) {
    for (const pattern of ROLE_PERMISSION_RULES[role]) {
      for (const permission of expandPermissionPattern(pattern)) {
        permissions.add(permission);
      }
    }
  }

  return [...permissions];
}
