import { loadConfig } from "@job-portal/config";
import { createLogger } from "@job-portal/logger";
import { createApp } from "./app.js";

const config = loadConfig("user-service");
const logger = createLogger(config.serviceName);

createApp().listen(config.PORT, () => {
  logger.info({ port: config.PORT }, "user-service started");
});
