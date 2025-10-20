import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

const APY_BASIS_POINTS = 1200; // 12% APY

export async function POST(request: NextRequest) {
  try {
    const { wallet, amount } = await request.json();

    if (!wallet || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid wallet or amount' }, { status: 400 });
    }

    const supabase = createClient();

    // Get existing staking record
    const { data: existingStake } = await supabase
      .from('staking')
      .select('*')
      .eq('user_wallet', wallet)
      .single();

    const now = new Date().toISOString();

    if (existingStake) {
      // Calculate pending rewards before adding new stake
      let pendingRewards = 0;
      const currentStaked = existingStake.staked_amount ?? 0;
      const currentRewards = existingStake.total_rewards_earned ?? 0;

      if (currentStaked > 0 && existingStake.last_stake_time) {
        const lastStakeTime = new Date(existingStake.last_stake_time).getTime();
        const currentTime = Date.now();
        const timeStaked = Math.floor((currentTime - lastStakeTime) / 1000);
        const secondsPerYear = 365 * 24 * 60 * 60;

        pendingRewards = Math.floor(
          (currentStaked * APY_BASIS_POINTS * timeStaked) / (secondsPerYear * 10000)
        );
      }

      // Update existing stake
      const { data: updatedStake, error } = await supabase
        .from('staking')
        .update({
          staked_amount: currentStaked + amount,
          last_stake_time: now,
          total_rewards_earned: currentRewards + pendingRewards,
          updated_at: now,
        })
        .eq('user_wallet', wallet)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Staked ${amount / 1e9} DEAL tokens`,
        stake: updatedStake,
      });
    } else {
      // Create new staking record
      const { data: newStake, error } = await supabase
        .from('staking')
        .insert({
          user_wallet: wallet,
          staked_amount: amount,
          last_stake_time: now,
          total_rewards_earned: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Staked ${amount / 1e9} DEAL tokens`,
        stake: newStake,
      });
    }
  } catch (error) {
    console.error('Error staking tokens:', error);
    return NextResponse.json({ error: 'Failed to stake tokens' }, { status: 500 });
  }
}
