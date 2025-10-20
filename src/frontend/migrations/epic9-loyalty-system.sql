-- Epic 9: Loyalty System Database Migrations
-- Run this on Supabase SQL Editor

-- =======================
-- 1. Extend users table with loyalty tracking fields
-- =======================

-- Add tier and stats columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Bronze';
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_redemptions INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_upvotes INTEGER DEFAULT 0;

-- Add check constraint for valid tiers
ALTER TABLE users ADD CONSTRAINT valid_tier
  CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum'));

-- Create index on tier for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- =======================
-- 2. Extend deals table with tier requirements
-- =======================

-- Add tier requirement and exclusive flag
ALTER TABLE deals ADD COLUMN IF NOT EXISTS min_tier TEXT DEFAULT 'Bronze';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS is_exclusive BOOLEAN DEFAULT false;

-- Add check constraint for valid min_tier
ALTER TABLE deals ADD CONSTRAINT valid_min_tier
  CHECK (min_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum'));

-- Create index for exclusive deals filtering
CREATE INDEX IF NOT EXISTS idx_deals_min_tier ON deals(min_tier);
CREATE INDEX IF NOT EXISTS idx_deals_exclusive ON deals(is_exclusive);

-- =======================
-- 3. Create badges table
-- =======================

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  nft_mint_address TEXT UNIQUE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_wallet, badge_type),
  CONSTRAINT valid_badge_type CHECK (
    badge_type IN (
      'first_steps',
      'deal_hunter',
      'savvy_shopper',
      'discount_master',
      'social_butterfly',
      'influencer',
      'critic',
      'community_champion'
    )
  )
);

-- Create indexes for badge queries
CREATE INDEX IF NOT EXISTS idx_badges_user_wallet ON badges(user_wallet);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_badges_earned_at ON badges(earned_at DESC);

-- =======================
-- 4. Create helper function to increment user stats
-- =======================

CREATE OR REPLACE FUNCTION increment_user_stat(
  user_wallet TEXT,
  stat_field TEXT
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    UPDATE users
    SET %I = COALESCE(%I, 0) + 1
    WHERE wallet_address = $1
  ', stat_field, stat_field)
  USING user_wallet;
END;
$$ LANGUAGE plpgsql;

-- =======================
-- 5. Create function to automatically update tier based on redemptions
-- =======================

CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
DECLARE
  new_tier TEXT;
BEGIN
  -- Calculate tier based on total_redemptions
  IF NEW.total_redemptions >= 51 THEN
    new_tier := 'Platinum';
  ELSIF NEW.total_redemptions >= 21 THEN
    new_tier := 'Gold';
  ELSIF NEW.total_redemptions >= 6 THEN
    new_tier := 'Silver';
  ELSE
    new_tier := 'Bronze';
  END IF;

  -- Only update if tier changed (to avoid unnecessary updates)
  IF NEW.tier != new_tier THEN
    NEW.tier := new_tier;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update tier
DROP TRIGGER IF EXISTS trigger_update_user_tier ON users;
CREATE TRIGGER trigger_update_user_tier
  BEFORE UPDATE OF total_redemptions ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tier();

-- =======================
-- 6. Create view for user profiles with tier info
-- =======================

CREATE OR REPLACE VIEW user_profiles AS
SELECT
  u.wallet_address,
  u.tier,
  u.total_redemptions,
  u.total_referrals,
  u.total_reviews,
  u.total_upvotes,
  u.created_at,
  COUNT(DISTINCT b.id) as badge_count,
  COALESCE(
    json_agg(
      json_build_object(
        'id', b.id,
        'type', b.badge_type,
        'mint', b.nft_mint_address,
        'earnedAt', b.earned_at,
        'metadata', b.metadata
      ) ORDER BY b.earned_at DESC
    ) FILTER (WHERE b.id IS NOT NULL),
    '[]'::json
  ) as badges
FROM users u
LEFT JOIN badges b ON b.user_wallet = u.wallet_address
GROUP BY u.wallet_address, u.tier, u.total_redemptions, u.total_referrals,
         u.total_reviews, u.total_upvotes, u.created_at;

-- =======================
-- 7. Seed some exclusive deals for testing (optional)
-- =======================

-- Update a few existing deals to be exclusive (if deals exist)
-- UPDATE deals
-- SET min_tier = 'Gold', is_exclusive = true
-- WHERE id IN (
--   SELECT id FROM deals ORDER BY RANDOM() LIMIT 2
-- );

-- =======================
-- 8. Grant permissions (if using RLS)
-- =======================

-- Allow users to read their own tier and badges
-- ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view own badges" ON badges
--   FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- CREATE POLICY "System can insert badges" ON badges
--   FOR INSERT WITH CHECK (true);

-- =======================
-- Migration Complete
-- =======================

-- Verify tables exist
SELECT
  'Migration Complete!' as status,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM badges) as total_badges,
  (SELECT COUNT(*) FROM deals WHERE is_exclusive = true) as exclusive_deals;
