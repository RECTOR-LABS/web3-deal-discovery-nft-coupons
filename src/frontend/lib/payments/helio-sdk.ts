/**
 * Helio SDK Backend Integration
 * Creates paylinks programmatically using @heliofi/sdk
 * Server-side only (uses secret key)
 */

import { HelioSDK } from '@heliofi/sdk';

/**
 * Initialize Helio SDK (backend only - uses secret key!)
 * DO NOT use this in client-side code
 */
function getHelioSDK(): HelioSDK {
  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_PUBLIC_KEY;
  const secretKey = process.env.MOONPAY_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Helio API credentials not configured in .env.local');
  }

  return new HelioSDK({
    apiKey,
    secretKey,
    network: 'devnet', // Change to 'mainnet' for production
  });
}

/**
 * Create a paylink for NFT coupon purchase
 * Returns paylinkId to use with @heliofi/checkout-react component
 */
export async function createCouponPaylink(params: {
  dealTitle: string;
  dealDescription: string;
  discountPercentage: number;
  priceUSDC: number;
  imageUrl?: string;
  dealId?: string;
  merchantWallet?: string;
}): Promise<{ paylinkId: string; url: string } | { error: string }> {
  try {
    const sdk = getHelioSDK();

    const paylink = await sdk.paylink.create({
      name: `${params.discountPercentage}% Off - ${params.dealTitle}`,
      description: params.dealDescription,
      amount: params.priceUSDC,
      currency: 'USDC',
      imageUrl: params.imageUrl,
      // Optional metadata
      metadata: {
        dealId: params.dealId,
        merchantWallet: params.merchantWallet,
        type: 'nft-coupon',
      },
    });

    if (!paylink || !paylink.id) {
      return { error: 'Failed to create paylink' };
    }

    return {
      paylinkId: paylink.id,
      url: paylink.url || '', // Helio paylink URL
    };
  } catch (error) {
    console.error('Paylink creation error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to create paylink',
    };
  }
}

/**
 * Get paylink details
 */
export async function getPaylink(paylinkId: string) {
  try {
    const sdk = getHelioSDK();
    return await sdk.paylink.get(paylinkId);
  } catch (error) {
    console.error('Get paylink error:', error);
    return null;
  }
}

/**
 * List all paylinks (for admin/analytics)
 */
export async function listPaylinks(limit = 10) {
  try {
    const sdk = getHelioSDK();
    return await sdk.paylink.list({ limit });
  } catch (error) {
    console.error('List paylinks error:', error);
    return [];
  }
}
