import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

const APY_BASIS_POINTS = 1200; // 12% APY

export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json();

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get staking record
    const { data: stake, error: fetchError } = await supabase
      .from('staking')
      .select('*')
      .eq('user_wallet', wallet)
      .single();

    const stakedAmount = stake?.staked_amount ?? 0;
    const totalRewardsEarned = stake?.total_rewards_earned ?? 0;

    if (fetchError || !stake || stakedAmount === 0) {
      return NextResponse.json({ error: 'No stake found' }, { status: 404 });
    }

    // Calculate pending rewards
    let pendingRewards = 0;
    if (stake.last_stake_time) {
      const lastStakeTime = new Date(stake.last_stake_time).getTime();
      const currentTime = Date.now();
      const timeStaked = Math.floor((currentTime - lastStakeTime) / 1000);
      const secondsPerYear = 365 * 24 * 60 * 60;

      pendingRewards = Math.floor(
        (stakedAmount * APY_BASIS_POINTS * timeStaked) / (secondsPerYear * 10000)
      );
    }

    const totalRewards = totalRewardsEarned + pendingRewards;

    if (totalRewards === 0) {
      return NextResponse.json({ error: 'No rewards to claim' }, { status: 400 });
    }

    // Claim rewards (reset accumulated rewards, update timestamp)
    const { error: updateError } = await supabase
      .from('staking')
      .update({
        total_rewards_earned: 0,
        last_stake_time: new Date().toISOString(), // Reset timer
        updated_at: new Date().toISOString(),
      })
      .eq('user_wallet', wallet);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Claimed ${totalRewards / 1e9} DEAL rewards`,
      rewards: totalRewards,
    });
  } catch (error) {
    console.error('Error claiming rewards:', error);
    return NextResponse.json({ error: 'Failed to claim rewards' }, { status: 500 });
  }
}
