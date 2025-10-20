# Sentry Error Monitoring Setup Guide

**Last Updated:** October 19, 2025

## Overview

Sentry is integrated for production error monitoring and tracking. This guide covers setup, configuration, and usage.

## Prerequisites

- Sentry account (https://sentry.io)
- Vercel deployment or self-hosted environment

## Setup Instructions

### 1. Create Sentry Project

1. **Sign up for Sentry**
   - Go to https://sentry.io/signup/
   - Create account or sign in

2. **Create New Project**
   - Click "Projects" > "Create Project"
   - Platform: **Next.js**
   - Alert frequency: **On every new issue**
   - Give it a name: `web3-deal-discovery`

3. **Get DSN (Data Source Name)**
   - After project creation, copy the DSN
   - Format: `https://xxx@yyy.ingest.sentry.io/zzz`

### 2. Configure Environment Variables

Add to `.env.local` (development) and Vercel (production):

```bash
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz

# Optional: Auth token for source maps upload
# Get from: https://sentry.io/settings/account/api/auth-tokens/
# SENTRY_AUTH_TOKEN=your_auth_token_here
```

**In Vercel:**
```bash
vercel env add NEXT_PUBLIC_SENTRY_DSN
# Paste your DSN when prompted
# Select: Production, Preview, Development
```

### 3. Install Dependencies

Already configured in `package.json`:

```bash
cd src/frontend
npm install
```

### 4. Verify Installation

Run the development server:

```bash
npm run dev
```

Check console for Sentry initialization messages (if DSN is set).

## Configuration Files

### Client-Side (`sentry.client.config.ts`)
- Captures browser errors
- Session replay for debugging
- Privacy-focused (masks text, blocks media)

### Server-Side (`sentry.server.config.ts`)
- Captures API route errors
- Server-side rendering errors
- Sensitive data filtering

### Edge Runtime (`sentry.edge.config.ts`)
- Captures middleware errors
- Edge API route errors
- Lower sampling rate (performance)

## Testing Sentry Integration

### 1. Test Error Capture

Add a test button to any page:

```typescript
<button onClick={() => {
  throw new Error('Test Sentry Error');
}}>
  Trigger Test Error
</button>
```

### 2. Check Sentry Dashboard

- Go to https://sentry.io/organizations/your-org/issues/
- Look for the test error
- Verify stack trace, breadcrumbs, and context

### 3. Test API Route Errors

```typescript
// app/api/test-sentry/route.ts
export async function GET() {
  throw new Error('Test API Error');
}
```

Visit `/api/test-sentry` and check Sentry dashboard.

## Features Enabled

### Error Tracking
- ✅ Automatic error capture
- ✅ Stack traces with source maps
- ✅ Breadcrumbs (user actions leading to error)
- ✅ Device and browser info
- ✅ Release tracking

### Performance Monitoring
- ✅ Transaction tracing
- ✅ API endpoint performance
- ✅ Database query monitoring
- ✅ Slow route detection

### Session Replay
- ✅ Video-like reproduction of errors
- ✅ Privacy: text masked, media blocked
- ✅ 10% of sessions, 100% on errors

## Alert Configuration

### Recommended Alerts

1. **New Issue Alert**
   - Trigger: First time an error occurs
   - Action: Email to team
   - Frequency: Immediately

2. **High Volume Alert**
   - Trigger: >100 errors in 1 hour
   - Action: Email + Slack notification
   - Frequency: Every 30 minutes max

3. **Regression Alert**
   - Trigger: Previously resolved issue re-occurs
   - Action: Email to assignee
   - Frequency: Immediately

### Set up in Sentry:
- Go to **Alerts** > **Create Alert**
- Choose alert type and conditions
- Add notification channels

## Integration with Error Boundary

The global error boundary (`app/error.tsx`) automatically sends errors to Sentry when they occur.

Manual capture:

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
  // handle error
}
```

## Source Maps

**Important for production debugging!**

Source maps help Sentry show readable stack traces.

### Automatic Upload

Source maps are automatically uploaded during build if `SENTRY_AUTH_TOKEN` is set.

### Manual Upload

```bash
npx @sentry/cli releases files <release-version> upload-sourcemaps .next

# Example
npx @sentry/cli releases files 1.0.0 upload-sourcemaps .next
```

## Release Tracking

Track deployments in Sentry:

```bash
# After deployment
sentry-cli releases new <version>
sentry-cli releases set-commits <version> --auto
sentry-cli releases finalize <version>
```

Or use Vercel integration (automatic).

## Privacy & Security

### Data Filtering

Configured to filter:
- ❌ Private keys and seed phrases
- ❌ Authentication cookies
- ❌ Sensitive headers
- ❌ Environment variables

### What's Sent

- ✅ Error messages and stack traces
- ✅ User browser/device info (non-PII)
- ✅ Breadcrumbs (sanitized)
- ✅ Performance metrics

### GDPR Compliance

- User IP addresses: **Anonymized** (configure in Sentry settings)
- Data retention: **90 days** (configurable)
- Data deletion: **On request** (contact Sentry support)

## Performance Monitoring

### Sample Rates

**Development:**
- Error events: 100%
- Transactions: 100%
- Session replay: 100%

**Production:**
- Error events: 100%
- Transactions: 10%
- Session replay: 10% (100% on errors)

### Adjust in config files:
```typescript
tracesSampleRate: 0.1, // 10%
replaysSessionSampleRate: 0.1, // 10%
```

## Troubleshooting

### No Errors Appearing

1. **Check DSN**
   ```bash
   echo $NEXT_PUBLIC_SENTRY_DSN
   # Should output DSN URL
   ```

2. **Verify Config Files**
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`

3. **Check Console**
   - Look for Sentry initialization logs
   - Check for config errors

### Source Maps Not Working

1. **Generate Auth Token**
   - Go to Sentry > Settings > Auth Tokens
   - Create token with `project:releases` scope

2. **Add to Environment**
   ```bash
   SENTRY_AUTH_TOKEN=your_token
   ```

3. **Rebuild**
   ```bash
   npm run build
   ```

### Too Many Events

1. **Adjust Sample Rates**
   - Lower `tracesSampleRate`
   - Increase `ignoreErrors` list

2. **Add Filters**
   ```typescript
   ignoreErrors: [
     'ResizeObserver loop',
     'Non-Error promise rejection',
     // Add more patterns
   ]
   ```

## Cost Management

### Free Tier Limits
- 5,000 errors/month
- 10,000 transactions/month
- 50 replays/month

### Paid Plans
- **Team:** $26/month (50k errors)
- **Business:** $80/month (150k errors)

### Optimization Tips
- Use sample rates effectively
- Filter non-critical errors
- Set up rate limits per issue

## Monitoring Dashboard

Key metrics to watch:

1. **Error Rate**
   - Trend over time
   - Spikes indicate issues

2. **Top Issues**
   - Most frequent errors
   - Prioritize fixes

3. **Affected Users**
   - Unique users impacted
   - Critical if high

4. **Release Health**
   - Crash-free sessions
   - Target: >99.9%

## Support & Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Status Page:** https://status.sentry.io/
- **Community:** https://discord.gg/sentry

---

**Next Review:** Monthly

**Owner:** DevOps Team
