/**
 * Sentry Client-Side Configuration
 *
 * Captures errors in the browser
 * Runs on the client (browser) only
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Get DSN from Sentry project settings
  // Set via environment variable: NEXT_PUBLIC_SENTRY_DSN
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment (development, staging, production)
  environment: process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'production' : 'development',

  // Sample rate for error events (1.0 = 100%)
  sampleRate: 1.0,

  // Sample rate for performance monitoring (0.1 = 10%)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable session replay for debugging (privacy-conscious)
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% when error occurs

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true, // Privacy: mask all text
      blockAllMedia: true, // Privacy: block all media
    }),
  ],

  // Ignore common non-critical errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'wallet not connected',
    'User rejected the request',
  ],

  // Filter sensitive data
  beforeSend(event, _hint) {
    // Don't send events if DSN not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter out errors from browser extensions
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
      frame => frame.filename?.includes('extension://')
    )) {
      return null;
    }

    // Remove sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(
        breadcrumb => !breadcrumb.message?.includes('privateKey')
      );
    }

    return event;
  },
});
