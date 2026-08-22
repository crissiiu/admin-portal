import type { RequestHandler } from "express";
import type { ServiceName, ServiceProxy } from "../infrastructure/external-clients/service-proxy.js";

export class GatewayController {
  constructor(private readonly proxy: ServiceProxy) {}

  forward(serviceName: ServiceName): RequestHandler {
    return async (req, res) => {
      const response = await this.proxy.forward(serviceName, req);
      res.status(response.status).set(response.headers).send(response.body);
    };
  }
}
