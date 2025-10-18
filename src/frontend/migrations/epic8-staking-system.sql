-- Epic 8: Staking & Cashback System Database Migrations
-- Run this on Supabase SQL Editor

-- =======================
-- 1. Create staking table
-- =======================

CREATE TABLE IF NOT EXISTS staking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet TEXT NOT NULL,
  staked_amount BIGINT DEFAULT 0, -- Amount of DEAL tokens staked (in lamports, 9 decimals)
  last_stake_time TIMESTAMPTZ DEFAULT NOW(),
  total_rewards_earned BIGINT DEFAULT 0, -- Lifetime rewards earned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_wallet)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_staking_user_wallet ON staking(user_wallet);
CREATE INDEX IF NOT EXISTS idx_staking_amount ON staking(staked_amount DESC);

-- =======================
-- 2. Create cashback_transactions table
-- =======================

CREATE TABLE IF NOT EXISTS cashback_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet TEXT NOT NULL,
  deal_id UUID REFERENCES deals(id),
  cashback_amount BIGINT NOT NULL, -- DEAL tokens earned
  tier TEXT NOT NULL, -- User's tier at time of redemption
  cashback_rate INTEGER NOT NULL, -- Rate used (5, 8, 12, or 15)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cashback_user_wallet ON cashback_transactions(user_wallet);
CREATE INDEX IF NOT EXISTS idx_cashback_deal_id ON cashback_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_cashback_created_at ON cashback_transactions(created_at DESC);

-- =======================
-- 3. Add lifetime_cashback to users table
-- =======================

ALTER TABLE users ADD COLUMN IF NOT EXISTS lifetime_cashback BIGINT DEFAULT 0;

-- Create index for lifetime cashback leaderboard
CREATE INDEX IF NOT EXISTS idx_users_lifetime_cashback ON users(lifetime_cashback DESC);

-- =======================
-- 4. Create function to calculate pending rewards
-- =======================

CREATE OR REPLACE FUNCTION calculate_staking_rewards(
  user_wallet_address TEXT
)
RETURNS BIGINT AS $$
DECLARE
  stake_record RECORD;
  time_staked BIGINT;
  annual_seconds BIGINT := 365 * 24 * 60 * 60;
  apy_basis_points INTEGER := 1200; -- 12% APY
  pending_rewards BIGINT;
BEGIN
  -- Get user's staking record
  SELECT * INTO stake_record FROM staking WHERE user_wallet = user_wallet_address;

  -- If no stake, return 0
  IF stake_record IS NULL OR stake_record.staked_amount = 0 THEN
    RETURN 0;
  END IF;

  -- Calculate time staked in seconds
  time_staked := EXTRACT(EPOCH FROM (NOW() - stake_record.last_stake_time))::BIGINT;

  -- Calculate rewards: (amount * APY * time) / (seconds_per_year * 10000)
  pending_rewards := (stake_record.staked_amount::BIGINT * apy_basis_points * time_staked) / (annual_seconds * 10000);

  RETURN pending_rewards + COALESCE(stake_record.total_rewards_earned, 0);
END;
$$ LANGUAGE plpgsql;

-- =======================
-- 5. Create staking history view
-- =======================

CREATE OR REPLACE VIEW staking_leaderboard AS
SELECT
  s.user_wallet,
  u.tier,
  s.staked_amount,
  s.total_rewards_earned,
  calculate_staking_rewards(s.user_wallet) as current_rewards,
  s.last_stake_time,
  u.lifetime_cashback,
  RANK() OVER (ORDER BY s.staked_amount DESC) as stake_rank
FROM staking s
LEFT JOIN users u ON u.wallet_address = s.user_wallet
WHERE s.staked_amount > 0
ORDER BY s.staked_amount DESC;

-- =======================
-- 6. Create function to auto-update staking timestamp
-- =======================

CREATE OR REPLACE FUNCTION update_staking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-timestamp update
DROP TRIGGER IF EXISTS trigger_update_staking_timestamp ON staking;
CREATE TRIGGER trigger_update_staking_timestamp
  BEFORE UPDATE ON staking
  FOR EACH ROW
  EXECUTE FUNCTION update_staking_timestamp();

-- =======================
-- 7. Seed test data (optional - for demo)
-- =======================

-- Insert sample staking data for testing
-- INSERT INTO staking (user_wallet, staked_amount, last_stake_time, total_rewards_earned)
-- VALUES
--   ('TestWallet1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1000000000000, NOW() - INTERVAL '30 days', 10000000000),
--   ('TestWallet2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 500000000000, NOW() - INTERVAL '15 days', 3000000000),
--   ('TestWallet3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 2500000000000, NOW() - INTERVAL '60 days', 50000000000);

-- =======================
-- Migration Complete
-- =======================

-- Verify tables exist
SELECT
  'Migration Complete!' as status,
  (SELECT COUNT(*) FROM staking) as total_stakers,
  (SELECT COUNT(*) FROM cashback_transactions) as total_cashback_txns,
  (SELECT SUM(staked_amount) FROM staking) as total_staked_deal;
