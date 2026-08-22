import type { RouteTarget } from "../entities/route-target.entity.js";

export interface RouteTargetRepository {
  findByServiceName(serviceName: string): Promise<RouteTarget | null>;
}
