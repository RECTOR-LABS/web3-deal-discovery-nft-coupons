import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/database/supabase';

/**
 * POST /api/deals/create
 *
 * Server-side endpoint to save NFT coupon deals to database
 * Uses service role key to bypass RLS policies
 *
 * Request body:
 * {
 *   merchant_id: string
 *   nft_mint_address: string
 *   title: string
 *   description: string
 *   image_url?: string
 *   discount_percentage: number
 *   expiry_date: string (ISO format)
 *   category: string
 *   is_active: boolean
 *   price?: number (in SOL, optional - NULL for free coupons)
 *   coupon_type: 'free' | 'paid'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'merchant_id',
      'nft_mint_address',
      'title',
      'description',
      'discount_percentage',
      'expiry_date',
      'category',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Insert deal using service role (bypasses RLS)
    const supabase = createServiceClient();
    const { data: savedDeal, error: dbError } = await supabase
      .from('deals')
      .insert({
        merchant_id: body.merchant_id,
        nft_mint_address: body.nft_mint_address,
        title: body.title,
        description: body.description,
        image_url: body.image_url || null,
        discount_percentage: body.discount_percentage,
        expiry_date: body.expiry_date,
        category: body.category,
        is_active: body.is_active !== false, // default to true
        price: body.coupon_type === 'paid' ? (body.price || null) : null, // NULL for free coupons
      })
      .select();

    if (dbError) {
      console.error('❌ Database insert error:', dbError);
      return NextResponse.json(
        {
          error: `Failed to save deal to database: ${dbError.message}`,
          details: dbError,
        },
        { status: 500 }
      );
    }

    console.log('✅ Deal saved to database via API:', savedDeal);

    return NextResponse.json(
      {
        success: true,
        deal: savedDeal?.[0],
        message: 'Deal created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create deal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
