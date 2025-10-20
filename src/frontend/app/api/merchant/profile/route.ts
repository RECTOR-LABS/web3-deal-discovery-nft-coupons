import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase';

/**
 * GET /api/merchant/profile?wallet=<address>
 * Get merchant profile by wallet address
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

    const { data: merchant, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found', exists: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      merchant,
      exists: true,
    });
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/merchant/profile
 * Update merchant profile
 *
 * Body:
 * {
 *   walletAddress: string;
 *   businessName?: string;
 *   description?: string;
 *   logoUrl?: string;
 *   address?: string;
 *   city?: string;
 *   state?: string;
 *   postalCode?: string;
 *   country?: string;
 *   latitude?: number;
 *   longitude?: number;
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      businessName,
      description,
      logoUrl,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude
    } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Validate latitude and longitude ranges
    if (latitude !== undefined && latitude !== null) {
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return NextResponse.json(
          { error: 'Invalid latitude. Must be a number between -90 and 90.' },
          { status: 400 }
        );
      }
    }

    if (longitude !== undefined && longitude !== null) {
      if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return NextResponse.json(
          { error: 'Invalid longitude. Must be a number between -180 and 180.' },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, string | number | null> = {};
    if (businessName !== undefined) updates.business_name = businessName;
    if (description !== undefined) updates.description = description;
    if (logoUrl !== undefined) updates.logo_url = logoUrl;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (postalCode !== undefined) updates.postal_code = postalCode;
    if (country !== undefined) updates.country = country;
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;

    const { data: merchant, error } = await supabase
      .from('merchants')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single();

    if (error) {
      console.error('Error updating merchant profile:', error);
      return NextResponse.json(
        { error: 'Failed to update merchant profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      merchant,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
