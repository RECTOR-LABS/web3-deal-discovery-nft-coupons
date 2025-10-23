/**
 * Custom Business Metrics with Sentry
 * Track key business events and performance
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Metric Types
 */
export enum MetricType {
  // NFT Lifecycle
  NFT_CLAIMED = 'nft.claimed',
  NFT_REDEEMED = 'nft.redeemed',
  NFT_TRANSFER = 'nft.transferred',

  // Deal Events
  DEAL_CREATED = 'deal.created',
  DEAL_VIEWED = 'deal.viewed',
  DEAL_EXPIRED = 'deal.expired',

  // User Events
  USER_REGISTERED = 'user.registered',
  USER_LOGIN = 'user.login',
  WALLET_CONNECTED = 'wallet.connected',

  // Social Events
  REVIEW_SUBMITTED = 'review.submitted',
  VOTE_CAST = 'vote.cast',
  DEAL_SHARED = 'deal.shared',

  // Merchant Events
  MERCHANT_REGISTERED = 'merchant.registered',
  MERCHANT_VERIFIED = 'merchant.verified',

  // Financial Events
  CASHBACK_EARNED = 'cashback.earned',
  STAKE_CREATED = 'stake.created',
  STAKE_WITHDRAWN = 'stake.withdrawn',
  PAYMENT_COMPLETED = 'payment.completed',

  // Errors
  ERROR_NFT_MINT_FAILED = 'error.nft_mint_failed',
  ERROR_REDEMPTION_FAILED = 'error.redemption_failed',
  ERROR_PAYMENT_FAILED = 'error.payment_failed',
}

/**
 * Track a metric increment
 */
export function trackMetric(
  metric: MetricType,
  value: number = 1,
  tags?: Record<string, string | number>
) {
  if (typeof window === 'undefined') {
    // Server-side
    Sentry.metrics.increment(metric, value, { tags });
  } else {
    // Client-side (optional)
    console.log(`[Metric] ${metric}:`, value, tags);
  }
}

/**
 * Track a distribution (for latency, size, etc.)
 */
export function trackDistribution(
  metric: string,
  value: number,
  unit: 'millisecond' | 'byte' | 'none' = 'none',
  tags?: Record<string, string | number>
) {
  if (typeof window === 'undefined') {
    Sentry.metrics.distribution(metric, value, { unit, tags });
  }
}

/**
 * Track a gauge (current value)
 */
export function trackGauge(
  metric: string,
  value: number,
  unit: 'millisecond' | 'byte' | 'none' = 'none',
  tags?: Record<string, string | number>
) {
  if (typeof window === 'undefined') {
    Sentry.metrics.gauge(metric, value, { unit, tags });
  }
}

/**
 * Track a set (unique values)
 */
export function trackSet(
  metric: string,
  value: string | number,
  tags?: Record<string, string | number>
) {
  if (typeof window === 'undefined') {
    Sentry.metrics.set(metric, value, { tags });
  }
}

/**
 * Pre-configured metric trackers
 */

export const Metrics = {
  // NFT Events
  nftClaimed: (category: string, merchantId: string) => {
    trackMetric(MetricType.NFT_CLAIMED, 1, { category, merchant_id: merchantId });
  },

  nftRedeemed: (category: string, discount: number) => {
    trackMetric(MetricType.NFT_REDEEMED, 1, { category });
    trackDistribution('nft.discount_amount', discount, 'none', { category });
  },

  // Deal Events
  dealCreated: (category: string, discount: number) => {
    trackMetric(MetricType.DEAL_CREATED, 1, { category });
    trackDistribution('deal.discount_percentage', discount, 'none', { category });
  },

  dealViewed: (dealId: string, category: string) => {
    trackMetric(MetricType.DEAL_VIEWED, 1, { category });
    trackSet('deals.unique_views', dealId, { category });
  },

  // User Events
  userRegistered: (method: 'wallet' | 'email') => {
    trackMetric(MetricType.USER_REGISTERED, 1, { method });
  },

  walletConnected: (walletType: string) => {
    trackMetric(MetricType.WALLET_CONNECTED, 1, { wallet_type: walletType });
  },

  // Social Events
  reviewSubmitted: (rating: number, category: string) => {
    trackMetric(MetricType.REVIEW_SUBMITTED, 1, { category });
    trackDistribution('review.rating', rating, 'none', { category });
  },

  voteCast: (voteType: 'upvote' | 'downvote', category: string) => {
    trackMetric(MetricType.VOTE_CAST, 1, { vote_type: voteType, category });
  },

  // Performance Metrics
  apiLatency: (endpoint: string, duration: number) => {
    trackDistribution('api.latency', duration, 'millisecond', { endpoint });
  },

  databaseQueryLatency: (table: string, duration: number) => {
    trackDistribution('db.query_latency', duration, 'millisecond', { table });
  },

  // Error Metrics
  error: (type: string, endpoint?: string) => {
    const tags: Record<string, string> = { error_type: type };
    if (endpoint) tags.endpoint = endpoint;
    trackMetric(MetricType.ERROR_NFT_MINT_FAILED, 1, tags);
  },
};

/**
 * Usage Examples:
 *
 * // In API routes
 * import { Metrics } from '@/lib/metrics';
 *
 * // Track NFT claim
 * Metrics.nftClaimed('food', 'merchant-123');
 *
 * // Track deal creation
 * Metrics.dealCreated('travel', 50);
 *
 * // Track user registration
 * Metrics.userRegistered('wallet');
 *
 * // Track API latency
 * const start = Date.now();
 * // ... API logic ...
 * Metrics.apiLatency('/api/deals', Date.now() - start);
 *
 * // Track custom metric
 * trackMetric('custom.event', 1, { custom_tag: 'value' });
 */

export default Metrics;
