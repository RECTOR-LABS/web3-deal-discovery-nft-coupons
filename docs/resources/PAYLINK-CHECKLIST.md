# Paylink Creation Checklist

**Dashboard:** https://moonpay.hel.io/dashboard

Use this checklist while creating paylinks. Copy your paylink IDs here, then transfer to `paylink-config.ts`.

---

## Paylink Creation Progress

### ✅ $1.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f46168af241bd18abbb665`
- **Name:** `NFT Coupon - $1.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $2.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f461a6126df83114fff888`
- **Name:** `NFT Coupon - $2.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $5.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f46078dd8fc3e107605b75`
- **Name:** `NFT Coupon - $5.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $10.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f461bec2400bdc9f5bbff8`
- **Name:** `NFT Coupon - $10.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $15.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f461cfaedc153428011170`
- **Name:** `NFT Coupon - $15.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $20.00 USDC
- [x] Created in dashboard ✅
- **Paylink ID:** `68f461e10914a1ae9d1c0084`
- **Name:** `NFT Coupon - $20.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $25.00 USDC (Optional)
- [x] Created in dashboard ✅
- **Paylink ID:** `68f46204c9daf9bc20b3650d`
- **Name:** `NFT Coupon - $25.00`
- **Description:** `Digital NFT coupon for deals and discounts`

### ✅ $50.00 USDC (Optional)
- [x] Created in dashboard ✅
- **Paylink ID:** `68f462e4aedc153428011579`
- **Name:** `NFT Coupon - $50.00`
- **Description:** `Digital NFT coupon for deals and discounts`

---

## Configuration Code

Once you have all paylink IDs, copy this template and paste into:
`src/frontend/lib/payments/paylink-config.ts`

```typescript
export const PAYLINK_MAP: Record<string, string> = {
  '1.00': 'PASTE_1_DOLLAR_PAYLINK_ID_HERE',
  '2.00': 'PASTE_2_DOLLAR_PAYLINK_ID_HERE',
  '5.00': 'PASTE_5_DOLLAR_PAYLINK_ID_HERE',
  '10.00': 'PASTE_10_DOLLAR_PAYLINK_ID_HERE',
  '15.00': 'PASTE_15_DOLLAR_PAYLINK_ID_HERE',
  '20.00': 'PASTE_20_DOLLAR_PAYLINK_ID_HERE',
  // '25.00': 'PASTE_25_DOLLAR_PAYLINK_ID_HERE', // Optional
  // '50.00': 'PASTE_50_DOLLAR_PAYLINK_ID_HERE', // Optional
};
```

---

## Verification Steps

- [ ] All required paylinks created (at least 4-6 price points)
- [ ] All paylink IDs copied correctly (24-character hex strings)
- [ ] `paylink-config.ts` updated with real IDs
- [ ] No placeholder IDs remaining (`REPLACE_WITH_...`)
- [ ] Development server restarted (`npm run dev`)
- [ ] Test page shows "✓ Using paylink" (http://localhost:3000/test-payment)
- [ ] Payment modal opens successfully
- [ ] Can complete test payment on devnet

---

## Notes

**Paylink ID Format:**
- Correct: `6571e7cd4a2bee8095ee84da` (24 chars, hex)
- Wrong: `https://moonpay.hel.io/...` (URL - extract ID only)

**Common Mistakes:**
- ❌ Copying full URL instead of just ID
- ❌ Including spaces before/after ID
- ❌ Typo in amount key ('5' vs '5.00')
- ❌ Forgetting to restart dev server

**Time Estimate:**
- Creating 6 paylinks: ~10 minutes
- Updating config: ~2 minutes
- Testing: ~5 minutes
- **Total: ~15-20 minutes**

---

Bismillah! May Allah make this setup easy and successful. 🤲
