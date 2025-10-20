import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';
import { checkAndMintBadges } from '@/lib/loyalty/autoBadge';
import { distributeCashback } from '@/lib/staking/cashback';
import { Badge } from '@/lib/loyalty/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nft_mint,
      user_wallet,
      merchant_wallet,
      transaction_signature,
      deal_id,
      redeemed_at,
    } = body;

    // Validate required fields
    if (!nft_mint || !user_wallet || !merchant_wallet || !transaction_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // RACE CONDITION PROTECTION: Check if this NFT has already been redeemed
    // This prevents duplicate redemptions when two merchants scan the same QR simultaneously
    const { data: existingRedemption } = await supabase
      .from('events')
      .select('id, metadata')
      .eq('event_type', 'redemption')
      .contains('metadata', { nft_mint })
      .single();

    if (existingRedemption) {
      console.warn(`Duplicate redemption attempt for NFT: ${nft_mint}`);
      return NextResponse.json(
        {
          error: 'Coupon already redeemed',
          code: 'ALREADY_REDEEMED',
          redemption_id: existingRedemption.id,
          details: 'This coupon has already been used and cannot be redeemed again.',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // IDEMPOTENCY CHECK: Prevent duplicate submission with same transaction signature
    const { data: existingTransaction } = await supabase
      .from('events')
      .select('id')
      .eq('event_type', 'redemption')
      .contains('metadata', { transaction_signature })
      .single();

    if (existingTransaction) {
      console.warn(`Duplicate transaction signature: ${transaction_signature}`);
      return NextResponse.json(
        {
          error: 'Transaction already processed',
          code: 'DUPLICATE_TRANSACTION',
          redemption_id: existingTransaction.id,
          details: 'This transaction has already been recorded.',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Insert redemption event (protected by checks above)
    const { data, error } = await supabase
      .from('events')
      .insert({
        event_type: 'redemption',
        deal_id: deal_id || null,
        user_wallet,
        timestamp: redeemed_at || new Date().toISOString(),
        metadata: {
          nft_mint,
          merchant_wallet,
          transaction_signature,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      // Check if error is due to unique constraint violation (belt-and-suspenders approach)
      if (error.code === '23505') { // PostgreSQL unique violation code
        return NextResponse.json(
          {
            error: 'Coupon already redeemed',
            code: 'ALREADY_REDEEMED',
            details: 'This coupon has already been used.',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to record redemption event' },
        { status: 500 }
      );
    }

    // Update user tier (increment redemption count)
    try {
      await fetch(`${request.nextUrl.origin}/api/user/tier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: user_wallet,
          activity: 'redemption',
        }),
      });
    } catch (tierError) {
      console.error('Failed to update tier:', tierError);
      // Don't fail the whole request if tier update fails
    }

    // Check and mint badges (async, don't await)
    let mintedBadges: Badge[] = [];
    try {
      // Fetch updated user stats
      const { data: userData } = await supabase
        .from('users')
        .select('total_redemptions, total_referrals, total_reviews, total_upvotes, tier')
        .eq('wallet_address', user_wallet)
        .single();

      if (userData) {
        const result = await checkAndMintBadges(user_wallet, {
          totalRedemptions: userData.total_redemptions || 0,
          totalReferrals: userData.total_referrals || 0,
          totalReviews: userData.total_reviews || 0,
          totalUpvotes: userData.total_upvotes || 0,
        });
        mintedBadges = result.mintedBadges;
      }
    } catch (badgeError) {
      console.error('Failed to mint badges:', badgeError);
      // Don't fail the whole request if badge minting fails
    }

    // Distribute cashback (Epic 8)
    let cashbackAmount = 0;
    try {
      if (deal_id) {
        // Fetch deal info for cashback calculation
        const { data: dealData } = await supabase
          .from('deals')
          .select('discount_percentage, category')
          .eq('id', deal_id)
          .single();

        // Fetch user tier
        const { data: userData } = await supabase
          .from('users')
          .select('tier')
          .eq('wallet_address', user_wallet)
          .single();

        if (dealData && userData) {
          const cashbackResult = await distributeCashback({
            userWallet: user_wallet,
            dealId: deal_id,
            discountPercentage: dealData.discount_percentage || 0,
            category: dealData.category || 'Other',
            tier: userData.tier || 'Bronze',
          });

          if (cashbackResult.success) {
            cashbackAmount = cashbackResult.cashbackAmount;
          }
        }
      }
    } catch (cashbackError) {
      console.error('Failed to distribute cashback:', cashbackError);
      // Don't fail the whole request if cashback fails
    }

    return NextResponse.json({
      success: true,
      event: data,
      mintedBadges, // Include newly minted badges in response
      cashback: cashbackAmount, // Include cashback amount in response
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchant_wallet = searchParams.get('merchant_wallet');
    const user_wallet = searchParams.get('user_wallet');

    let query = supabase
      .from('events')
      .select('*')
      .eq('event_type', 'redemption')
      .order('timestamp', { ascending: false });

    if (merchant_wallet) {
      query = query.eq('metadata->>merchant_wallet', merchant_wallet);
    }

    if (user_wallet) {
      query = query.eq('user_wallet', user_wallet);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch redemptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redemptions: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
