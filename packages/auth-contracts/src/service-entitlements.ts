export const SERVICE_ENTITLEMENTS = [
  "service.storefront",
  "service.product_catalog",
  "service.cart_checkout",
  "service.order_management",
  "service.inventory",
  "service.repair",
  "service.loyalty",
  "service.hr",
  "service.content_cms",
  "service.custom_domain",
  "service.theme_builder",
  "service.discount",
  "service.support_ticket",
  "service.finance"
] as const;

export type ServiceEntitlement = (typeof SERVICE_ENTITLEMENTS)[number];

export const ALL_SERVICE_ENTITLEMENTS = new Set<ServiceEntitlement>(SERVICE_ENTITLEMENTS);
