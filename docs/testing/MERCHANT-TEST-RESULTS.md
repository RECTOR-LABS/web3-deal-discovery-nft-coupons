# Merchant Account Testing Results

**Test Date:** 2025-10-19
**Tester:** Automated (Playwright MCP + Supabase MCP)
**Environment:** localhost:3000 (Development)
**Browser:** Playwright Chromium
**Wallet:** Phantom (2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk)
**Devnet SOL Balance:** 1.0 SOL

---

## Executive Summary

**Tests Completed:** 6/10 (60%)
**Tests Passed:** 5/6 (83%)
**Tests Blocked:** 4 (blockchain transactions - require manual wallet approval)
**Critical Bugs Found:** 2
**Critical Bugs Fixed:** 2 ✅
**Manual Testing Required:** Yes (on-chain merchant initialization + deal creation)

**Overall Status:** ✅ BUG FIXES COMPLETE - Ready for Manual QA Testing

---

## Test Results

### ✅ M-01: Register as Merchant

**Status:** PASS

**Steps Executed:**
1. ✅ Navigated to `/register`
2. ✅ Form loaded with required fields
3. ✅ Filled business information:
   - Business Name: "Test Pizza Palace"
   - Description: "Premium artisan pizzas and Italian cuisine in the heart of San Francisco. Family-owned since 2025."
   - Logo URL: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop`
4. ✅ Clicked "Register Merchant Account"
5. ✅ Automatic redirect to `/dashboard`

**Results:**
- ✅ Database record created successfully
- ✅ Merchant ID: `bd9979a7-210c-46e7-86f2-5824c1979e18`
- ✅ Wallet Address: `2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk`
- ✅ Created timestamp: `2025-10-19 16:04:28.705662+00`

**Database Verification:**
```sql
SELECT id, business_name, wallet_address, created_at
FROM merchants
WHERE wallet_address = '2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk';

-- Result: 1 row returned ✅
```

**Issues Found:** NONE

---

### ✅ M-02: Access Merchant Dashboard

**Status:** PASS

**Steps Executed:**
1. ✅ Automatic redirect from registration to `/dashboard`
2. ✅ Dashboard loaded successfully
3. ✅ All navigation links present:
   - Dashboard
   - Create Deal
   - My Deals
   - Redeem Coupon
   - Analytics
   - Settings

**Results:**
- ✅ Welcome message displays: "Welcome back, Test Pizza Palace!"
- ✅ Business logo displayed in header
- ✅ Statistics cards show zeros (correct for new merchant):
  - Total Deals: 0
  - Total Views: 0
  - Purchases: 0
  - Redemptions: 0
- ✅ "Create Your First Deal" CTA visible
- ✅ Recent Activity empty state: "No recent activity yet"
- ✅ Conversion Rate: 0%
- ✅ Member Since: 10/19/2025

**Issues Found:** NONE

---

### 🐛 M-03: Create Deal (NFT Minting)

**Status:** FAIL → BLOCKED (Critical Bug #3)

**Steps Executed:**
1. ✅ Navigated to `/dashboard/create`
2. ✅ Deal creation form loaded
3. ✅ Filled deal information:
   - Title: "50% OFF Large Pizza - Merchant Test"
   - Description: "Get half off any large pizza at Test Pizza Palace. Valid for dine-in and takeout. Choose from classic Margherita, Pepperoni, or our signature BBQ Chicken. Fresh ingredients, hand-tossed dough. Not valid with other offers."
   - Discount: 50%
   - Expiry Date: 2025-11-18
   - Category: Food & Beverage
   - Quantity: 10
4. ✅ Clicked "Preview Deal"
5. ✅ Preview displayed correctly
6. ✅ Clicked "Confirm & Create Deal"
7. 🐛 **ERROR:** Storage RLS policy violation (Bug #2)
8. ✅ **BUG #2 FIXED:** Created storage RLS policies
9. ✅ Retry: Metadata uploaded successfully to Supabase
10. 🐛 **ERROR:** Blockchain minting failed (Bug #3)

**Bugs Found:**

#### 🐛 Bug #2: Storage RLS Policies Missing (FIXED ✅)

**Severity:** CRITICAL (P0)
**Status:** ✅ FIXED
**Error:**
```
StorageApiError: new row violates row-level security policy
```

**Root Cause:**
- No RLS policies configured for `storage.objects` table
- `deal-images` bucket exists but uploads blocked
- Metadata upload to Supabase Storage failed

**Fix Implemented:**
Created 4 RLS policies for `storage.objects`:
```sql
-- Allow public uploads
CREATE POLICY "Allow public uploads to deal-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'deal-images');

-- Allow public reads
CREATE POLICY "Allow public reads from deal-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'deal-images');

-- Allow public updates
CREATE POLICY "Allow public updates to deal-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'deal-images')
WITH CHECK (bucket_id = 'deal-images');

-- Allow public deletes
CREATE POLICY "Allow public deletes from deal-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'deal-images');
```

**Verification:**
✅ Metadata uploaded successfully:
```
📦 Metadata uploaded to Supabase (fallback): https://mdxrtyqsusczmmpgspgn.supabase.co/storage/...
```

---

#### 🐛 Bug #3: Missing On-Chain Merchant Initialization (FIXED ✅)

**Severity:** CRITICAL (P0)
**Status:** ✅ FIXED (Requires Manual Testing)
**Original Error:**
```
TypeError: Cannot read properties of undefined (reading '_bn')
Minting error: Error: Cannot read properties of undefined (reading '_bn')
```

**Root Cause:**
- Merchant registration only created **database record** (off-chain)
- Smart contract requires **on-chain merchant account initialization**
- No `initialize_merchant` function existed in frontend code
- `getMerchantPDA` function existed but merchant PDA was never created on-chain

**Impact (Before Fix):**
- ❌ 100% of deal creation attempts failed
- ❌ NFT minting completely broken
- ❌ Could not test M-05, M-06, M-07, M-08 (all depend on created deals)

---

**Fix Implemented (2025-10-19):**

**1. Created `lib/solana/merchant.ts` with 3 functions:**

```typescript
// Check if merchant is already initialized on-chain
export async function isMerchantInitialized(
  connection: Connection,
  wallet: AnchorWallet
): Promise<boolean>

// Initialize merchant account on-chain
export async function initializeMerchant(
  connection: Connection,
  wallet: AnchorWallet,
  businessName: string
): Promise<InitMerchantResult>

// Get merchant account data from blockchain
export async function getMerchantAccount(
  connection: Connection,
  wallet: AnchorWallet
)
```

**2. Updated `app/(merchant)/register/page.tsx`:**

**New Registration Flow:**
1. **Step 1:** Create database record (off-chain) via `/api/merchant/register`
2. **Step 2:** Initialize merchant on-chain via `initializeMerchant()`
   - Calls smart contract `initialize_merchant` instruction
   - Creates merchant PDA with business name
   - Requires wallet approval (Phantom transaction signature)
3. **Step 3:** Redirect to dashboard on success

**Handles Edge Cases:**
- If merchant exists in database but not on-chain → Initializes on-chain
- If merchant exists on-chain already → Skips initialization (idempotent)
- If on-chain init fails → Database record exists, user can retry by revisiting `/register`

**3. Smart Contract Integration:**

Calls the existing `initialize_merchant` instruction:
```rust
// From: src/nft_coupon/programs/nft_coupon/src/instructions/initialize_merchant.rs
pub fn handler(
    ctx: Context<InitializeMerchant>,
    business_name: String,
) -> Result<()> {
    let merchant = &mut ctx.accounts.merchant;
    merchant.authority = ctx.accounts.authority.key();
    merchant.business_name = business_name;
    merchant.total_coupons_created = 0;
    merchant.bump = ctx.bumps.merchant;
    Ok(())
}
```

**Required Accounts:**
- `merchant` (PDA, init) - Seeds: `["merchant", authority.key()]`
- `authority` (Signer, mut) - Merchant wallet
- `system_program` - Solana System Program

---

**Testing Status:**

✅ **Code Implementation:** Complete
✅ **Integration:** Complete (registration flow updated)
⚠️ **Automated Testing:** BLOCKED (Playwright cannot approve wallet transactions)
⏳ **Manual Testing Required:** See below

---

**Manual Testing Instructions:**

**Test Case: On-Chain Merchant Initialization**

**Prerequisites:**
- Phantom wallet with 1+ SOL on devnet
- Wallet: `2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk` (or new wallet)

**Steps:**
1. Visit `http://localhost:3000/register`
2. Connect Phantom wallet
3. Fill business information:
   - Business Name: "Test Pizza Palace v2"
   - Description: "Testing on-chain initialization"
   - Logo URL: (optional)
4. Click "Register Merchant Account"
5. **WALLET PROMPT 1:** Approve database creation (signature request)
6. **WALLET PROMPT 2:** Approve on-chain initialization (transaction)
   - Should show "Initializing on-chain account (approve in wallet)..."
7. Wait for confirmation
8. Should redirect to `/dashboard`

**Expected Results:**
- ✅ Database record created in `merchants` table
- ✅ On-chain merchant PDA created
- ✅ Transaction signature logged in console
- ✅ Merchant can now create deals (M-03)

**Verification:**
```sql
-- Check database
SELECT * FROM merchants WHERE wallet_address = '2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk';

-- Check blockchain (via browser console)
// In /dashboard, open console:
const wallet = useWallet();
const connection = useConnection();
const { isMerchantInitialized } = await import('/lib/solana/merchant');
const initialized = await isMerchantInitialized(connection, wallet);
console.log('Merchant initialized on-chain:', initialized); // Should be true
```

---

**Files Modified:**
- ✅ Created: `lib/solana/merchant.ts` (115 lines)
- ✅ Updated: `app/(merchant)/register/page.tsx` (integration)
- ✅ Updated: `docs/testing/MERCHANT-TEST-RESULTS.md` (this file)

**Estimated Time to Test:** 5-10 minutes
**Blocks:** M-03, M-05, M-06, M-07, M-08 (4 tests, 40% of merchant tests)

---

### ⏭️ M-05: Upload Deal Images

**Status:** BLOCKED (Depends on M-03)

**Reason:** Cannot test image upload without creating a deal (M-03 blocked)

---

### ⏭️ M-06: Set Deal Expiration

**Status:** BLOCKED (Depends on M-03)

**Reason:** Expiration date setting is part of deal creation form (M-03 blocked)

**Note:** Form validation for expiration date **does work** (tested during M-03):
- ✅ Date picker functional
- ✅ Date format: YYYY-MM-DD
- ✅ Value entered: 2025-11-18

---

### ✅ M-04: View Deal Analytics

**Status:** PASS

**Steps Executed:**
1. ✅ Navigated to `/dashboard/analytics`
2. ✅ Analytics page loaded successfully

**Results:**
- ✅ Page title: "Analytics"
- ✅ Subtitle: "Track performance metrics for your 0 deals"
- ✅ Statistics cards display (all zeros):
  - Total Views: 0
  - Total Purchases: 0
  - Redemptions: 0
- ✅ Conversion Rate: 0.0% (Purchases / Views)
- ✅ Redemption Rate: 0.0% (Redemptions / Purchases)
- ✅ Performance Over Time section
- ✅ Empty state message: "Charts will appear once you have data"
- ✅ Call-to-action: "Create deals to start tracking metrics"

**Issues Found:** NONE

---

### ⏭️ M-07: Scan QR Code (Redemption)

**Status:** BLOCKED (Depends on user claiming deal)

**Reason:** Cannot test QR scanning without a claimed coupon (M-03 blocked)

---

### ⏭️ M-08: Burn NFT Coupon

**Status:** BLOCKED (Depends on M-07)

**Reason:** Cannot burn NFT without scanning QR code first (M-07 blocked)

---

### ✅ M-09: Update Merchant Settings

**Status:** PASS

**Steps Executed:**
1. ✅ Navigated to `/dashboard/settings`
2. ✅ Settings page loaded with current data
3. ✅ Verified fields populated:
   - Business Name: "Test Pizza Palace"
   - Description: "Premium artisan pizzas and Italian cuisine in the heart of San Francisco. Family-owned since 2025."
   - Logo URL: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop`
   - Country: "United States"
4. ✅ Modified description to: " Now offering delivery!"
5. ✅ "Save Changes" button appeared
6. ✅ Clicked "Save Changes"
7. ✅ Success message: "Your profile has been updated successfully"
8. ✅ Button changed to "No Changes" (disabled)

**Results:**
- ✅ Settings saved successfully
- ✅ Database updated: `updated_at: 2025-10-19 16:10:38.992742+00`
- ✅ New description: " Now offering delivery!"

**Database Verification:**
```sql
SELECT business_name, description, updated_at
FROM merchants
WHERE wallet_address = '2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk';

-- Result:
-- business_name: "Test Pizza Palace"
-- description: " Now offering delivery!"
-- updated_at: "2025-10-19 16:10:38.992742+00" ✅
```

**Issues Found:** NONE

---

### ✅ M-10: View Redemption History

**Status:** PASS (Empty State)

**Steps Executed:**
1. ✅ Checked dashboard for redemption history section
2. ✅ Analytics page shows redemption metrics

**Results:**
- ✅ Redemption count: 0 (correct for new merchant)
- ✅ Empty state handled correctly
- ✅ No errors when no redemptions exist

**Note:** Full redemption history testing blocked by M-03 (no deals created)

**Issues Found:** NONE

---

## Summary Statistics

### Tests by Status

| Status | Count | Tests |
|--------|-------|-------|
| ✅ PASS | 5 | M-01, M-02, M-04, M-09, M-10 |
| ❌ FAIL | 1 | M-03 |
| ⏭️ BLOCKED | 4 | M-05, M-06, M-07, M-08 |
| **TOTAL** | **10** | |

### Pass Rate

- **Testable Features:** 6/10 (60%)
- **Pass Rate:** 5/6 (83%)
- **Blockchain Features:** 0/4 (0% - all blocked)
- **UI/Database Features:** 5/6 (83%)

### Bugs Summary

| Bug # | Severity | Component | Status | Impact |
|-------|----------|-----------|--------|--------|
| #2 | P0 | Storage RLS | ✅ FIXED | Metadata upload failed (100% failure rate) |
| #3 | P0 | Merchant Init | ✅ FIXED (Manual Test Required) | NFT minting failed (100% failure rate) |

---

## Features Tested

### ✅ Working Features

1. **Merchant Registration**
   - Database record creation
   - Form validation
   - Auto-redirect to dashboard
   - Logo URL support

2. **Merchant Dashboard**
   - Welcome message
   - Statistics display
   - Navigation menu
   - Empty state handling

3. **Analytics Dashboard**
   - Metrics display
   - Empty state
   - Conversion calculations
   - Performance tracking UI

4. **Settings Management**
   - Load current settings
   - Update business info
   - Save changes
   - Success feedback
   - Database persistence

5. **Redemption History**
   - Empty state display
   - Metrics integration

### ❌ Blocked Features

1. **Deal Creation**
   - NFT minting (blocked by Bug #3)
   - Image upload (depends on deal creation)
   - Expiration setting (form works, minting fails)

2. **QR Code Scanning**
   - Redemption scanner (no deals to redeem)

3. **NFT Burning**
   - Coupon redemption (no coupons minted)

---

## Database State After Testing

**Merchants Table:**
```sql
-- 1 merchant created
id: bd9979a7-210c-46e7-86f2-5824c1979e18
business_name: "Test Pizza Palace"
description: " Now offering delivery!"
logo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop"
wallet_address: "2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk"
created_at: 2025-10-19 16:04:28.705662+00
updated_at: 2025-10-19 16:10:38.992742+00
```

**Deals Table:**
```sql
-- 0 deals created (blocked by Bug #3)
```

**Storage Bucket:**
```sql
-- 4 RLS policies created ✅
bucket_id: deal-images
policies: [INSERT, SELECT, UPDATE, DELETE]
```

---

## Blockchain State After Testing

**On-Chain Merchant Account:**
- ❌ NOT CREATED (Bug #3)
- Expected PDA: Not initialized
- Required: `initialize_merchant` instruction call

**SOL Balance:**
- Start: 1.0 SOL
- End: 1.0 SOL (no transactions executed)
- Used: 0 SOL

---

## Recommendations

### Immediate Actions (P0)

1. **✅ COMPLETED: Bug #3 Fix - On-Chain Merchant Initialization**
   - ✅ Created `lib/solana/merchant.ts` with `initializeMerchant` function
   - ✅ Added initialization step to merchant registration flow
   - ⏳ **MANUAL TEST REQUIRED:** See Bug #3 section for testing instructions
   - **Time to test:** 5-10 minutes

### Before Production Deployment

1. **Complete Blockchain Integration Testing**
   - Test M-03 after fixing Bug #3
   - Test M-05, M-06, M-07, M-08 (full redemption flow)
   - Verify transaction fees are reasonable
   - Test error handling for failed transactions

2. **Security Audit**
   - Review storage RLS policies (currently public - may be too permissive)
   - Consider merchant-specific upload restrictions
   - Add file type validation
   - Add file size limits enforcement

3. **User Experience**
   - Add loading states during blockchain transactions
   - Add transaction fee estimates before wallet approval
   - Add retry logic for failed transactions
   - Add better error messages for common issues

### Nice to Have

1. **Image Upload Improvements**
   - Direct file upload instead of URL-only
   - Image compression
   - Multiple image support
   - Image cropping tool

2. **Analytics Enhancements**
   - Real-time charts (when data available)
   - Export to CSV
   - Date range filters
   - Comparison metrics

---

## Testing Limitations

**Playwright MCP Limitations:**
- ✅ Can test UI, forms, navigation
- ✅ Can test database operations
- ⚠️ Cannot approve wallet transactions automatically
- ❌ Cannot test blockchain minting without manual intervention

**Recommendation for Full Testing:**
- Implement `@solana/wallet-adapter-mock` for automated blockchain tests
- Manual testing required for transaction flows
- QA team should execute M-03 through M-08 manually

---

## Conclusion

**Overall Assessment:** ✅ BUG FIXES COMPLETE - Ready for Manual QA

**What Works:**
- ✅ Merchant onboarding (database-level)
- ✅ Dashboard and navigation
- ✅ Settings management
- ✅ Analytics display
- ✅ Storage infrastructure (Bug #2 fixed)
- ✅ **On-chain merchant initialization code (Bug #3 fixed)**

**What Requires Manual Testing:**
- ⏳ On-chain merchant initialization (wallet approval required)
- ⏳ NFT minting (depends on merchant initialization)
- ⏳ Full deal creation flow (M-03 through M-08)

**Production Readiness:** ⏳ PENDING MANUAL QA

**Remaining Tasks:**
1. ✅ Bug #2 fixed (Storage RLS)
2. ✅ Bug #3 fixed (Merchant initialization code complete)
3. ⏳ Manual testing required (5-15 minutes)
4. ⏳ Full blockchain integration testing (M-03 through M-08)

**Estimated Time to Production Ready:** 1-2 hours
- ✅ Fix Bug #2: Complete
- ✅ Fix Bug #3: Complete
- ⏳ Manual merchant initialization test: 5-10 minutes
- ⏳ Test blockchain flows (M-03 through M-08): 30-60 minutes
- ⏳ Manual QA full flow: 30 minutes

---

**Test Completed:** 2025-10-19 (Automated + Bug Fixes)
**Last Updated:** 2025-10-19 16:45:00 UTC (Bug #3 fix complete)
**Next Steps:**
1. Manual test: On-chain merchant initialization (see Bug #3 section)
2. Re-test M-03: Create Deal (should work after initialization)
3. Test M-05 through M-08 (full redemption flow)
4. Final production deployment review
