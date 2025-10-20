import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

/**
 * POST /api/merchant/register
 * Register a new merchant account
 *
 * Body:
 * {
 *   walletAddress: string;
 *   businessName: string;
 *   description?: string;
 *   logoUrl?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, businessName, description, logoUrl } = body;

    // Validation
    if (!walletAddress || !businessName) {
      return NextResponse.json(
        { error: 'Wallet address and business name are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if merchant already exists
    const { data: existingMerchant } = await supabase
      .from('merchants')
      .select('id, wallet_address, business_name')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingMerchant) {
      return NextResponse.json(
        {
          error: 'Merchant already registered',
          merchant: existingMerchant,
        },
        { status: 409 }
      );
    }

    // Create merchant account
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .insert({
        wallet_address: walletAddress,
        business_name: businessName,
        description: description || null,
        logo_url: logoUrl || null,
      })
      .select()
      .single();

    if (merchantError) {
      console.error('Error creating merchant:', merchantError);
      return NextResponse.json(
        { error: 'Failed to create merchant account' },
        { status: 500 }
      );
    }

    // Create or update user with merchant role
    const { error: userError } = await supabase
      .from('users')
      .upsert(
        {
          wallet_address: walletAddress,
          role: 'merchant',
        },
        {
          onConflict: 'wallet_address',
        }
      );

    if (userError) {
      console.error('Error setting user role:', userError);
      // Non-fatal, merchant is created
    }

    return NextResponse.json(
      {
        success: true,
        merchant,
        message: 'Merchant account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in merchant registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
