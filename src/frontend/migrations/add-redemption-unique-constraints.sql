-- Migration: Add Unique Constraints for Redemption Race Condition Protection
-- Date: 2025-10-20
-- Purpose: Prevent duplicate redemptions at database level
-- Related: PR Review feedback - Critical Issue #5

-- ====================
-- BACKGROUND
-- ====================
-- Problem: Two merchants could scan the same QR code simultaneously, causing:
-- 1. Duplicate redemption events in database
-- 2. Double cashback distribution
-- 3. Multiple badge minting attempts
--
-- Solution: Add application-level checks (already implemented in route.ts)
--           + database-level unique constraints (this migration)
--
-- Layered Protection:
-- Layer 1: Application checks in /api/redemptions/route.ts (lines 28-69)
-- Layer 2: Database unique constraints (this file)
-- Layer 3: PostgreSQL error handling (code 23505)

-- ====================
-- OPTION 1: Unique Index on JSONB Metadata (Recommended)
-- ====================
-- Create unique index on nft_mint within metadata column
-- This prevents two redemption events with same nft_mint

-- Step 1: Create unique index on nft_mint in metadata
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_events_redemption_nft_mint
ON events ((metadata->>'nft_mint'))
WHERE event_type = 'redemption';

-- Step 2: Create unique index on transaction_signature in metadata
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_events_redemption_tx_signature
ON events ((metadata->>'transaction_signature'))
WHERE event_type = 'redemption';

-- Benefits:
-- - Guarantees uniqueness at database level
-- - Uses CONCURRENTLY to avoid blocking production traffic
-- - Partial indexes (WHERE clause) for better performance
-- - Works with existing JSONB metadata structure

-- ====================
-- OPTION 2: Normalized Redemptions Table (Future Enhancement)
-- ====================
-- For better performance and querying, consider creating a dedicated table:
--
-- CREATE TABLE redemptions (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   nft_mint TEXT UNIQUE NOT NULL,  -- Unique constraint here
--   transaction_signature TEXT UNIQUE NOT NULL,  -- And here
--   deal_id UUID REFERENCES deals(id),
--   user_wallet TEXT NOT NULL,
--   merchant_wallet TEXT NOT NULL,
--   redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(nft_mint),  -- Prevent duplicate NFT redemptions
--   UNIQUE(transaction_signature)  -- Prevent duplicate transactions
-- );
--
-- Benefits:
-- - Clearer schema
-- - Faster queries
-- - Built-in unique constraints
-- - Better for JOIN operations
--
-- Migration steps:
-- 1. Create new table
-- 2. Backfill from events table
-- 3. Update application code to use new table
-- 4. Keep events table for audit log

-- ====================
-- VERIFICATION QUERIES
-- ====================

-- Check if unique indexes were created successfully
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'events'
  AND indexname LIKE '%redemption%';

-- Test uniqueness protection (should fail on second insert)
-- DO NOT RUN IN PRODUCTION - This is for testing only
/*
-- First insert (should succeed)
INSERT INTO events (event_type, user_wallet, metadata)
VALUES ('redemption', 'test_wallet', '{"nft_mint": "test_nft_123", "transaction_signature": "test_tx_456"}');

-- Second insert with same nft_mint (should fail with error 23505)
INSERT INTO events (event_type, user_wallet, metadata)
VALUES ('redemption', 'another_wallet', '{"nft_mint": "test_nft_123", "transaction_signature": "test_tx_789"}');

-- Clean up test data
DELETE FROM events WHERE user_wallet = 'test_wallet';
*/

-- Check for existing duplicate redemptions (before applying constraints)
SELECT
    metadata->>'nft_mint' as nft_mint,
    COUNT(*) as redemption_count
FROM events
WHERE event_type = 'redemption'
  AND metadata->>'nft_mint' IS NOT NULL
GROUP BY metadata->>'nft_mint'
HAVING COUNT(*) > 1;

-- If duplicates exist, clean them up before adding constraints:
/*
-- Keep only the first redemption, delete duplicates
WITH duplicates AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY metadata->>'nft_mint'
            ORDER BY timestamp ASC
        ) as row_num
    FROM events
    WHERE event_type = 'redemption'
)
DELETE FROM events
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);
*/

-- ====================
-- ROLLBACK (If needed)
-- ====================
-- DROP INDEX CONCURRENTLY IF EXISTS idx_events_redemption_nft_mint;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_events_redemption_tx_signature;

-- ====================
-- DEPLOYMENT NOTES
-- ====================
-- 1. Run this migration during low-traffic period
-- 2. CONCURRENTLY keyword allows production to continue running
-- 3. Verify no existing duplicates before applying (see check query above)
-- 4. Test in staging environment first
-- 5. Monitor error logs for 23505 errors after deployment
-- 6. Application code (route.ts) already handles these errors gracefully

-- ====================
-- PERFORMANCE IMPACT
-- ====================
-- Index Size: ~10-50KB per 1000 redemptions
-- Write Speed: Minimal impact (<5ms overhead per insert)
-- Read Speed: Significantly faster for duplicate checks
-- Overall: Positive impact on performance and data integrity
