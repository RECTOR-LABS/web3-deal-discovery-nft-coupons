# Sentry Alerts Configuration Guide

**Date:** 2025-10-20
**Purpose:** Configure production alerts for error monitoring and performance tracking

---

## Prerequisites

- Sentry account with project created
- `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` configured in environment

---

## Alert Configuration

### 1. Error Rate Alerts

**Critical: 5xx Error Rate Spike**

```yaml
Alert Name: High 5xx Error Rate
Condition: Error count > 10 per minute
Filter: http.status_code >= 500
Time Window: 1 minute
Trigger: When threshold is exceeded for 2 consecutive minutes
Action: Email + Slack notification
Severity: Critical
```

**High: 4xx Error Rate Spike**

```yaml
Alert Name: High Client Error Rate
Condition: Error count > 50 per minute
Filter: http.status_code >= 400 AND http.status_code < 500
Time Window: 1 minute
Trigger: When threshold is exceeded for 5 consecutive minutes
Action: Slack notification
Severity: Warning
```

### 2. Performance Alerts

**Response Time Degradation**

```yaml
Alert Name: Slow API Response Time
Condition: P95 response time > 3000ms
Filter: transaction.op = "http.server"
Time Window: 5 minutes
Trigger: When threshold is exceeded for 3 consecutive periods
Action: Email + Slack notification
Severity: High
```

**Database Query Performance**

```yaml
Alert Name: Slow Database Queries
Condition: P95 query time > 1000ms
Filter: span.op = "db.query"
Time Window: 5 minutes
Trigger: When threshold is exceeded for 3 consecutive periods
Action: Slack notification
Severity: Medium
```

### 3. Service Health Alerts

**Health Check Failures**

```yaml
Alert Name: Health Check Failing
Condition: Error count > 5 per 5 minutes
Filter: transaction = "GET /api/health"
Time Window: 5 minutes
Trigger: When threshold is exceeded
Action: Email + Slack + PagerDuty
Severity: Critical
```

**Database Connection Errors**

```yaml
Alert Name: Database Connection Failures
Condition: Error count > 3 per minute
Filter: error.type = "DatabaseConnectionError"
Time Window: 1 minute
Trigger: Immediately
Action: Email + Slack + PagerDuty
Severity: Critical
```

### 4. Business Logic Alerts

**NFT Minting Failures**

```yaml
Alert Name: NFT Minting Failures
Condition: Error count > 5 per hour
Filter: transaction contains "mint" OR "create_coupon"
Time Window: 1 hour
Trigger: When threshold is exceeded
Action: Slack notification
Severity: High
```

**Redemption Failures**

```yaml
Alert Name: Coupon Redemption Failures
Condition: Error count > 5 per hour
Filter: transaction contains "redeem"
Time Window: 1 hour
Trigger: When threshold is exceeded
Action: Slack notification
Severity: High
```

---

## Sentry Dashboard Setup

### Step 1: Log into Sentry

1. Go to https://sentry.io
2. Select your organization
3. Select project: `dealcoupon-frontend`

### Step 2: Create Alert Rules

Navigate to **Alerts** → **Create Alert Rule**

For each alert above:

1. Click "Create Alert"
2. Select "Errors" or "Performance" category
3. Configure conditions as specified
4. Set time window and trigger
5. Add integration (Email, Slack, PagerDuty)
6. Save alert

### Step 3: Configure Integrations

**Slack Integration:**
```
1. Go to Settings → Integrations
2. Search for "Slack"
3. Click "Add to Slack"
4. Select channel: #dealcoupon-alerts
5. Save configuration
```

**Email Notifications:**
```
1. Go to Settings → Notifications
2. Add email recipients:
   - engineering@rectorspace.com
   - alerts@rectorspace.com
3. Set notification preferences:
   - Critical: Immediate
   - High: Every occurrence
   - Medium: Digest (hourly)
   - Low: Digest (daily)
```

---

## Alert Testing

### Test 5xx Error Alert

```bash
# Trigger a 500 error
curl -X GET https://your-domain.com/api/trigger-error

# Verify alert fired in Sentry → Alerts → Alert History
```

### Test Performance Alert

```bash
# Trigger slow request
curl -X GET https://your-domain.com/api/slow-endpoint?delay=5000

# Check Sentry → Performance → Transactions
```

---

## Custom Metrics (Using Sentry SDK)

Add custom metrics to track business events:

```typescript
// app/api/deals/claim/route.ts
import * as Sentry from '@sentry/nextjs';

export async function POST(request: Request) {
  try {
    // ... NFT claiming logic ...

    // Track successful claim
    Sentry.metrics.increment('nft.claimed', 1, {
      tags: {
        category: deal.category,
        merchant_id: deal.merchant_id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Error automatically captured by Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/deals/claim',
        deal_id: dealId,
      },
    });
    throw error;
  }
}
```

**Metrics to Track:**
1. `nft.claimed` - NFT claim events
2. `nft.redeemed` - NFT redemption events
3. `deal.created` - New deals created
4. `user.registered` - New user registrations
5. `review.submitted` - Review submissions
6. `vote.cast` - Vote events

---

## Alert Response Playbook

### When 5xx Alert Fires

1. **Check Sentry Issue:**
   - Review error stack trace
   - Check frequency and affected users
   - Identify root cause (code, database, external API)

2. **Verify Service Health:**
   ```bash
   curl https://your-domain.com/api/health
   ```

3. **Check Infrastructure:**
   - Vercel dashboard (serverless function errors)
   - Supabase dashboard (database errors)
   - Solana RPC status (blockchain errors)

4. **Rollback if Critical:**
   ```bash
   # Vercel dashboard → Deployments → Rollback
   ```

### When Performance Alert Fires

1. **Check Sentry Performance:**
   - Identify slow transaction
   - Review flame graph
   - Check database query N+1 issues

2. **Optimize Query:**
   - Add database index
   - Implement caching
   - Reduce data fetching

3. **Monitor Improvement:**
   - Deploy fix
   - Watch Sentry P95 metrics

---

## SLOs (Service Level Objectives)

### Availability SLO
- **Target:** 99.9% uptime (43.8 minutes downtime/month)
- **Measurement:** Health check success rate
- **Alert:** When availability < 99.9% over 30-day period

### Latency SLO
- **Target:** P95 response time < 500ms
- **Measurement:** Sentry transaction duration
- **Alert:** When P95 > 500ms over 1-hour period

### Error Rate SLO
- **Target:** < 0.1% error rate
- **Measurement:** 5xx errors / total requests
- **Alert:** When error rate > 0.1% over 1-hour period

---

## Maintenance

- **Weekly:** Review alert history, adjust thresholds
- **Monthly:** Analyze trends, identify recurring issues
- **Quarterly:** Update runbooks, test alert integrations

---

## Reference Links

- Sentry Alerts Docs: https://docs.sentry.io/product/alerts/
- Performance Monitoring: https://docs.sentry.io/product/performance/
- Custom Metrics: https://docs.sentry.io/platforms/javascript/metrics/

---

**Next Steps:**
1. Log into Sentry and create these alerts
2. Test each alert by triggering errors
3. Verify Slack/Email notifications work
4. Add custom metrics to critical API routes
