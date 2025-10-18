import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

const APY_BASIS_POINTS = 1200; // 12% APY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get staking record
    const { data: staking, error } = await supabase
      .from('staking')
      .select('*')
      .eq('user_wallet', wallet)
      .single();

    if (error && error.code !== 'PGRST116') { // Not a "no rows" error
      throw error;
    }

    // Calculate pending rewards
    let pendingRewards = 0;
    if (staking && staking.staked_amount && staking.staked_amount > 0 && staking.last_stake_time) {
      const now = Date.now();
      const lastStakeTime = new Date(staking.last_stake_time).getTime();
      const timeStaked = Math.floor((now - lastStakeTime) / 1000); // seconds
      const secondsPerYear = 365 * 24 * 60 * 60;

      // rewards = (amount * APY * time) / (seconds_per_year * 10000)
      pendingRewards = Math.floor(
        (staking.staked_amount * APY_BASIS_POINTS * timeStaked) / (secondsPerYear * 10000)
      );
    }

    const totalRewards = (staking?.total_rewards_earned || 0) + pendingRewards;

    // Get cashback history
    const { data: cashbackHistory } = await supabase
      .from('cashback_transactions')
      .select('*')
      .eq('user_wallet', wallet)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get user's lifetime cashback
    const { data: user } = await supabase
      .from('users')
      .select('lifetime_cashback')
      .eq('wallet_address', wallet)
      .single();

    return NextResponse.json({
      staking: {
        stakedAmount: staking?.staked_amount || 0,
        lastStakeTime: staking?.last_stake_time || null,
        totalRewardsEarned: staking?.total_rewards_earned || 0,
        pendingRewards,
        totalRewards,
        apyBasisPoints: APY_BASIS_POINTS,
        apyPercentage: APY_BASIS_POINTS / 100,
      },
      cashback: {
        lifetimeCashback: user?.lifetime_cashback || 0,
        recentTransactions: cashbackHistory || [],
      },
    });
  } catch (error) {
    console.error('Error fetching staking info:', error);
    return NextResponse.json({ error: 'Failed to fetch staking info' }, { status: 500 });
  }
}
