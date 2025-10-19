import { NextRequest, NextResponse } from 'next/server';
import { createCouponPaylink } from '@/lib/payments/helio-sdk';

/**
 * API endpoint to create Helio paylink
 * Called before showing payment button
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealTitle,
      dealDescription,
      discountPercentage,
      priceUSDC,
      imageUrl,
      dealId,
      merchantWallet,
    } = body;

    // Validate required fields
    if (!dealTitle || !priceUSDC) {
      return NextResponse.json(
        { error: 'Missing required fields: dealTitle, priceUSDC' },
        { status: 400 }
      );
    }

    // Create paylink using Helio SDK
    const result = await createCouponPaylink({
      dealTitle,
      dealDescription: dealDescription || '',
      discountPercentage: discountPercentage || 0,
      priceUSDC,
      imageUrl,
      dealId,
      merchantWallet,
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paylinkId: result.paylinkId,
      paylinkUrl: result.url,
    });
  } catch (error) {
    console.error('Create paylink error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
