-- Migration: Add price field to deals table
-- Purpose: Enable paid NFT coupons (in addition to free ones)
-- Date: 2025-10-22
-- Applied via: Supabase MCP (mdxrtyqsusczmmpgspgn)

-- Add price column (nullable - NULL = free coupon)
ALTER TABLE deals
ADD COLUMN IF NOT EXISTS price NUMERIC(10, 6) DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN deals.price IS 'Price in SOL for paid coupons. NULL means free coupon.';

-- Create index for price filtering
CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(price) WHERE price IS NOT NULL;

-- Note: Using NUMERIC(10, 6) to support precise SOL amounts (up to 9999.999999 SOL)
