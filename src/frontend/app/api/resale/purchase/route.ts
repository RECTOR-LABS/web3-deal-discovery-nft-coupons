import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';
import { trackMetric, MetricType } from '@/lib/metrics';

const apiLogger = logger.child({ module: 'API:Resale:Purchase' });

// Platform marketplace fee (2.5%)
const MARKETPLACE_FEE_PERCENTAGE = 0.025;

/**
 * POST /api/resale/purchase
 * Purchase a resale listing
 *
 * Request body:
 * {
 *   listing_id: string,
 *   buyer_wallet: string,
 *   transaction_signature: string // Solana transaction signature for payment + NFT transfer
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_wallet, transaction_signature } = body;

    // Validation
    if (!listing_id || !buyer_wallet || !transaction_signature) {
      apiLogger.warn('Missing required fields', { body });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: listing_id, buyer_wallet, transaction_signature',
        },
        { status: 400 }
      );
    }

    // Fetch the listing
    const { data: listing, error: listingError } = await supabase
      .from('resale_listings')
      .select('*')
      .eq('id', listing_id)
      .eq('is_active', true)
      .single();

    if (listingError || !listing) {
      apiLogger.warn('Listing not found or inactive', { listingId: listing_id });
      return NextResponse.json(
        { success: false, error: 'Listing not found or no longer available' },
        { status: 404 }
      );
    }

    // Prevent self-purchase
    if (listing.seller_wallet === buyer_wallet) {
      return NextResponse.json(
        { success: false, error: 'Cannot purchase your own listing' },
        { status: 400 }
      );
    }

    // Calculate marketplace fee
    const totalPrice = listing.price_sol || 0;
    const marketplaceFee = totalPrice * MARKETPLACE_FEE_PERCENTAGE;
    const sellerProceeds = totalPrice - marketplaceFee;

    // Mark listing as sold (inactive)
    const { error: updateError } = await supabase
      .from('resale_listings')
      .update({ is_active: false })
      .eq('id', listing_id);

    if (updateError) {
      apiLogger.error('Error updating listing status', { error: updateError });
      throw updateError;
    }

    // Log the resale transaction in events table
    const { error: eventError } = await supabase.from('events').insert({
      event_type: 'resale_purchase',
      user_wallet: buyer_wallet,
      nft_mint: listing.nft_mint,
      metadata: {
        listing_id,
        seller_wallet: listing.seller_wallet,
        price_sol: totalPrice,
        marketplace_fee: marketplaceFee,
        seller_proceeds: sellerProceeds,
        transaction_signature,
      },
    });

    if (eventError) {
      apiLogger.warn('Failed to log resale event', { error: eventError });
      // Non-critical, continue
    }

    // Track metric
    trackMetric(MetricType.NFT_TRANSFER, 1, {
      price_sol: totalPrice.toString(),
      marketplace_fee: marketplaceFee.toString(),
      event_type: 'resale_purchase',
    });

    apiLogger.info('Resale purchase completed', {
      listingId: listing_id,
      buyer: buyer_wallet,
      seller: listing.seller_wallet,
      price: totalPrice,
      fee: marketplaceFee,
      sellerProceeds,
      txSignature: transaction_signature,
    });

    return NextResponse.json({
      success: true,
      purchase: {
        listing_id,
        nft_mint: listing.nft_mint,
        buyer_wallet,
        seller_wallet: listing.seller_wallet,
        price_sol: totalPrice,
        marketplace_fee: marketplaceFee,
        seller_proceeds: sellerProceeds,
        transaction_signature,
      },
    });
  } catch (error) {
    apiLogger.error('Error processing resale purchase', { error });
    trackMetric(MetricType.ERROR_PAYMENT_FAILED, 1, {
      error_type: 'resale_purchase_failed',
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process resale purchase',
      },
      { status: 500 }
    );
  }
}
