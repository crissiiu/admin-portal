export interface LogContext {
  requestId?: string;
  feature?: string;
  [key: string]: unknown;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.info(message, context);
  },
  error(message: string, context?: LogContext) {
    console.error(message, context);
  }
};

