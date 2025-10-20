-- Row-Level Security (RLS) Policies
-- Date: 2025-10-20
-- Purpose: Secure multi-tenant data access with Supabase RLS

-- ====================
-- ENABLE RLS ON ALL TABLES
-- ====================

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resale_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- ====================
-- MERCHANTS TABLE POLICIES
-- ====================

-- Public read access to active merchants
CREATE POLICY "Public can view active merchants"
ON merchants FOR SELECT
TO anon, authenticated
USING (status = 'active');

-- Merchants can view their own data (including pending/suspended)
CREATE POLICY "Merchants can view own data"
ON merchants FOR SELECT
TO authenticated
USING (wallet_address = auth.jwt() ->> 'wallet_address');

-- Merchants can insert their own profile
CREATE POLICY "Merchants can register"
ON merchants FOR INSERT
TO authenticated
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- Merchants can update their own profile
CREATE POLICY "Merchants can update own profile"
ON merchants FOR UPDATE
TO authenticated
USING (wallet_address = auth.jwt() ->> 'wallet_address')
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- ====================
-- DEALS TABLE POLICIES
-- ====================

-- Public read access to active, non-expired deals
CREATE POLICY "Public can view active deals"
ON deals FOR SELECT
TO anon, authenticated
USING (
  status = 'active' AND
  expiry_date > NOW()
);

-- Merchants can view all their own deals (including inactive/expired)
CREATE POLICY "Merchants can view own deals"
ON deals FOR SELECT
TO authenticated
USING (
  merchant_id IN (
    SELECT id FROM merchants WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  )
);

-- Merchants can create deals
CREATE POLICY "Merchants can create deals"
ON deals FOR INSERT
TO authenticated
WITH CHECK (
  merchant_id IN (
    SELECT id FROM merchants WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  )
);

-- Merchants can update their own deals
CREATE POLICY "Merchants can update own deals"
ON deals FOR UPDATE
TO authenticated
USING (
  merchant_id IN (
    SELECT id FROM merchants WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  )
)
WITH CHECK (
  merchant_id IN (
    SELECT id FROM merchants WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  )
);

-- ====================
-- EVENTS TABLE POLICIES
-- ====================

-- Public read access (for transparency)
CREATE POLICY "Public can view events"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can create events (logged via service role)
CREATE POLICY "Authenticated users can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

-- ====================
-- USERS TABLE POLICIES
-- ====================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (wallet_address = auth.jwt() ->> 'wallet_address');

-- Users can insert their own profile
CREATE POLICY "Users can register"
ON users FOR INSERT
TO authenticated
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (wallet_address = auth.jwt() ->> 'wallet_address')
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- ====================
-- REVIEWS TABLE POLICIES
-- ====================

-- Public read access to reviews
CREATE POLICY "Public can view reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address')
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address');

-- ====================
-- VOTES TABLE POLICIES
-- ====================

-- Public read access to vote counts
CREATE POLICY "Public can view votes"
ON votes FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can vote
CREATE POLICY "Authenticated users can vote"
ON votes FOR INSERT
TO authenticated
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
ON votes FOR UPDATE
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address')
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes"
ON votes FOR DELETE
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address');

-- ====================
-- RESALE LISTINGS TABLE POLICIES
-- ====================

-- Public read access to active listings
CREATE POLICY "Public can view active resale listings"
ON resale_listings FOR SELECT
TO anon, authenticated
USING (status = 'active');

-- Sellers can view their own listings
CREATE POLICY "Sellers can view own listings"
ON resale_listings FOR SELECT
TO authenticated
USING (seller_wallet = auth.jwt() ->> 'wallet_address');

-- Sellers can create listings
CREATE POLICY "Sellers can create listings"
ON resale_listings FOR INSERT
TO authenticated
WITH CHECK (seller_wallet = auth.jwt() ->> 'wallet_address');

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings"
ON resale_listings FOR UPDATE
TO authenticated
USING (seller_wallet = auth.jwt() ->> 'wallet_address')
WITH CHECK (seller_wallet = auth.jwt() ->> 'wallet_address');

-- ====================
-- REFERRALS TABLE POLICIES
-- ====================

-- Users can view their own referrals (as referrer)
CREATE POLICY "Referrers can view own referrals"
ON referrals FOR SELECT
TO authenticated
USING (referrer_wallet = auth.jwt() ->> 'wallet_address');

-- Authenticated users can create referrals
CREATE POLICY "Authenticated users can create referrals"
ON referrals FOR INSERT
TO authenticated
WITH CHECK (referred_wallet = auth.jwt() ->> 'wallet_address');

-- ====================
-- STAKING TABLE POLICIES
-- ====================

-- Users can view their own stakes
CREATE POLICY "Users can view own stakes"
ON staking FOR SELECT
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can create stakes
CREATE POLICY "Users can create stakes"
ON staking FOR INSERT
TO authenticated
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- Users can update their own stakes
CREATE POLICY "Users can update own stakes"
ON staking FOR UPDATE
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address')
WITH CHECK (user_wallet = auth.jwt() ->> 'wallet_address');

-- ====================
-- CASHBACK TRANSACTIONS TABLE POLICIES
-- ====================

-- Users can view their own cashback transactions
CREATE POLICY "Users can view own cashback"
ON cashback_transactions FOR SELECT
TO authenticated
USING (user_wallet = auth.jwt() ->> 'wallet_address');

-- System can create cashback transactions (via service role)
-- Users cannot create cashback directly (only via backend logic)

-- ====================
-- BADGES TABLE POLICIES
-- ====================

-- Public can view badges (gamification transparency)
CREATE POLICY "Public can view badges"
ON badges FOR SELECT
TO anon, authenticated
USING (true);

-- System can create badges (via service role)
-- Users cannot create badges directly (only via backend logic)

-- ====================
-- NOTES ON AUTHENTICATION
-- ====================

-- This RLS setup assumes Supabase Auth with custom JWT claims:
-- - auth.jwt() ->> 'wallet_address' returns the user's Solana wallet address
--
-- To set custom claims in Supabase, use a database function:
--
-- CREATE OR REPLACE FUNCTION auth.jwt()
-- RETURNS jsonb
-- LANGUAGE sql STABLE
-- AS $$
--   SELECT raw_app_meta_data FROM auth.users WHERE id = auth.uid();
-- $$;
--
-- Then store wallet_address in raw_app_meta_data during user creation.
--
-- Alternative: Use auth.uid() if mapping users table to auth.users by ID

-- ====================
-- TESTING RLS POLICIES
-- ====================

-- Test as anonymous user:
-- SET ROLE anon;
-- SELECT * FROM deals; -- Should only see active deals
--
-- Test as authenticated user:
-- SET ROLE authenticated;
-- SET request.jwt.claims TO '{"wallet_address": "7xYz..."}';
-- SELECT * FROM deals; -- Should see active deals + own deals
--
-- Reset:
-- RESET ROLE;
