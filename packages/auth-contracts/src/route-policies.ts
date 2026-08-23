import type { Permission } from "./permissions.js";
import type { Role } from "./roles.js";
import type { ServiceEntitlement } from "./service-entitlements.js";

export type RouteAccess = "public" | "session" | "auth";
export type RouteSurface = "storefront" | "tenant_admin" | "platform";

export type RoutePolicy = {
  route: string;
  surface: RouteSurface;
  access: RouteAccess;
  roles?: readonly Role[];
  permissions?: readonly Permission[];
  services?: readonly ServiceEntitlement[];
};

const CUSTOMER_AUTH_ROLES = ["customer_registered", "customer_loyalty"] as const;
const TENANT_OPERATOR_ROLES = [
  "tenant_owner",
  "tenant_admin",
  "tenant_manager",
  "tenant_theme_admin",
  "sales_staff",
  "repair_staff",
  "inventory_staff",
  "hr_staff",
  "content_staff",
  "support_staff",
  "finance_staff"
] as const;
const PLATFORM_OPERATOR_ROLES = [
  "platform_owner",
  "platform_admin",
  "platform_sales_admin",
  "platform_support",
  "platform_billing"
] as const;

export const ROUTE_POLICIES = [
  {
    route: "/",
    surface: "storefront",
    access: "public",
    permissions: ["content.read", "product.read"],
    services: ["service.storefront", "service.product_catalog"]
  },
  {
    route: "/products",
    surface: "storefront",
    access: "public",
    permissions: ["product.read"],
    services: ["service.product_catalog"]
  },
  {
    route: "/products/[slug]",
    surface: "storefront",
    access: "public",
    permissions: ["product.read"],
    services: ["service.product_catalog"]
  },
  {
    route: "/cart",
    surface: "storefront",
    access: "session",
    roles: ["guest", "customer_guest_checkout", ...CUSTOMER_AUTH_ROLES],
    permissions: ["cart.read_own", "cart.update_own"],
    services: ["service.cart_checkout"]
  },
  {
    route: "/checkout",
    surface: "storefront",
    access: "session",
    roles: ["customer_guest_checkout", ...CUSTOMER_AUTH_ROLES],
    permissions: ["checkout.create", "order.create"],
    services: ["service.cart_checkout"]
  },
  {
    route: "/account",
    surface: "storefront",
    access: "auth",
    roles: CUSTOMER_AUTH_ROLES,
    permissions: ["customer.read_own"]
  },
  {
    route: "/account/orders",
    surface: "storefront",
    access: "auth",
    roles: CUSTOMER_AUTH_ROLES,
    permissions: ["order.read_own"],
    services: ["service.order_management"]
  },
  {
    route: "/account/loyalty",
    surface: "storefront",
    access: "auth",
    roles: ["customer_loyalty"],
    permissions: ["customer.loyalty_read"],
    services: ["service.loyalty"]
  },
  {
    route: "/admin",
    surface: "tenant_admin",
    access: "auth",
    roles: TENANT_OPERATOR_ROLES,
    permissions: ["tenant.dashboard.access"]
  },
  {
    route: "/admin/products",
    surface: "tenant_admin",
    access: "auth",
    roles: ["tenant_owner", "tenant_admin", "tenant_manager", "sales_staff"],
    permissions: ["product.create", "product.update"],
    services: ["service.product_catalog"]
  },
  {
    route: "/admin/orders",
    surface: "tenant_admin",
    access: "auth",
    roles: ["tenant_owner", "tenant_admin", "tenant_manager", "sales_staff", "support_staff", "finance_staff"],
    permissions: ["order.read"],
    services: ["service.order_management"]
  },
  {
    route: "/admin/inventory",
    surface: "tenant_admin",
    access: "auth",
    roles: ["tenant_owner", "tenant_admin", "tenant_manager", "inventory_staff"],
    permissions: ["inventory.read", "inventory.update"],
    services: ["service.inventory"]
  },
  {
    route: "/admin/repairs",
    surface: "tenant_admin",
    access: "auth",
    roles: ["tenant_owner", "tenant_admin", "tenant_manager", "repair_staff"],
    permissions: ["repair.read"],
    services: ["service.repair"]
  },
  {
    route: "/admin/theme",
    surface: "tenant_admin",
    access: "auth",
    roles: ["tenant_owner", "tenant_admin", "tenant_theme_admin"],
    permissions: ["tenant.theme.manage"],
    services: ["service.theme_builder"]
  },
  {
    route: "/platform",
    surface: "platform",
    access: "auth",
    roles: PLATFORM_OPERATOR_ROLES,
    permissions: ["platform.tenant.read"]
  },
  {
    route: "/platform/tenants",
    surface: "platform",
    access: "auth",
    roles: PLATFORM_OPERATOR_ROLES,
    permissions: ["platform.tenant.read"]
  },
  {
    route: "/platform/tenants/new",
    surface: "platform",
    access: "auth",
    roles: ["platform_owner", "platform_admin", "platform_sales_admin"],
    permissions: ["platform.tenant.create"]
  },
  {
    route: "/platform/services",
    surface: "platform",
    access: "auth",
    roles: ["platform_owner", "platform_admin"],
    permissions: ["platform.service_catalog.manage"]
  },
  {
    route: "/platform/subscriptions",
    surface: "platform",
    access: "auth",
    roles: ["platform_owner", "platform_admin", "platform_sales_admin", "platform_billing"],
    permissions: ["platform.subscription.manage"]
  }
] as const satisfies readonly RoutePolicy[];

/** Tìm policy được cấu hình chính xác cho một route frontend đã biết. */
export function findRoutePolicy(route: string): RoutePolicy | undefined {
  return ROUTE_POLICIES.find((policy) => policy.route === route);
}
