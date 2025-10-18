import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';
import { BADGE_CONFIGS, generateBadgeMetadata, checkEligibleBadges } from '@/lib/loyalty/badges';
import { BadgeType } from '@/lib/loyalty/types';

/**
 * POST /api/badges/mint
 * Mint a badge NFT for a user (called when milestone reached)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, badgeType } = body as { wallet: string; badgeType: BadgeType };

    if (!wallet || !badgeType) {
      return NextResponse.json(
        { error: 'Wallet and badge type required' },
        { status: 400 }
      );
    }

    // Validate badge type
    if (!BADGE_CONFIGS[badgeType]) {
      return NextResponse.json(
        { error: 'Invalid badge type' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if user already has this badge
    const { data: existingBadge } = await supabase
      .from('badges')
      .select('*')
      .eq('user_wallet', wallet)
      .eq('badge_type', badgeType)
      .single();

    if (existingBadge) {
      return NextResponse.json(
        { error: 'Badge already earned', badge: existingBadge },
        { status: 400 }
      );
    }

    // Get user stats to verify eligibility
    const { data: user } = await supabase
      .from('users')
      .select('total_redemptions, total_referrals, total_reviews, total_upvotes')
      .eq('wallet_address', wallet)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stats = {
      totalRedemptions: user.total_redemptions || 0,
      totalReferrals: user.total_referrals || 0,
      totalReviews: user.total_reviews || 0,
      totalUpvotes: user.total_upvotes || 0,
    };

    // Verify eligibility
    const { data: earnedBadges } = await supabase
      .from('badges')
      .select('badge_type')
      .eq('user_wallet', wallet);

    const eligibleBadges = checkEligibleBadges(stats, earnedBadges || []);

    if (!eligibleBadges.includes(badgeType)) {
      return NextResponse.json(
        { error: 'User not eligible for this badge yet' },
        { status: 403 }
      );
    }

    // Get stat value for metadata
    const badgeConfig = BADGE_CONFIGS[badgeType];
    let statValue = 0;
    switch (badgeConfig.requirement.type) {
      case 'redemptions':
        statValue = stats.totalRedemptions;
        break;
      case 'referrals':
        statValue = stats.totalReferrals;
        break;
      case 'reviews':
        statValue = stats.totalReviews;
        break;
      case 'upvotes':
        statValue = stats.totalUpvotes;
        break;
    }

    // Generate badge metadata
    const metadata = generateBadgeMetadata(badgeType, wallet, statValue);

    // TODO: Mint actual NFT on-chain
    // For MVP, we'll store in database and use mock NFT mint address
    const mockNftMint = `badge_${badgeType}_${wallet}_${Date.now()}`;

    // Store badge in database
    const { data: newBadge, error: insertError } = await supabase
      .from('badges')
      .insert({
        user_wallet: wallet,
        badge_type: badgeType,
        nft_mint_address: mockNftMint,
        metadata,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting badge:', insertError);
      return NextResponse.json(
        { error: 'Failed to mint badge' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      badge: newBadge,
      message: `Badge "${badgeConfig.name}" minted successfully!`,
    });
  } catch (error) {
    console.error('Error in POST /api/badges/mint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
