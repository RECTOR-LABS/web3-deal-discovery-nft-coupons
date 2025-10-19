/**
 * MoonPay Commerce (formerly Hel.io) Payment Integration
 * Enables Solana payments: SOL, USDC, BONK, etc.
 *
 * Dashboard: https://moonpay.hel.io/dashboard
 * Docs: https://docs.hel.io
 */

export interface PaymentConfig {
  amount: number;
  currency: 'USDC' | 'SOL' | 'BONK';
  productName: string;
  productDescription?: string;
  productImageUrl?: string;
  dealId?: string;
  nftMintAddress?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  signature?: string;
  error?: string;
}

/**
 * Get MoonPay public key from environment
 */
export function getMoonPayPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_MOONPAY_PUBLIC_KEY;
  if (!key) {
    throw new Error('NEXT_PUBLIC_MOONPAY_PUBLIC_KEY not configured in .env.local');
  }
  return key;
}

/**
 * Create payment configuration for NFT coupon purchase
 */
export function createCouponPaymentConfig(
  dealTitle: string,
  dealDescription: string,
  discountPercentage: number,
  priceUSDC: number,
  imageUrl?: string,
  dealId?: string,
  nftMintAddress?: string
): PaymentConfig {
  return {
    amount: priceUSDC,
    currency: 'USDC',
    productName: `${discountPercentage}% Off - ${dealTitle}`,
    productDescription: dealDescription,
    productImageUrl: imageUrl,
    dealId,
    nftMintAddress,
  };
}

/**
 * Calculate suggested price for NFT coupon
 * Based on discount percentage and typical coupon pricing
 */
export function calculateCouponPrice(discountPercentage: number): number {
  // Simple pricing model: Higher discounts = higher price
  // You can adjust this formula based on your business model
  if (discountPercentage >= 50) return 10.0; // $10 USDC
  if (discountPercentage >= 30) return 5.0; // $5 USDC
  if (discountPercentage >= 20) return 3.0; // $3 USDC
  if (discountPercentage >= 10) return 1.0; // $1 USDC
  return 0.5; // $0.50 USDC minimum
}

/**
 * Handle successful payment
 * Store transaction in database and trigger NFT minting
 */
export async function handlePaymentSuccess(
  transactionId: string,
  dealId: string,
  userWallet: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Record payment in database
    const response = await fetch('/api/payments/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionId,
        dealId,
        userWallet,
        amount,
        currency: 'USDC',
        status: 'completed',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record payment');
    }

    return { success: true };
  } catch (error) {
    console.error('Payment success handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: number): string {
  return `$${amount.toFixed(2)} USDC`;
}

/**
 * Verify payment on backend (webhook handler)
 */
export async function verifyPayment(
  transactionId: string
): Promise<{ valid: boolean; details?: unknown }> {
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return { valid: true, details: data };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { valid: false };
  }
}
