import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';

const apiLogger = logger.child({ module: 'API:Resale:Listings' });

/**
 * GET /api/resale/listings
 * Fetch all active resale listings with deal information
 *
 * Query params:
 * - category?: string (filter by category)
 * - min_price?: number (minimum price in SOL)
 * - max_price?: number (maximum price in SOL)
 * - sort?: 'newest' | 'price_asc' | 'price_desc' | 'discount_desc'
 * - limit?: number (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query - fetch resale listings
    let query = supabase
      .from('resale_listings')
      .select('*')
      .eq('is_active', true)
      .limit(limit);

    // Price filters
    if (minPrice) {
      query = query.gte('price_sol', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price_sol', parseFloat(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price_sol', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price_sol', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('listed_at', { ascending: false });
        break;
    }

    const { data: listings, error: listingsError } = await query;

    if (listingsError) {
      apiLogger.error('Error fetching resale listings', { error: listingsError });
      throw listingsError;
    }

    if (!listings || listings.length === 0) {
      return NextResponse.json({
        success: true,
        listings: [],
      });
    }

    // Fetch deal information for each NFT mint
    const nftMints = listings.map((l) => l.nft_mint);
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select(`
        *,
        merchants (
          business_name,
          city,
          state,
          latitude,
          longitude
        )
      `)
      .in('nft_mint_address', nftMints);

    if (dealsError) {
      apiLogger.error('Error fetching deals for resale listings', { error: dealsError });
      throw dealsError;
    }

    // Merge listings with deal data
    const listingsWithDeals = listings.map((listing) => {
      const deal = deals?.find((d) => d.nft_mint_address === listing.nft_mint);
      return {
        ...listing,
        deal: deal || null,
      };
    });

    // Apply category filter if provided (after joining with deals)
    let filteredListings = listingsWithDeals;
    if (category && category !== 'All') {
      filteredListings = listingsWithDeals.filter(
        (listing) => listing.deal?.category === category
      );
    }

    // Apply discount-based sorting if requested
    if (sort === 'discount_desc') {
      filteredListings.sort((a, b) => {
        const aDiscount = a.deal?.discount_percentage || 0;
        const bDiscount = b.deal?.discount_percentage || 0;
        return bDiscount - aDiscount;
      });
    }

    apiLogger.info('Resale listings fetched', {
      count: filteredListings.length,
      filters: { category, minPrice, maxPrice, sort },
    });

    return NextResponse.json({
      success: true,
      listings: filteredListings,
      count: filteredListings.length,
    });
  } catch (error) {
    apiLogger.error('Error fetching resale listings', { error });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch resale listings',
      },
      { status: 500 }
    );
  }
}
