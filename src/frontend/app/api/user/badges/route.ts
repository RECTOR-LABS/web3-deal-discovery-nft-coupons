import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';
import { checkEligibleBadges, getNextBadges } from '@/lib/loyalty/badges';

/**
 * GET /api/user/badges?wallet=<wallet_address>
 * Get user's earned badges and eligible badges
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

    // Get user's earned badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .eq('user_wallet', wallet)
      .order('earned_at', { ascending: false });

    if (badgesError && badgesError.code !== 'PGRST116') {
      console.error('Error fetching badges:', badgesError);
      return NextResponse.json(
        { error: 'Failed to fetch badges' },
        { status: 500 }
      );
    }

    // Get user stats for eligibility checking
    const { data: user } = await supabase
      .from('users')
      .select('total_redemptions, total_referrals, total_reviews, total_upvotes')
      .eq('wallet_address', wallet)
      .single();

    const stats = {
      totalRedemptions: user?.total_redemptions || 0,
      totalReferrals: user?.total_referrals || 0,
      totalReviews: user?.total_reviews || 0,
      totalUpvotes: user?.total_upvotes || 0,
    };

    // Check for eligible badges (not yet minted)
    const eligibleBadges = checkEligibleBadges(stats, badges || []);

    // Get next badges with progress
    const nextBadges = getNextBadges(stats, badges || []);

    return NextResponse.json({
      earnedBadges: badges || [],
      eligibleBadges,
      nextBadges: nextBadges.slice(0, 3), // Top 3 closest badges
      stats,
    });
  } catch (error) {
    console.error('Error in GET /api/user/badges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
