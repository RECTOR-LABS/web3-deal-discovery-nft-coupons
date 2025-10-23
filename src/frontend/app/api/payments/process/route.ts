import { NextRequest, NextResponse } from 'next/server';
import { Connection as _Connection, PublicKey as _PublicKey, Transaction as _Transaction, SystemProgram as _SystemProgram, LAMPORTS_PER_SOL as _LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createServiceClient } from '@/lib/database/supabase';
import { trackMetric, MetricType } from '@/lib/metrics';

/**
 * POST /api/payments/process
 *
 * Process payments for:
 * 1. Paid coupon claims (payment to merchant)
 * 2. Resale NFT purchases (payment to seller + platform fee)
 *
 * Request body:
 * {
 *   payment_type: 'coupon_claim' | 'resale_purchase'
 *   buyer_wallet: string
 *   amount_sol: number
 *
 *   // For coupon_claim:
 *   deal_id: string
 *   merchant_wallet: string
 *
 *   // For resale_purchase:
 *   resale_listing_id: string
 *   seller_wallet: string
 *   nft_mint_address: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_type, buyer_wallet, amount_sol } = body;

    // Validate required fields
    if (!payment_type || !buyer_wallet || !amount_sol) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    if (payment_type === 'coupon_claim') {
      // Handle paid coupon claim
      const { deal_id, merchant_wallet } = body;

      if (!deal_id || !merchant_wallet) {
        return NextResponse.json(
          { error: 'Missing deal_id or merchant_wallet' },
          { status: 400 }
        );
      }

      // Verify deal exists and is paid
      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', deal_id)
        .single();

      if (dealError || !deal) {
        return NextResponse.json(
          { error: 'Deal not found' },
          { status: 404 }
        );
      }

      if (!deal.price || Number(deal.price) === 0) {
        return NextResponse.json(
          { error: 'This is a free coupon, no payment required' },
          { status: 400 }
        );
      }

      // Create payment transaction instruction
      // Platform fee: 2.5%
      const PLATFORM_FEE_PERCENTAGE = 0.025;
      const platformFee = amount_sol * PLATFORM_FEE_PERCENTAGE;
      const merchantAmount = amount_sol - platformFee;

      // Record payment in database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          buyer_wallet,
          seller_wallet: merchant_wallet,
          amount_sol,
          platform_fee_sol: platformFee,
          payment_type: 'coupon_claim',
          deal_id,
          status: 'pending',
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment insert error:', paymentError);
        return NextResponse.json(
          { error: 'Failed to create payment record' },
          { status: 500 }
        );
      }

      // Track metric
      trackMetric(MetricType.PAYMENT_COMPLETED, 1, {
        payment_type: 'coupon_claim',
        amount_sol: amount_sol.toString(),
      });

      return NextResponse.json({
        success: true,
        payment_id: payment.id,
        merchant_amount: merchantAmount,
        platform_fee: platformFee,
        message: 'Payment initiated. Complete transaction in your wallet.',
      });

    } else if (payment_type === 'resale_purchase') {
      // Handle resale NFT purchase
      const { resale_listing_id, seller_wallet, nft_mint_address } = body;

      if (!resale_listing_id || !seller_wallet || !nft_mint_address) {
        return NextResponse.json(
          { error: 'Missing resale purchase fields' },
          { status: 400 }
        );
      }

      // Verify listing exists and is active
      const { data: listing, error: listingError } = await supabase
        .from('resale_listings')
        .select('*')
        .eq('id', resale_listing_id)
        .eq('status', 'active')
        .single();

      if (listingError || !listing) {
        return NextResponse.json(
          { error: 'Listing not found or no longer available' },
          { status: 404 }
        );
      }

      // Platform fee: 2.5%
      const PLATFORM_FEE_PERCENTAGE = 0.025;
      const platformFee = amount_sol * PLATFORM_FEE_PERCENTAGE;
      const sellerAmount = amount_sol - platformFee;

      // Record payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          buyer_wallet,
          seller_wallet,
          amount_sol,
          platform_fee_sol: platformFee,
          payment_type: 'resale_purchase',
          resale_listing_id,
          nft_mint_address,
          status: 'pending',
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment insert error:', paymentError);
        return NextResponse.json(
          { error: 'Failed to create payment record' },
          { status: 500 }
        );
      }

      // Update listing to inactive (pending transfer)
      await supabase
        .from('resale_listings')
        .update({ is_active: false })
        .eq('id', resale_listing_id);

      // Track metric
      trackMetric(MetricType.PAYMENT_COMPLETED, 1, {
        payment_type: 'resale_purchase',
        amount_sol: amount_sol.toString(),
      });

      return NextResponse.json({
        success: true,
        payment_id: payment.id,
        seller_amount: sellerAmount,
        platform_fee: platformFee,
        nft_mint_address,
        message: 'Payment initiated. NFT will be transferred after confirmation.',
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid payment_type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
