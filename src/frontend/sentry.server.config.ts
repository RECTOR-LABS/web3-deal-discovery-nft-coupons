/**
 * Sentry Server-Side Configuration
 *
 * Captures errors in Next.js server-side code
 * Runs on the server (Node.js) only
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Get DSN from Sentry project settings
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'production' : 'development',

  // Sample rate for error events
  sampleRate: 1.0,

  // Sample rate for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Ignore errors
  ignoreErrors: [
    'ECONNREFUSED',
    'ENOTFOUND',
    'fetch failed',
  ],

  // Filter sensitive data
  beforeSend(event, hint) {
    // Don't send if DSN not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Remove sensitive environment variables
    if (event.contexts?.runtime) {
      delete event.contexts.runtime;
    }

    // Remove sensitive request data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    return event;
  },

  // Additional server-side options
  maxBreadcrumbs: 50,
  debug: process.env.NODE_ENV === 'development',
});
