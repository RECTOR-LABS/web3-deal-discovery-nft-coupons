import { supabase } from '@/lib/database/supabase';

// Tier-based cashback rates
const CASHBACK_RATES: Record<string, number> = {
  Bronze: 5,
  Silver: 8,
  Gold: 12,
  Platinum: 15,
};

// Category multipliers for deal value
const CATEGORY_MULTIPLIERS: Record<string, number> = {
  'Food & Beverage': 1.0,
  'Retail': 1.5,
  'Services': 1.2,
  'Travel': 2.0,
  'Entertainment': 1.3,
  'Other': 1.0,
};

/**
 * Calculate cashback amount based on deal value, category, and user tier
 */
export function calculateCashback(
  discountPercentage: number,
  category: string,
  tier: string
): number {
  // Deal value = discount % × 100 × 20 (base value) × category multiplier
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  const dealValue = discountPercentage * 100 * 20 * categoryMultiplier;

  // Cashback = deal value × cashback rate
  const cashbackRate = CASHBACK_RATES[tier] || 5;
  const cashbackAmount = Math.floor((dealValue * cashbackRate) / 100);

  // Convert to lamports (9 decimals)
  return cashbackAmount * 1e9;
}

/**
 * Distribute cashback to user after redemption
 */
export async function distributeCashback(params: {
  userWallet: string;
  dealId: string;
  discountPercentage: number;
  category: string;
  tier: string;
}): Promise<{ success: boolean; cashbackAmount: number; error?: string }> {
  try {
    const { userWallet, dealId, discountPercentage, category, tier } = params;

    // Calculate cashback amount
    const cashbackAmount = calculateCashback(discountPercentage, category, tier);

    if (cashbackAmount === 0) {
      return { success: true, cashbackAmount: 0 };
    }

    // Record cashback transaction
    const { error: txError } = await supabase.from('cashback_transactions').insert({
      user_wallet: userWallet,
      deal_id: dealId,
      cashback_amount: cashbackAmount,
      tier,
      cashback_rate: CASHBACK_RATES[tier] || 5,
    });

    if (txError) {
      console.error('Failed to record cashback transaction:', txError);
      return { success: false, cashbackAmount: 0, error: txError.message };
    }

    // Update user's lifetime cashback
    // First get current value
    const { data: userData } = await supabase
      .from('users')
      .select('lifetime_cashback')
      .eq('wallet_address', userWallet)
      .single();

    const currentCashback = userData?.lifetime_cashback || 0;

    // Then update with new total
    await supabase
      .from('users')
      .update({
        lifetime_cashback: currentCashback + cashbackAmount,
      })
      .eq('wallet_address', userWallet);

    return { success: true, cashbackAmount };
  } catch (error) {
    console.error('Cashback distribution error:', error);
    return { success: false, cashbackAmount: 0, error: String(error) };
  }
}
