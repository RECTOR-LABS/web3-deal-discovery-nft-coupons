import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';

const apiLogger = logger.child({ module: 'API:Resale:List' });

/**
 * POST /api/resale/list
 * Create a resale listing for an NFT coupon
 *
 * Request body:
 * {
 *   nft_mint: string,
 *   seller_wallet: string,
 *   price_sol: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nft_mint, seller_wallet, price_sol } = body;

    // Validation
    if (!nft_mint || !seller_wallet || !price_sol) {
      apiLogger.warn('Missing required fields', { body });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: nft_mint, seller_wallet, price_sol' },
        { status: 400 }
      );
    }

    if (price_sol <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0 SOL' },
        { status: 400 }
      );
    }

    // Check if NFT is already listed
    const { data: existingListing, error: checkError } = await supabase
      .from('resale_listings')
      .select('*')
      .eq('nft_mint', nft_mint)
      .eq('is_active', true)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      apiLogger.error('Error checking existing listing', { error: checkError });
      throw checkError;
    }

    if (existingListing) {
      return NextResponse.json(
        { success: false, error: 'This coupon is already listed for resale' },
        { status: 409 }
      );
    }

    // Create resale listing
    const { data: listing, error: insertError } = await supabase
      .from('resale_listings')
      .insert({
        nft_mint,
        seller_wallet,
        price_sol,
        is_active: true,
        listed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      apiLogger.error('Error creating resale listing', { error: insertError });
      throw insertError;
    }

    apiLogger.info('Resale listing created', {
      listingId: listing.id,
      nftMint: nft_mint,
      priceSol: price_sol,
    });

    return NextResponse.json({
      success: true,
      listing,
    });
  } catch (error) {
    apiLogger.error('Error in resale listing creation', { error });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create resale listing',
      },
      { status: 500 }
    );
  }
}
