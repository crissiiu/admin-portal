import type { Role } from "./roles.js";
import type { ServiceEntitlement } from "./service-entitlements.js";

export type ActorType = "guest" | "customer" | "tenant_user" | "platform_user";

export type AccessContext = {
  actorType: ActorType;
  roles: readonly Role[];
  actorId?: string;
  tenantId?: string;
  tenantServices?: readonly ServiceEntitlement[];
  resourceOwnerId?: string;
  resourceTenantId?: string;
};

export type AccessDecision = {
  allowed: boolean;
  reason?: string;
};
