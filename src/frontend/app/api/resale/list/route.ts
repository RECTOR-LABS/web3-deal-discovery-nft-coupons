import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID as _TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { supabase } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';
import { getConnection } from '@/lib/solana/connection';

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

    // ✅ BLOCKCHAIN VERIFICATION: Verify seller owns the NFT
    try {
      const connection = getConnection();
      const sellerPubkey = new PublicKey(seller_wallet);
      const mintPubkey = new PublicKey(nft_mint);

      // Get seller's token account for this NFT
      const tokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        sellerPubkey
      );

      // Verify the token account exists and has amount = 1 (NFT ownership)
      const accountInfo = await connection.getAccountInfo(tokenAccount);

      if (!accountInfo) {
        apiLogger.warn('Seller does not own NFT (no token account)', {
          seller_wallet,
          nft_mint,
        });
        return NextResponse.json(
          { success: false, error: 'You do not own this NFT coupon' },
          { status: 403 }
        );
      }

      // Parse token account to verify amount = 1
      const data = accountInfo.data;
      const amount = data.readBigUInt64LE(64); // Amount at offset 64

      if (amount !== BigInt(1)) {
        apiLogger.warn('Seller does not own NFT (amount != 1)', {
          seller_wallet,
          nft_mint,
          amount: amount.toString(),
        });
        return NextResponse.json(
          { success: false, error: 'You do not own this NFT coupon' },
          { status: 403 }
        );
      }

      apiLogger.info('NFT ownership verified on-chain', {
        seller_wallet,
        nft_mint,
        token_account: tokenAccount.toBase58(),
      });
    } catch (error) {
      apiLogger.error('Error verifying NFT ownership on-chain', { error });
      return NextResponse.json(
        { success: false, error: 'Failed to verify NFT ownership on blockchain' },
        { status: 500 }
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
