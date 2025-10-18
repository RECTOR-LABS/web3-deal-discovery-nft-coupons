import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';
import { getUserTierInfo } from '@/lib/loyalty/tiers';

/**
 * GET /api/user/tier?wallet=<wallet_address>
 * Get user's tier information and progress
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user stats from database
    const { data: user, error } = await supabase
      .from('users')
      .select('wallet_address, tier, total_redemptions, total_referrals, total_reviews, total_upvotes')
      .eq('wallet_address', wallet)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching user tier:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user tier' },
        { status: 500 }
      );
    }

    // If user doesn't exist, return default Bronze tier
    if (!user) {
      const defaultTierInfo = getUserTierInfo(0);
      return NextResponse.json({
        tierInfo: defaultTierInfo,
        stats: {
          totalRedemptions: 0,
          totalReferrals: 0,
          totalReviews: 0,
          totalUpvotes: 0,
        },
      });
    }

    // Calculate tier info based on total redemptions
    const tierInfo = getUserTierInfo(user.total_redemptions || 0);

    return NextResponse.json({
      tierInfo,
      stats: {
        totalRedemptions: user.total_redemptions || 0,
        totalReferrals: user.total_referrals || 0,
        totalReviews: user.total_reviews || 0,
        totalUpvotes: user.total_upvotes || 0,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/user/tier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/tier
 * Update user's tier based on activity (called internally after redemptions/reviews/etc)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, activity } = body;

    if (!wallet || !activity) {
      return NextResponse.json(
        { error: 'Wallet and activity type required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Increment the appropriate counter
    let updateField = '';
    switch (activity) {
      case 'redemption':
        updateField = 'total_redemptions';
        break;
      case 'referral':
        updateField = 'total_referrals';
        break;
      case 'review':
        updateField = 'total_reviews';
        break;
      case 'upvote':
        updateField = 'total_upvotes';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid activity type' },
          { status: 400 }
        );
    }

    // Upsert user stats (create if doesn't exist, update if exists)
    const { data: user, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          wallet_address: wallet,
          [updateField]: 1,
        },
        {
          onConflict: 'wallet_address',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (upsertError) {
      // If user exists, increment the counter
      const { error: updateError } = await supabase.rpc('increment_user_stat', {
        user_wallet: wallet,
        stat_field: updateField,
      });

      if (updateError) {
        console.error('Error updating user stats:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user stats' },
          { status: 500 }
        );
      }
    }

    // Fetch updated user data
    const { data: updatedUser } = await supabase
      .from('users')
      .select('total_redemptions')
      .eq('wallet_address', wallet)
      .single();

    // Calculate new tier
    const newTierInfo = getUserTierInfo(updatedUser?.total_redemptions || 0);

    return NextResponse.json({
      success: true,
      tierInfo: newTierInfo,
    });
  } catch (error) {
    console.error('Error in POST /api/user/tier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
