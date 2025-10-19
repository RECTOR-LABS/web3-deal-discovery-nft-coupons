/**
 * Sentry Edge Runtime Configuration
 *
 * Captures errors in Edge Runtime (middleware, edge API routes)
 * Runs on Vercel Edge Network
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Get DSN from Sentry project settings
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'production' : 'development',

  // Sample rate for error events
  sampleRate: 1.0,

  // Sample rate for performance monitoring (lower for edge due to volume)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // Filter sensitive data
  beforeSend(event, _hint) {
    // Don't send if DSN not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Remove sensitive request data from middleware
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    return event;
  },
});
