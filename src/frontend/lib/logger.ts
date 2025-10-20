/**
 * Structured Logging with Pino
 * Production-ready logging with log levels and metadata
 */

import pino from 'pino';

// Create base logger
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Browser-compatible configuration
  browser: {
    asObject: true,
    serialize: true,
  },

  // Custom formatters for better readability
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        node_version: process.version,
      };
    },
  },

  // Add timestamp
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Base metadata
  base: {
    env: process.env.NODE_ENV,
    app: 'dealcoupon',
  },
});

/**
 * Create child logger with context
 * @param context - Context object (e.g., { module: 'auth', userId: '123' })
 */
export function createLogger(context: Record<string, string | number | boolean>) {
  return logger.child(context);
}

/**
 * API request logger
 */
export const apiLogger = createLogger({ module: 'api' });

/**
 * Database logger
 */
export const dbLogger = createLogger({ module: 'database' });

/**
 * Blockchain logger
 */
export const blockchainLogger = createLogger({ module: 'blockchain' });

/**
 * Auth logger
 */
export const authLogger = createLogger({ module: 'auth' });

/**
 * Log levels:
 * - trace(obj, msg) - Very detailed
 * - debug(obj, msg) - Debugging info
 * - info(obj, msg) - General info
 * - warn(obj, msg) - Warnings
 * - error(obj, msg) - Errors
 * - fatal(obj, msg) - Fatal errors
 */

/**
 * Usage Examples:
 *
 * // Simple log
 * logger.info('Server started');
 *
 * // Log with metadata
 * logger.info({ userId: '123', action: 'login' }, 'User logged in');
 *
 * // Error logging
 * logger.error({ error: err, endpoint: '/api/deals' }, 'API error occurred');
 *
 * // Child logger with context
 * const userLogger = createLogger({ userId: '123' });
 * userLogger.info({ action: 'claim_nft' }, 'NFT claimed');
 *
 * // Module-specific logging
 * apiLogger.info({ method: 'GET', path: '/api/health' }, 'Health check');
 * dbLogger.error({ query: 'SELECT *', error: err }, 'Database query failed');
 * blockchainLogger.info({ txHash: '0x...' }, 'Transaction confirmed');
 */

export default logger;
