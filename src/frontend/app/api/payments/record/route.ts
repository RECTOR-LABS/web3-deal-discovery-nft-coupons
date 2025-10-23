import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';
import { trackMetric, MetricType } from '@/lib/metrics';

const apiLogger = logger.child({ module: 'API:Payments:Record' });

/**
 * API endpoint to record successful payments
 * Supports both MoonPay (legacy) and direct SOL payments (new)
 * Called after payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionId, // MoonPay transaction ID (legacy)
      transactionSignature, // Solana transaction signature (new)
      dealId,
      userWallet,
      amount,
      currency,
      status,
      timestamp,
      paymentType = 'direct_purchase',
    } = body;

    // Validate required fields (accept either transactionId or transactionSignature)
    const txId = transactionSignature || transactionId;
    if (!txId || !dealId || !userWallet || !amount) {
      apiLogger.warn('Missing required fields', { body });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch deal to verify price (for paid coupons)
    const { data: deal } = await supabase
      .from('deals')
      .select('price, merchant_id, title')
      .eq('id', dealId)
      .single();

    if (deal?.price && Math.abs(amount - deal.price) > 0.001) {
      apiLogger.warn('Payment amount mismatch', {
        dealId,
        expected: deal.price,
        received: amount,
      });
    }

    // Note: 'payments' table doesn't exist in current schema
    // Using 'events' table to log payment events instead
    // TODO: Create payments table if needed for production

    // Check if payment already recorded (prevent duplicates)
    const searchField = transactionSignature ? 'transaction_signature' : 'transaction_id';
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('event_type', 'purchase')
      .eq('user_wallet', userWallet)
      .eq('deal_id', dealId)
      .contains('metadata', { [searchField]: txId })
      .maybeSingle();

    if (existing) {
      apiLogger.info('Payment already recorded', { paymentId: existing.id });
      return NextResponse.json(
        { message: 'Payment already recorded', paymentId: existing.id },
        { status: 200 }
      );
    }

    // Determine event type and payment method
    const eventType = 'purchase'; // Using standard 'purchase' event type for both paid and free
    const paymentMethod = transactionSignature ? 'solana_direct' : 'moonpay';

    // Record payment event in database
    const { data, error } = await supabase
      .from('events')
      .insert({
        event_type: eventType,
        deal_id: dealId,
        user_wallet: userWallet,
        metadata: {
          [searchField]: txId,
          amount_sol: amount,
          currency: currency || 'SOL',
          status: status || 'completed',
          payment_method: paymentMethod,
          payment_type: paymentType,
          merchant_id: deal?.merchant_id,
          timestamp: timestamp || new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) {
      apiLogger.error('Database error', { error });
      console.error('[Payment API] Database error details:', error);
      return NextResponse.json(
        {
          error: 'Failed to record payment',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Track metric
    trackMetric(MetricType.PAYMENT_COMPLETED, 1, {
      amount_sol: amount.toString(),
      payment_method: paymentMethod,
      payment_type: paymentType,
    });

    // TODO: Trigger NFT minting flow here
    // For paid coupons, NFT should be minted and transferred to buyer
    // You can call your existing mintCoupon function or queue it

    apiLogger.info('Payment recorded successfully', {
      paymentId: data.id,
      dealId,
      userWallet,
      amount,
      txId,
    });

    return NextResponse.json({
      success: true,
      paymentId: data.id,
      message: 'Payment recorded successfully',
    });
  } catch (error) {
    apiLogger.error('Payment recording error', { error });
    trackMetric(MetricType.ERROR_PAYMENT_FAILED, 1);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
