-- Production Database Indexes Migration
-- Date: 2025-10-20
-- Purpose: Add performance-critical indexes for production workload

-- ====================
-- MERCHANTS TABLE
-- ====================

-- Index on wallet_address (frequently queried for auth/verification)
CREATE INDEX IF NOT EXISTS idx_merchants_wallet_address
ON merchants(wallet_address);

-- Index on status (filter active merchants)
CREATE INDEX IF NOT EXISTS idx_merchants_status
ON merchants(status) WHERE status = 'active';

-- Composite index for geo queries
CREATE INDEX IF NOT EXISTS idx_merchants_location
ON merchants(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ====================
-- DEALS TABLE
-- ====================

-- Index on merchant_id (FK, frequently joined)
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id
ON deals(merchant_id);

-- Index on status (filter active deals)
CREATE INDEX IF NOT EXISTS idx_deals_status
ON deals(status);

-- Index on category (frequent filter)
CREATE INDEX IF NOT EXISTS idx_deals_category
ON deals(category);

-- Index on expiry_date (filter expired deals)
CREATE INDEX IF NOT EXISTS idx_deals_expiry_date
ON deals(expiry_date);

-- Composite index for active, non-expired deals (hot path)
CREATE INDEX IF NOT EXISTS idx_deals_active
ON deals(status, expiry_date)
WHERE status = 'active' AND expiry_date > NOW();

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_deals_created_at
ON deals(created_at DESC);

-- ====================
-- EVENTS TABLE
-- ====================

-- Index on deal_id (FK, frequently joined)
CREATE INDEX IF NOT EXISTS idx_events_deal_id
ON events(deal_id);

-- Index on user_wallet (track user activity)
CREATE INDEX IF NOT EXISTS idx_events_user_wallet
ON events(user_wallet);

-- Index on event_type (filter by event type)
CREATE INDEX IF NOT EXISTS idx_events_event_type
ON events(event_type);

-- Index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_events_created_at
ON events(created_at DESC);

-- ====================
-- REVIEWS TABLE
-- ====================

-- Index on deal_id (FK, frequently joined)
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id
ON reviews(deal_id);

-- Index on user_wallet (user's reviews)
CREATE INDEX IF NOT EXISTS idx_reviews_user_wallet
ON reviews(user_wallet);

-- Composite index for rating aggregation
CREATE INDEX IF NOT EXISTS idx_reviews_deal_rating
ON reviews(deal_id, rating);

-- ====================
-- VOTES TABLE
-- ====================

-- Index on deal_id (FK, frequently joined)
CREATE INDEX IF NOT EXISTS idx_votes_deal_id
ON votes(deal_id);

-- Unique composite index for one vote per user per deal
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_user_deal_unique
ON votes(deal_id, user_wallet);

-- ====================
-- RESALE LISTINGS TABLE
-- ====================

-- Index on nft_address (unique NFT identifier)
CREATE INDEX IF NOT EXISTS idx_resale_nft_address
ON resale_listings(nft_address);

-- Index on seller_wallet (seller's listings)
CREATE INDEX IF NOT EXISTS idx_resale_seller_wallet
ON resale_listings(seller_wallet);

-- Index on status (filter active listings)
CREATE INDEX IF NOT EXISTS idx_resale_status
ON resale_listings(status)
WHERE status = 'active';

-- ====================
-- REFERRALS TABLE
-- ====================

-- Index on referrer_wallet (referrer's referrals)
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_wallet
ON referrals(referrer_wallet);

-- Index on referred_wallet (unique referral tracking)
CREATE INDEX IF NOT EXISTS idx_referrals_referred_wallet
ON referrals(referred_wallet);

-- ====================
-- STAKING TABLE
-- ====================

-- Index on user_wallet (user's staking positions)
CREATE INDEX IF NOT EXISTS idx_staking_user_wallet
ON staking(user_wallet);

-- Index on status (filter active stakes)
CREATE INDEX IF NOT EXISTS idx_staking_status
ON staking(status)
WHERE status = 'active';

-- ====================
-- CASHBACK TRANSACTIONS TABLE
-- ====================

-- Index on user_wallet (user's cashback history)
CREATE INDEX IF NOT EXISTS idx_cashback_user_wallet
ON cashback_transactions(user_wallet);

-- Index on deal_id (cashback per deal)
CREATE INDEX IF NOT EXISTS idx_cashback_deal_id
ON cashback_transactions(deal_id);

-- Index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_cashback_created_at
ON cashback_transactions(created_at DESC);

-- ====================
-- BADGES TABLE
-- ====================

-- Index on user_wallet (user's badges)
CREATE INDEX IF NOT EXISTS idx_badges_user_wallet
ON badges(user_wallet);

-- Index on badge_type (filter by badge type)
CREATE INDEX IF NOT EXISTS idx_badges_badge_type
ON badges(badge_type);

-- Unique composite index for one badge per user per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_badges_user_type_unique
ON badges(user_wallet, badge_type);

-- ====================
-- PERFORMANCE NOTES
-- ====================

-- Run ANALYZE after index creation to update statistics
ANALYZE merchants;
ANALYZE deals;
ANALYZE events;
ANALYZE reviews;
ANALYZE votes;
ANALYZE resale_listings;
ANALYZE referrals;
ANALYZE staking;
ANALYZE cashback_transactions;
ANALYZE badges;

-- To monitor index usage in production:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;
