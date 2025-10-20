/**
 * MoonPay Commerce Paylink Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to: https://moonpay.hel.io/dashboard
 * 2. Click "CREATE PAYMENT" button
 * 3. Create paylinks for common price points
 * 4. Copy paylink IDs and paste them below
 *
 * For Hackathon Demo: Create 5-10 paylinks covering typical coupon prices
 * For Production: Add paylink_id field to deals table
 */

export interface PaylinkMapping {
  amount: number;
  paylinkId: string;
  name: string;
  description: string;
}

/**
 * Paylink mapping for common price points
 * Replace placeholder IDs with actual IDs from MoonPay dashboard
 */
export const PAYLINK_MAP: Record<string, string> = {
  // Example format:
  // '1.00': 'actual-paylink-id-from-dashboard',
  // '5.00': 'actual-paylink-id-from-dashboard',

  // ✅ All paylinks configured 2025-10-19 (8 price points)
  '1.00': '68f46168af241bd18abbb665',
  '2.00': '68f461a6126df83114fff888',
  '5.00': '68f46078dd8fc3e107605b75',
  '10.00': '68f461bec2400bdc9f5bbff8',
  '15.00': '68f461cfaedc153428011170',
  '20.00': '68f461e10914a1ae9d1c0084',
  '25.00': '68f46204c9daf9bc20b3650d',
  '50.00': '68f462e4aedc153428011579',
};

/**
 * Get paylink ID for a specific amount
 * Returns exact match or null if not found
 */
export function getPaylinkId(amount: number): string | null {
  const key = amount.toFixed(2);
  const paylinkId = PAYLINK_MAP[key];

  // Check if it's still a placeholder
  if (paylinkId?.startsWith('REPLACE_WITH_')) {
    console.warn(`⚠️ Paylink ID for $${key} is not configured. Using direct payment mode.`);
    return null;
  }

  return paylinkId || null;
}

/**
 * Get closest available paylink ID
 * Useful for fuzzy matching when exact price not available
 */
export function getClosestPaylinkId(amount: number): string | null {
  const amounts = Object.keys(PAYLINK_MAP)
    .map(parseFloat)
    .filter(amt => !PAYLINK_MAP[amt.toFixed(2)]?.startsWith('REPLACE_WITH_'))
    .sort((a, b) => Math.abs(a - amount) - Math.abs(b - amount));

  if (amounts.length === 0) {
    return null;
  }

  const closest = amounts[0];
  return PAYLINK_MAP[closest.toFixed(2)];
}

/**
 * Check if paylink mapping is configured
 */
export function hasConfiguredPaylinks(): boolean {
  return Object.values(PAYLINK_MAP).some(id => !id.startsWith('REPLACE_WITH_'));
}

/**
 * Get list of configured amounts
 */
export function getConfiguredAmounts(): number[] {
  return Object.entries(PAYLINK_MAP)
    .filter(([_, id]) => !id.startsWith('REPLACE_WITH_'))
    .map(([amount]) => parseFloat(amount))
    .sort((a, b) => a - b);
}
