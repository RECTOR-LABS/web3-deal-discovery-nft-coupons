# MoonPay Commerce Paylink Setup Guide

**Quick Start:** Create paylinks in MoonPay dashboard → Copy IDs → Update config → Done!

---

## Step 1: Access MoonPay Commerce Dashboard

1. **Open Dashboard:**
   - URL: https://moonpay.hel.io/dashboard
   - Login with your credentials

2. **Verify You're Logged In:**
   - You should see "Dashboard" navigation
   - Look for "CREATE PAYMENT" button (top-right)

---

## Step 2: Create Paylinks for Common Prices

You'll create 5-8 paylinks covering typical NFT coupon prices.

### For Each Price Point:

**Example: Creating $5.00 USDC Paylink**

1. **Click "CREATE PAYMENT"** button

2. **Fill in Payment Details:**
   ```
   Name:        NFT Coupon - $5.00
   Amount:      5.00
   Currency:    USDC (select from dropdown)
   Description: Digital NFT coupon for deals and discounts
   ```

3. **Click "Create"** button

4. **Copy the Paylink ID:**
   - After creation, you'll see a paylink page
   - The paylink ID is in the URL or displayed on the page
   - Format: `6571e7cd4a2bee8095ee84da` (24-character hex string)
   - **IMPORTANT:** Copy this ID immediately!

5. **Save the ID:**
   - Open a text file/note
   - Write: `$5.00 = 6571e7cd4a2bee8095ee84da`

### Recommended Price Points to Create:

Create paylinks for these amounts (adjust based on your deals):

- ✅ **$1.00 USDC** - Small discounts
- ✅ **$2.00 USDC** - Common deal price
- ✅ **$5.00 USDC** - Popular tier
- ✅ **$10.00 USDC** - Medium tier
- ✅ **$15.00 USDC** - Premium tier
- ✅ **$20.00 USDC** - High-value deals
- ⬜ **$25.00 USDC** - Optional
- ⬜ **$50.00 USDC** - Optional

**Time Estimate:** 10-15 minutes to create 5-8 paylinks

---

## Step 3: Update Your Paylink Configuration

Once you have all your paylink IDs, update the configuration file:

### Open Configuration File:

```bash
# File location:
src/frontend/lib/payments/paylink-config.ts
```

### Replace Placeholder IDs:

**Before:**
```typescript
export const PAYLINK_MAP: Record<string, string> = {
  '1.00': 'REPLACE_WITH_1_DOLLAR_PAYLINK_ID',
  '5.00': 'REPLACE_WITH_5_DOLLAR_PAYLINK_ID',
  // ...
};
```

**After (with your actual IDs):**
```typescript
export const PAYLINK_MAP: Record<string, string> = {
  '1.00': '6571e7cd4a2bee8095ee84da',
  '2.00': '6571e8f14a2bee8095ee84db',
  '5.00': '6571e9124a2bee8095ee84dc',
  '10.00': '6571ea3d4a2bee8095ee84dd',
  '15.00': '6571eb5e4a2bee8095ee84de',
  '20.00': '6571ec7f4a2bee8095ee84df',
};
```

### Example with Notes:

```typescript
export const PAYLINK_MAP: Record<string, string> = {
  // Small coupons (10-20% off)
  '1.00': '6571e7cd4a2bee8095ee84da',
  '2.00': '6571e8f14a2bee8095ee84db',

  // Popular tier (25-40% off)
  '5.00': '6571e9124a2bee8095ee84dc',
  '10.00': '6571ea3d4a2bee8095ee84dd',

  // Premium deals (50%+ off)
  '15.00': '6571eb5e4a2bee8095ee84de',
  '20.00': '6571ec7f4a2bee8095ee84df',
};
```

---

## Step 4: Test Your Setup

### Option A: Use Test Page

1. **Start Development Server:**
   ```bash
   cd src/frontend
   npm run dev
   ```

2. **Open Test Page:**
   ```
   http://localhost:3000/test-payment
   ```

3. **Verify Paylink Mode:**
   - Look for debug message: "✓ Using paylink: 6571e7cd..."
   - If you see "⚠️ Direct mode", paylink ID not found

4. **Test Payment Flow:**
   - Click "Pay $5.00 USDC" button
   - Helio checkout modal should open
   - Try completing a payment (devnet)

### Option B: Test with Real Deal

1. **Create a Test Deal:**
   - Go to merchant dashboard
   - Create deal with price matching one of your paylinks
   - Example: Set price to $5.00 if you have '5.00' paylink configured

2. **Browse as User:**
   - Go to user marketplace
   - Find your test deal
   - Click "Claim Coupon"
   - Verify payment button shows correct amount

3. **Check Console Logs:**
   ```javascript
   // Should see in browser console:
   ✓ Using paylink: 6571e9124a2bee8095ee84dc
   ```

---

## Step 5: Verify Configuration Status

### Check Configured Amounts:

Open browser console on any page with payment button:

```javascript
import { getConfiguredAmounts } from '@/lib/payments/paylink-config';

console.log('Configured amounts:', getConfiguredAmounts());
// Output: [1, 2, 5, 10, 15, 20]
```

### Check Specific Amount:

```javascript
import { getPaylinkId } from '@/lib/payments/paylink-config';

console.log('Paylink for $5:', getPaylinkId(5.00));
// Output: '6571e9124a2bee8095ee84dc' (or null if not configured)
```

---

## How It Works

### Automatic Paylink Selection:

When a user tries to pay for a deal:

1. **SimplePaymentButton** checks `getPaylinkId(amount)`
2. **If paylink exists:**
   - Uses `{ paylinkId: '6571e7cd...' }` mode
   - MoonPay loads pre-configured payment from dashboard
3. **If no paylink:**
   - Falls back to direct mode: `{ amount, currency, name, description }`
   - Works but less reliable (may not always work)

### Example User Flow:

```
User clicks "Claim Coupon" ($5.00 deal)
  ↓
SimplePaymentButton calls getPaylinkId(5.00)
  ↓
Returns '6571e9124a2bee8095ee84dc'
  ↓
HelioCheckout opens with paylink ID
  ↓
User completes payment
  ↓
NFT minted and transferred
```

---

## Troubleshooting

### Issue: "⚠️ Direct mode (no paylink)" shown

**Cause:** No paylink ID configured for this amount

**Solutions:**
1. Check `PAYLINK_MAP` - amount must match exactly (e.g., '5.00' not '5')
2. Verify paylink ID is not placeholder (`REPLACE_WITH_...`)
3. Create missing paylink in dashboard for this amount

### Issue: Payment modal doesn't open

**Cause:** Widget integration issue

**Solutions:**
1. Check browser console for errors
2. Verify `@heliofi/checkout-react@^4.0.0` installed
3. Check MoonPay API keys in `.env.local`

### Issue: "Paylink not found" error

**Cause:** Invalid paylink ID or wrong network

**Solutions:**
1. Verify paylink ID copied correctly (no extra spaces)
2. Check paylink exists in dashboard
3. Confirm using same network (devnet vs mainnet)

---

## Production vs Hackathon Approach

### Hackathon (Current Setup):

✅ **Pre-created paylinks** in dashboard
✅ **Static mapping** in `paylink-config.ts`
✅ **Quick setup** (10-15 minutes)
✅ **Good for demo** with known price points

**Limitations:**
- Fixed price points only
- Manual paylink creation
- Can't handle arbitrary amounts

### Production (Future Enhancement):

**Option 1: Database Storage**
```sql
ALTER TABLE deals ADD COLUMN paylink_id TEXT;
```
- Merchants create paylink in dashboard
- Paste paylink ID when creating deal
- Stored per-deal, fully flexible

**Option 2: Backend SDK (When Available)**
- Wait for MoonPay to update SDK
- Create paylinks programmatically
- Fully automated

---

## Quick Reference

### Important Files:

```
src/frontend/lib/payments/
  ├── paylink-config.ts          # ← UPDATE THIS with your paylink IDs
  ├── moonpay.ts                 # Payment utilities
  └── helio-sdk.ts               # Backend SDK (not working yet)

src/frontend/components/payments/
  └── SimplePaymentButton.tsx    # Auto-uses paylinks when available
```

### Key Functions:

```typescript
// Get paylink ID for exact amount
getPaylinkId(5.00) // → '6571e9124a2bee8095ee84dc' or null

// Get closest match
getClosestPaylinkId(4.99) // → Returns paylink for $5.00

// Check if any paylinks configured
hasConfiguredPaylinks() // → true/false

// List all configured amounts
getConfiguredAmounts() // → [1, 2, 5, 10, 15, 20]
```

---

## Next Steps

1. ✅ Create 5-8 paylinks in dashboard
2. ✅ Copy paylink IDs
3. ✅ Update `paylink-config.ts`
4. ✅ Test with `/test-payment` page
5. ✅ Create real deals matching your price points
6. ✅ Test end-to-end user flow

**Time to Complete:** 15-20 minutes

---

## Dashboard Access Reminder

**URL:** https://moonpay.hel.io/dashboard
**API Keys Location:** Dashboard → Developer → API Keys

**Your Current Keys:**
- Public Key: `QdeLdzpVjOU5VYraS0g8GoiDpxrgcRk1wjCQzPdxCififqNrQ6_oMnjV1ezgImCi`
- Secret Key: (stored in `.env.local`)

---

MashaAllah! Your payment integration is ready. Just create the paylinks and update the config! 🚀

**Questions?** Check `MOONPAY-SOLUTION.md` for technical details.
