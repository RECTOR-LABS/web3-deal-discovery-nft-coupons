# PAID Coupon Bug Fix - ConstraintTokenOwner Error

**Date:** 2025-10-23
**Status:** ✅ FIXED & DEPLOYED
**Issue:** PAID coupon purchases failing with ConstraintTokenOwner error (#2015)

---

## Problem Summary

### Issue
User created "Deal 99" (39% OFF, 0.001 SOL price) and attempted purchase, which failed with:
```
ConstraintTokenOwner
Error Code: ConstraintTokenOwner
Error Number: 2015
Error Message: A token owner constraint was violated
```

### Why FREE Coupons Worked But PAID Coupons Failed

The smart contract had **inconsistent authority expectations** between two instructions:

**`claim_coupon` (FREE coupons) - Line 47:**
```rust
token::authority = merchant,  // ✅ Expects Merchant PDA as authority
```

**`purchase_coupon` (PAID coupons) - Line 60:**
```rust
token::authority = nft_escrow,  // ❌ Expects NFT Escrow PDA itself as authority
```

**`create_coupon` sets authority - Line 197:**
```rust
authority: ctx.accounts.merchant.to_account_info(),  // Sets Merchant PDA
```

**Result:**
- ✅ FREE coupons worked (authority matched: both expected `merchant` PDA)
- ❌ PAID coupons failed (authority mismatch: `create_coupon` set `merchant`, but `purchase_coupon` expected `nft_escrow`)

---

## Root Cause Analysis

### File: `src/nft_coupon/programs/nft_coupon/src/instructions/purchase_coupon.rs`

**BEFORE (Incorrect):**
```rust
#[account(
    mut,
    seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
    bump,
    token::mint = nft_mint,
    token::authority = nft_escrow,  // ❌ Expected authority = self (nft_escrow PDA)
)]
pub nft_escrow: Account<'info, TokenAccount>,
```

When Anchor validates this constraint, it checks:
```rust
if nft_escrow.owner != nft_escrow.key() {
    return Err(ConstraintTokenOwner); // ERROR 2015
}
```

But `create_coupon` had set:
```rust
nft_escrow.owner = merchant.key();  // Authority was Merchant PDA
```

This mismatch triggered the ConstraintTokenOwner error.

---

## The Fix

### Change 1: Update `nft_escrow` constraint

**File:** `src/nft_coupon/programs/nft_coupon/src/instructions/purchase_coupon.rs:60`

```diff
#[account(
    mut,
    seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
    bump,
    token::mint = nft_mint,
-    token::authority = nft_escrow,  // ❌ Incorrect
+    token::authority = merchant,    // ✅ Matches create_coupon setup
)]
pub nft_escrow: Account<'info, TokenAccount>,
```

### Change 2: Update NFT transfer logic

**File:** `src/nft_coupon/programs/nft_coupon/src/instructions/purchase_coupon.rs:156-177`

**BEFORE (Incorrect):**
```rust
// Get PDA signer seeds for escrow
let merchant_key = ctx.accounts.merchant.key();
let mint_key = ctx.accounts.nft_mint.key();
let bump = ctx.bumps.nft_escrow;
let seeds = &[
    b"nft_escrow".as_ref(),
    merchant_key.as_ref(),
    mint_key.as_ref(),
    &[bump],
];
let signer = &[&seeds[..]];

// Transfer NFT using PDA authority
let cpi_accounts = Transfer {
    from: ctx.accounts.nft_escrow.to_account_info(),
    to: ctx.accounts.buyer_token_account.to_account_info(),
    authority: ctx.accounts.nft_escrow.to_account_info(),  // ❌ Wrong authority
};
```

**AFTER (Correct):**
```rust
// Get PDA signer seeds for merchant (the escrow's authority)
let authority_key = ctx.accounts.merchant.authority.key();
let merchant_bump = ctx.bumps.merchant;
let merchant_seeds = &[
    b"merchant".as_ref(),
    authority_key.as_ref(),
    &[merchant_bump],
];
let signer = &[&merchant_seeds[..]];

// Transfer NFT from Escrow PDA to Buyer's wallet
// This uses the Merchant PDA as authority (program-controlled transfer)
let cpi_accounts = Transfer {
    from: ctx.accounts.nft_escrow.to_account_info(),
    to: ctx.accounts.buyer_token_account.to_account_info(),
    authority: ctx.accounts.merchant.to_account_info(),  // ✅ Correct authority
};
```

---

## Deployment Details

**Contract Upgrade:**
- Program ID: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7` (same - upgraded)
- Network: Solana Devnet
- Transaction: `57Yq7to6xiu6ngTuzn3XyA7a1bJefsBiU6jWcPLkBeHPD5zPSJPH1BAQxhGvLRUeURwRYMrCgomWnC3nAtLdXKZp`

**Build Output:**
```bash
Compiling nft_coupon v0.1.0
Finished `release` profile [optimized] target(s) in 3.65s
Deploy success
```

**IDL Updated:**
- Copied to: `src/frontend/lib/idl/nft_coupon.json`
- Frontend now uses updated program interface

---

## Testing Instructions

### Prerequisites
1. ✅ Smart contract rebuilt and deployed
2. ✅ Frontend IDL updated
3. ⏳ Dev server running on port 3000

### Test Case: Create and Purchase PAID Coupon

**Step 1: Create PAID Coupon (Merchant Wallet)**
1. Switch Phantom to merchant wallet: `HAtD7rZQ...swRUbz5`
2. Navigate to `/dashboard/create`
3. Create deal:
   - Title: "PAID Coupon Test - Post Fix"
   - Discount: 50%
   - **Price: 0.001 SOL** (set as PAID)
   - Category: Food
   - Expiry: +7 days
4. Click "Create Deal" and confirm transaction
5. Wait for NFT mint transaction to finalize

**Step 2: Purchase PAID Coupon (User A Wallet)**
1. Switch Phantom to User A wallet: `2jLo7yCW...h1MaLk`
2. Navigate to `/marketplace`
3. Find the newly created PAID coupon
4. Click "Get Coupon" (will show 0.001 SOL price)
5. Confirm purchase in Phantom wallet
6. **Expected:** ✅ Transaction succeeds
7. **Expected:** NFT appears in User A's `/coupons` page

### Success Criteria
- ✅ No ConstraintTokenOwner error
- ✅ Atomic transaction completes (SOL payment + NFT transfer)
- ✅ Console logs show:
  ```
  [purchaseCouponDirect] ✅ Transaction successful: <signature>
  [purchaseCouponDirect] Atomic transaction complete:
  [purchaseCouponDirect]   - SOL payment to merchant (97.5%)
  [purchaseCouponDirect]   - SOL payment to platform (2.5%)
  [purchaseCouponDirect]   - NFT transferred to buyer
  ```
- ✅ NFT visible in `/coupons` (blockchain-first query)
- ✅ Purchase event recorded in database

---

## Architecture Notes

### NFT Escrow Authority Pattern

**Current Design (After Fix):**
```
create_coupon:
  ├─ Creates nft_escrow token account
  ├─ Sets authority: Merchant PDA
  └─ Transfers NFT to escrow

claim_coupon (FREE):
  ├─ Validates: token::authority = merchant
  └─ Transfers NFT using Merchant PDA signer seeds

purchase_coupon (PAID):
  ├─ Validates: token::authority = merchant
  ├─ Transfers SOL to merchant (97.5%)
  ├─ Transfers SOL to platform (2.5%)
  └─ Transfers NFT using Merchant PDA signer seeds
```

**Why Merchant PDA as Authority?**
- Merchant PDA is a Program Derived Address controlled by the smart contract
- The program can sign on behalf of Merchant PDA using seeds: `["merchant", merchant_authority, bump]`
- This enables **program-controlled transfers** without backend signatures
- Consistent pattern across both FREE and PAID coupon flows

---

## Files Modified

| File | Changes | Status |
|------|---------|--------|
| `src/nft_coupon/programs/nft_coupon/src/instructions/purchase_coupon.rs` | 2 edits (constraint + transfer logic) | ✅ Fixed |
| `src/frontend/lib/idl/nft_coupon.json` | Updated IDL from rebuild | ✅ Deployed |

---

## Next Steps

1. ⏳ **Test PAID coupon purchase** (follow test instructions above)
2. ⏳ **Verify transaction on Solscan** (devnet)
3. ⏳ **Document successful test** in E2E test results
4. ⏳ **Update CLAUDE.md** with fix status

---

## Summary

**Bug:** ConstraintTokenOwner error (#2015) blocking PAID coupon purchases
**Cause:** Authority constraint mismatch between `create_coupon` and `purchase_coupon`
**Fix:** Aligned `purchase_coupon` to match `claim_coupon` pattern (Merchant PDA as authority)
**Status:** ✅ Fixed, built, deployed to devnet
**Ready:** YES - awaiting testing confirmation

**Alhamdulillah!** 🚀

---

**Deployment Transaction:**
https://solscan.io/tx/57Yq7to6xiu6ngTuzn3XyA7a1bJefsBiU6jWcPLkBeHPD5zPSJPH1BAQxhGvLRUeURwRYMrCgomWnC3nAtLdXKZp?cluster=devnet
