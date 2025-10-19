import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// Referral data types for grouping
interface ReferralItem {
  id: string;
  referee_wallet: string;
  claimed_at: string | null;
}

interface DealReferralGroup {
  deal_id: string;
  deal_title: string;
  discount_percentage: number;
  image_url: string | null;
  count: number;
  referrals: ReferralItem[];
}

type ReferralsByDealAccumulator = Record<string, DealReferralGroup>;

// POST - Record a referral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deal_id, referrer_wallet, referee_wallet } = body;

    // Validate required fields
    if (!deal_id || !referrer_wallet || !referee_wallet) {
      return NextResponse.json(
        { error: 'Missing required fields: deal_id, referrer_wallet, referee_wallet' },
        { status: 400 }
      );
    }

    // Prevent self-referral
    if (referrer_wallet === referee_wallet) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    // Check if this user already claimed this deal via a referral
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('deal_id', deal_id)
      .eq('referee_wallet', referee_wallet)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Referral already recorded for this deal and user' },
        { status: 400 }
      );
    }

    // Insert referral record
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        deal_id,
        referrer_wallet,
        referee_wallet,
        claimed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating referral:', error);
      return NextResponse.json(
        { error: 'Failed to record referral' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referral: data,
      message: 'Referral recorded successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch referral stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_wallet = searchParams.get('user_wallet');

    if (!user_wallet) {
      return NextResponse.json(
        { error: 'Missing required parameter: user_wallet' },
        { status: 400 }
      );
    }

    // Fetch all referrals where this user is the referrer
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        id,
        deal_id,
        referee_wallet,
        claimed_at,
        deals (
          title,
          discount_percentage,
          image_url
        )
      `)
      .eq('referrer_wallet', user_wallet)
      .order('claimed_at', { ascending: false });

    if (referralsError) {
      console.error('Database error fetching referrals:', referralsError);
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500 }
      );
    }

    // Calculate stats
    const totalReferrals = referrals?.length || 0;
    const uniqueDeals = new Set(referrals?.map(r => r.deal_id).filter(Boolean) || []).size;
    const uniqueUsers = new Set(referrals?.map(r => r.referee_wallet) || []).size;

    // Group referrals by deal (filter out referrals without deal_id)
    const referralsByDeal = (referrals || [])
      .filter(referral => referral.deal_id !== null)
      .reduce((acc: ReferralsByDealAccumulator, referral) => {
        const dealId = referral.deal_id as string; // Now guaranteed to be non-null
        if (!acc[dealId]) {
          acc[dealId] = {
            deal_id: dealId,
            deal_title: referral.deals?.title || 'Unknown Deal',
            discount_percentage: referral.deals?.discount_percentage || 0,
            image_url: referral.deals?.image_url || null,
            count: 0,
            referrals: [],
          };
        }
        acc[dealId].count += 1;
        acc[dealId].referrals.push({
          id: referral.id,
          referee_wallet: referral.referee_wallet,
          claimed_at: referral.claimed_at,
        });
        return acc;
      }, {});

    const dealBreakdown = Object.values(referralsByDeal);

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals,
        uniqueDeals,
        uniqueUsers,
      },
      referrals: referrals || [],
      dealBreakdown,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
