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

    if (fetchError || !stake || stake.staked_amount === 0) {
      return NextResponse.json({ error: 'No stake found' }, { status: 404 });
    }

    // Calculate final rewards
    const lastStakeTime = new Date(stake.last_stake_time).getTime();
    const currentTime = Date.now();
    const timeStaked = Math.floor((currentTime - lastStakeTime) / 1000);
    const secondsPerYear = 365 * 24 * 60 * 60;

    const pendingRewards = Math.floor(
      (stake.staked_amount * APY_BASIS_POINTS * timeStaked) / (secondsPerYear * 10000)
    );

    const totalRewards = stake.total_rewards_earned + pendingRewards;
    const totalWithdrawn = stake.staked_amount + totalRewards;

    // Reset stake to 0
    const { error: updateError } = await supabase
      .from('staking')
      .update({
        staked_amount: 0,
        total_rewards_earned: 0,
        last_stake_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_wallet', wallet);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Unstaked successfully',
      unstaked: {
        principal: stake.staked_amount,
        rewards: totalRewards,
        total: totalWithdrawn,
      },
    });
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    return NextResponse.json({ error: 'Failed to unstake tokens' }, { status: 500 });
  }
}
