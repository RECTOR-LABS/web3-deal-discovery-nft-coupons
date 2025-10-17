import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

/**
 * GET /api/merchant/check-role?wallet=<address>
 * Check if wallet address has merchant role
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if merchant exists
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id, business_name, wallet_address')
      .eq('wallet_address', walletAddress)
      .single();

    // Check user role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('wallet_address', walletAddress)
      .single();

    const isMerchant = !!merchant;
    const role = user?.role || 'user';

    return NextResponse.json({
      isMerchant,
      role,
      merchant: merchant || null,
    });
  } catch (error) {
    console.error('Error checking merchant role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
