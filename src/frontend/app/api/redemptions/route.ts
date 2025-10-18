import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

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

    // Insert redemption event
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
      return NextResponse.json(
        { error: 'Failed to record redemption event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: data,
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
