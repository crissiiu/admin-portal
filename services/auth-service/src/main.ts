import { createApp } from "./app.js";
import { loadConfig } from "@job-portal/config";
import { createLogger } from "@job-portal/logger";

const config = loadConfig("auth-service");
const logger = createLogger(config.serviceName);
const app = await createApp();

app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, "auth-service started");
});
