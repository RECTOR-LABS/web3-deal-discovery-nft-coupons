# MoonPay Commerce Integration - Working Solution

## 🎯 Problem
MoonPay Commerce API keys (from dashboard) don't work with `@heliofi/sdk` package.

## ✅ Solution: Dashboard-Created Paylinks

### Step 1: Create Paylink in Dashboard

1. Go to: https://moonpay.hel.io/dashboard
2. Click **"CREATE PAYMENT"** button
3. Fill in:
   - **Name:** "NFT Coupon - 25% Off"
   - **Amount:** 5.00
   - **Currency:** USDC
   - **Description:** "Pizza deal NFT coupon"
4. Click **Create**
5. **Copy the Paylink ID** (looks like: `6571e7cd4a2bee8095ee84da`)

### Step 2: Use Paylink ID in Code

```tsx
import { HelioCheckout } from '@heliofi/checkout-react';

function PaymentButton() {
  return (
    <HelioCheckout
      config={{
        paylinkId: "6571e7cd4a2bee8095ee84da", // From dashboard
      }}
      onSuccess={(tx) => console.log('Paid!', tx)}
      onError={(err) => console.error('Failed:', err)}
      theme="dark"
    >
      <button className="btn-primary">
        Pay with Crypto
      </button>
    </HelioCheckout>
  );
}
```

### Step 3: Make it Dynamic (Advanced)

Create paylinks programmatically using dashboard → get ID → pass to widget.

**OR**

Store paylink IDs in your database:
```sql
-- Add column to deals table
ALTER TABLE deals ADD COLUMN paylink_id TEXT;
```

When merchant creates deal:
1. They create paylink in MoonPay dashboard
2. Copy paylink ID
3. Paste into your deal creation form
4. Store in database
5. Use in checkout widget

---

## 🎨 Alternative: Use Simplified Widget

The widget can work without explicit paylink IDs for simple cases:

```tsx
<HelioCheckout
  config={{
    amount: "5.00",
    currency: "USDC",
    name: "NFT Coupon - 25% Off Pizza",
    description: "Delicious deal!",
  }}
  onSuccess={(tx) => console.log('Paid!', tx)}
/>
```

**Note:** This may or may not work depending on MoonPay Commerce configuration.

---

## 🔄 Long-term Solution

Wait for MoonPay to release official SDK for MoonPay Commerce:
- Package name: `@moonpay/commerce-sdk` (expected)
- Or updated `@heliofi/sdk` with MoonPay Commerce support

**For now:** Use dashboard-created paylinks ✅

---

## 📝 Current Working Setup

**What works:**
- ✅ `@heliofi/checkout-react@4.0.2` - Widget works perfectly
- ✅ Dashboard-created paylinks
- ✅ Your MoonPay Commerce API keys (for dashboard access)

**What doesn't work:**
- ❌ `@heliofi/sdk@2.2.5` - Legacy package, incompatible keys
- ❌ Programmatic paylink creation via SDK

**Workaround:**
- Create paylinks manually in dashboard
- Store paylink IDs in database
- Use IDs in checkout widget

---

## 🎯 Implementation for Your Project

### For Hackathon (Quick):
1. Create 5-10 paylinks in dashboard for different price points
2. Map them to discount percentages:
   ```typescript
   const PAYLINK_MAP = {
     '10%': 'paylink-id-1',
     '20%': 'paylink-id-2',
     '30%': 'paylink-id-3',
     // etc.
   };
   ```
3. Use appropriate paylink based on deal discount

### For Production (Proper):
1. Add `paylink_id` field to merchant deal creation form
2. Merchants create paylink in MoonPay dashboard
3. Copy/paste ID into your form
4. Store in database
5. Use in checkout

---

## ✅ Test Page Available

Test the working integration:
```
http://localhost:3000/test-payment
```

Uses `SimplePaymentButton` component (no SDK needed).
