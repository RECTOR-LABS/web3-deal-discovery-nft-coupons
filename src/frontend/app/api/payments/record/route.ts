import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

/**
 * API endpoint to record successful payments
 * Called after MoonPay payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionId,
      dealId,
      userWallet,
      amount,
      currency,
      status,
      timestamp,
    } = body;

    // Validate required fields
    if (!transactionId || !dealId || !userWallet || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if payment already recorded (prevent duplicates)
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('transaction_id', transactionId)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: 'Payment already recorded', paymentId: existing.id },
        { status: 200 }
      );
    }

    // Record payment in database
    const { data, error } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        deal_id: dealId,
        user_wallet: userWallet,
        amount,
        currency: currency || 'USDC',
        status: status || 'completed',
        payment_method: 'moonpay',
        created_at: timestamp || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to record payment' },
        { status: 500 }
      );
    }

    // TODO: Trigger NFT minting flow here
    // You can call your existing mintCoupon function or queue it

    return NextResponse.json({
      success: true,
      paymentId: data.id,
      message: 'Payment recorded successfully',
    });
  } catch (error) {
    console.error('Payment recording error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
