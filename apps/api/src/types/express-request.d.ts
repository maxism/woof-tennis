import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    /** Correlation id для логов (middleware в main.ts) */
    requestId?: string;
  }
}
