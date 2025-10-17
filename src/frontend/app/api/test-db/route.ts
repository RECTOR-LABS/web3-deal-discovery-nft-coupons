import { NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

export async function GET() {
  try {
    // Test connection by listing tables
    const { data: tables, error } = await supabase
      .from('merchants')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      database: {
        project: 'nft-coupon-platform',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connected: true,
        tables: ['merchants', 'deals', 'events', 'users', 'reviews', 'votes', 'resale_listings', 'referrals']
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
