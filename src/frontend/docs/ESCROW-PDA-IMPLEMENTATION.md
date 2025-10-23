# Escrow PDA Architecture Implementation

**Date:** 2025-10-23
**Status:** In Progress 🚧
**Architecture:** Magic Eden Style - Proper NFT Marketplace

**Bismillah! Implementing production-grade escrow architecture!** 🎯

---

## Why Escrow PDA?

### Current Architecture (DEPRECATED):
```
Merchant creates coupon → NFT in merchant wallet
User claims → Backend signs transfer (centralized ⚠️)
```

### New Architecture (PROPER):
```
Merchant creates coupon → NFT in Escrow PDA (program-controlled)
User claims → Smart contract transfers (decentralized ✅)
User purchases → Atomic: payment + NFT transfer (1 transaction ✅)
```

### Benefits:
- ✅ **Decentralized** - No backend holds private keys
- ✅ **Atomic Transactions** - Payment + NFT transfer together
- ✅ **Industry Standard** - Matches Magic Eden, Tensor, OpenSea
- ✅ **Secure** - Smart contract logic controls everything
- ✅ **Impressive** - Shows professional Web3 engineering

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  Escrow PDA Architecture (Production-Grade)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CREATE COUPON (initialize_merchant + create_coupon)     │
│     ┌──────────────────────────────────────┐               │
│     │ Merchant → create_coupon instruction │               │
│     │ NFT minted to Escrow PDA             │               │
│     │ Seeds: ["nft_escrow", merchant, mint] │               │
│     │ Authority: Program (PDA)             │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  2. CLAIM FREE COUPON (claim_coupon - NEW)                  │
│     ┌──────────────────────────────────────┐               │
│     │ User → claim_coupon instruction      │               │
│     │ Smart contract transfers:            │               │
│     │   Escrow PDA → User Wallet           │               │
│     │ No payment required                  │               │
│     │ Records event in coupon_data         │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  3. PURCHASE PAID COUPON (purchase_coupon - NEW)            │
│     ┌──────────────────────────────────────┐               │
│     │ User → purchase_coupon instruction   │               │
│     │ ATOMIC TRANSACTION:                  │               │
│     │   1. SOL: User → Merchant (97.5%)    │               │
│     │   2. SOL: User → Platform (2.5%)     │               │
│     │   3. NFT: Escrow PDA → User          │               │
│     │ ALL OR NOTHING ✅                    │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  4. REDEEM COUPON (redeem_coupon - EXISTING)                │
│     ┌──────────────────────────────────────┐               │
│     │ Merchant → redeem_coupon instruction │               │
│     │ Burns NFT from user wallet           │               │
│     │ Updates coupon_data redemptions      │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  5. UPDATE STATUS (update_coupon_status - EXISTING)         │
│     ┌──────────────────────────────────────┐               │
│     │ Merchant → update_status instruction │               │
│     │ Activates/deactivates coupon         │               │
│     └──────────────────────────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Smart Contract Modifications (4-5 hours)

#### 1.1 Modify `create_coupon.rs`
**File:** `src/nft_coupon/programs/nft_coupon/src/instructions/create_coupon.rs`

**Changes:**
- [ ] Add `nft_escrow` PDA account (seeds: `["nft_escrow", merchant.key(), nft_mint.key()]`)
- [ ] Change mint destination from `merchant_authority` to `nft_escrow`
- [ ] Ensure PDA is its own authority (`token::authority = nft_escrow`)
- [ ] Update CreateV1CpiBuilder and MintV1CpiBuilder to use escrow

**Before:**
```rust
// Line 156: Minted to merchant
.token_owner(Some(&ctx.accounts.merchant_authority.to_account_info()))
```

**After:**
```rust
// Mint to Escrow PDA
.token_owner(Some(&ctx.accounts.nft_escrow.to_account_info()))
```

---

#### 1.2 Create `claim_coupon.rs` (NEW)
**File:** `src/nft_coupon/programs/nft_coupon/src/instructions/claim_coupon.rs`

**Purpose:** Free coupon claim (Escrow PDA → User)

**Accounts:**
```rust
#[derive(Accounts)]
pub struct ClaimCoupon<'info> {
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump,
        has_one = merchant,
        constraint = coupon_data.is_active @ CouponError::CouponInactive,
        constraint = coupon_data.price == 0 @ CouponError::NotFreeCoupon,
    )]
    pub coupon_data: Account<'info, CouponData>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump,
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = nft_escrow,
    )]
    pub nft_escrow: Account<'info, TokenAccount>,

    /// CHECK: NFT mint
    pub nft_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
```

**Handler:**
```rust
pub fn handler(ctx: Context<ClaimCoupon>) -> Result<()> {
    // Validate expiry
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        ctx.accounts.coupon_data.expiry_date > current_time,
        CouponError::CouponExpired
    );

    // Get PDA signer seeds
    let merchant_key = ctx.accounts.merchant.key();
    let mint_key = ctx.accounts.nft_mint.key();
    let bump = ctx.bumps.nft_escrow;
    let seeds = &[
        b"nft_escrow",
        merchant_key.as_ref(),
        mint_key.as_ref(),
        &[bump],
    ];
    let signer = &[&seeds[..]];

    // Transfer NFT from Escrow PDA to User
    let cpi_accounts = Transfer {
        from: ctx.accounts.nft_escrow.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.nft_escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, 1)?;

    // Update coupon data
    let coupon_data = &mut ctx.accounts.coupon_data;
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::NoRedemptionsRemaining)?;

    msg!("Coupon claimed by user: {}", ctx.accounts.user.key());

    Ok(())
}
```

**Status:** [ ] Not started

---

#### 1.3 Create `purchase_coupon.rs` (NEW)
**File:** `src/nft_coupon/programs/nft_coupon/src/instructions/purchase_coupon.rs`

**Purpose:** Paid coupon purchase with atomic payment + NFT transfer

**Accounts:**
```rust
#[derive(Accounts)]
pub struct PurchaseCoupon<'info> {
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump,
        has_one = merchant,
        constraint = coupon_data.is_active @ CouponError::CouponInactive,
        constraint = coupon_data.price > 0 @ CouponError::NotPaidCoupon,
    )]
    pub coupon_data: Account<'info, CouponData>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump,
    )]
    pub merchant: Account<'info, Merchant>,

    /// CHECK: Merchant authority wallet (receives payment)
    #[account(mut)]
    pub merchant_authority: UncheckedAccount<'info>,

    /// CHECK: Platform fee wallet
    #[account(mut)]
    pub platform_wallet: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = nft_escrow,
    )]
    pub nft_escrow: Account<'info, TokenAccount>,

    /// CHECK: NFT mint
    pub nft_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
```

**Handler:**
```rust
pub fn handler(ctx: Context<PurchaseCoupon>) -> Result<()> {
    let coupon_data = &ctx.accounts.coupon_data;

    // Validate expiry
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        coupon_data.expiry_date > current_time,
        CouponError::CouponExpired
    );

    // Calculate payment splits (price stored in lamports)
    let total_price = coupon_data.price;
    let platform_fee = (total_price * 25) / 1000; // 2.5%
    let merchant_amount = total_price - platform_fee;

    // ATOMIC TRANSACTION STEP 1: Pay merchant (97.5%)
    let transfer_merchant_ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &ctx.accounts.merchant_authority.key(),
        merchant_amount,
    );
    anchor_lang::solana_program::program::invoke(
        &transfer_merchant_ix,
        &[
            ctx.accounts.buyer.to_account_info(),
            ctx.accounts.merchant_authority.to_account_info(),
        ],
    )?;

    // ATOMIC TRANSACTION STEP 2: Pay platform (2.5%)
    let transfer_platform_ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &ctx.accounts.platform_wallet.key(),
        platform_fee,
    );
    anchor_lang::solana_program::program::invoke(
        &transfer_platform_ix,
        &[
            ctx.accounts.buyer.to_account_info(),
            ctx.accounts.platform_wallet.to_account_info(),
        ],
    )?;

    // ATOMIC TRANSACTION STEP 3: Transfer NFT from Escrow to Buyer
    let merchant_key = ctx.accounts.merchant.key();
    let mint_key = ctx.accounts.nft_mint.key();
    let bump = ctx.bumps.nft_escrow;
    let seeds = &[
        b"nft_escrow",
        merchant_key.as_ref(),
        mint_key.as_ref(),
        &[bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.nft_escrow.to_account_info(),
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.nft_escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, 1)?;

    // Update coupon data
    let coupon_data = &mut ctx.accounts.coupon_data;
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::NoRedemptionsRemaining)?;

    msg!(
        "Coupon purchased by {}: {} lamports paid",
        ctx.accounts.buyer.key(),
        total_price
    );

    Ok(())
}
```

**Status:** [ ] Not started

---

#### 1.4 Update `state.rs`
**File:** `src/nft_coupon/programs/nft_coupon/src/state.rs`

**Add price field to CouponData:**
```rust
#[account]
pub struct CouponData {
    pub mint: Pubkey,
    pub merchant: Pubkey,
    pub discount_percentage: u8,
    pub expiry_date: i64,
    pub category: CouponCategory,
    pub redemptions_remaining: u8,
    pub max_redemptions: u8,
    pub is_active: bool,
    pub price: u64, // ← ADD THIS: price in lamports (0 = free)
    pub bump: u8,
}

impl CouponData {
    pub const LEN: usize = 8 + // discriminator
        32 + // mint
        32 + // merchant
        1 +  // discount_percentage
        8 +  // expiry_date
        1 +  // category
        1 +  // redemptions_remaining
        1 +  // max_redemptions
        1 +  // is_active
        8 +  // price (NEW)
        1;   // bump
}
```

**Status:** [ ] Not started

---

#### 1.5 Update `lib.rs`
**File:** `src/nft_coupon/programs/nft_coupon/src/lib.rs`

**Add new instructions:**
```rust
pub mod instructions;
pub use instructions::*;

#[program]
pub mod nft_coupon {
    use super::*;

    // EXISTING
    pub fn initialize_merchant(ctx: Context<InitializeMerchant>, business_name: String) -> Result<()> {
        instructions::initialize_merchant::handler(ctx, business_name)
    }

    pub fn create_coupon(
        ctx: Context<CreateCoupon>,
        title: String,
        description: String,
        discount_percentage: u8,
        expiry_date: i64,
        category: CouponCategory,
        max_redemptions: u8,
        metadata_uri: String,
        price: u64, // ← ADD THIS parameter
    ) -> Result<()> {
        instructions::create_coupon::handler(
            ctx,
            title,
            description,
            discount_percentage,
            expiry_date,
            category,
            max_redemptions,
            metadata_uri,
            price,
        )
    }

    // NEW INSTRUCTIONS
    pub fn claim_coupon(ctx: Context<ClaimCoupon>) -> Result<()> {
        instructions::claim_coupon::handler(ctx)
    }

    pub fn purchase_coupon(ctx: Context<PurchaseCoupon>) -> Result<()> {
        instructions::purchase_coupon::handler(ctx)
    }

    // EXISTING
    pub fn redeem_coupon(ctx: Context<RedeemCoupon>) -> Result<()> {
        instructions::redeem_coupon::handler(ctx)
    }

    pub fn update_coupon_status(ctx: Context<UpdateCouponStatus>, is_active: bool) -> Result<()> {
        instructions::update_coupon_status::handler(ctx, is_active)
    }
}
```

**Status:** [ ] Not started

---

#### 1.6 Update `errors.rs`
**File:** `src/nft_coupon/programs/nft_coupon/src/errors.rs`

**Add new errors:**
```rust
#[error_code]
pub enum CouponError {
    // ... existing errors

    #[msg("This coupon is not free")]
    NotFreeCoupon,

    #[msg("This coupon requires payment")]
    NotPaidCoupon,

    #[msg("Insufficient payment amount")]
    InsufficientPayment,
}
```

**Status:** [ ] Not started

---

### Phase 2: Build & Deploy (30 min)

#### 2.1 Build Contract
```bash
cd src/nft_coupon
anchor build
```

**Status:** [ ] Not started

---

#### 2.2 Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

**Note:** This will generate a NEW program ID. Need to update:
- `Anchor.toml`
- `lib.rs` (declare_id!)
- Frontend: `NEXT_PUBLIC_NFT_PROGRAM_ID`

**Status:** [ ] Not started

---

### Phase 3: Frontend Integration (3-4 hours)

#### 3.1 Update Deal Creation
**File:** `src/frontend/app/(merchant)/dashboard/create/page.tsx`

**Changes:**
- Add `price` field to form (0 = free, >0 = paid)
- Pass `price` to `createCouponDirect()` function

**Status:** [ ] Not started

---

#### 3.2 Update Free Claim Flow
**File:** `src/frontend/app/(user)/marketplace/[id]/page.tsx`

**Before:**
```typescript
// Calls backend API
const transferResponse = await fetch('/api/nft/transfer', {
  method: 'POST',
  body: JSON.stringify({ nftMint, fromWallet, toWallet, ... })
});
```

**After:**
```typescript
// Calls smart contract claim_coupon instruction
const signature = await claimCouponDirect(
  connection,
  wallet,
  nftMint
);
```

**Status:** [ ] Not started

---

#### 3.3 Update Paid Purchase Flow
**File:** `src/frontend/components/payments/PurchaseModal.tsx`

**Before:**
```typescript
// Step 1: SOL payment transaction
const paymentTx = await sendTransaction(...);

// Step 2: Backend NFT transfer
const transferResponse = await fetch('/api/nft/transfer', ...);
```

**After:**
```typescript
// ONE atomic transaction: payment + NFT transfer
const signature = await purchaseCouponDirect(
  connection,
  wallet,
  nftMint,
  merchantWallet,
  platformWallet
);
// Done! ✅
```

**Status:** [ ] Not started

---

#### 3.4 Create New Frontend Functions
**File:** `src/frontend/lib/solana/coupon-marketplace.ts` (NEW)

**Functions to create:**
```typescript
export async function claimCouponDirect(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: string
): Promise<ClaimResult>

export async function purchaseCouponDirect(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: string,
  merchantWallet: string,
  platformWallet: string
): Promise<PurchaseResult>
```

**Status:** [ ] Not started

---

### Phase 4: Testing (1-2 hours)

#### 4.1 Test All 4 Instructions
- [ ] `initialize_merchant` - Merchant registration
- [ ] `create_coupon` - NFT minted to Escrow PDA
- [ ] `claim_coupon` - Free coupon claim (verify NFT in wallet)
- [ ] `purchase_coupon` - Paid purchase (verify payment + NFT)
- [ ] `redeem_coupon` - Burn NFT
- [ ] `update_coupon_status` - Activate/deactivate

**Status:** [ ] Not started

---

#### 4.2 Verify On-Chain
- [ ] Check NFT in Escrow PDA after create_coupon
- [ ] Check NFT in user wallet after claim/purchase
- [ ] Verify payment splits on Solscan
- [ ] Verify NFT burned after redemption

**Status:** [ ] Not started

---

## Time Estimate

| Phase | Task | Time |
|-------|------|------|
| 1.1 | Modify create_coupon | 1 hour |
| 1.2 | Create claim_coupon | 1.5 hours |
| 1.3 | Create purchase_coupon | 2 hours |
| 1.4-1.6 | Update state, lib, errors | 30 min |
| 2 | Build & deploy | 30 min |
| 3 | Frontend integration | 3 hours |
| 4 | Testing | 1.5 hours |
| **Total** | **End-to-End** | **10 hours** |

**Realistic estimate:** 10-12 hours with debugging

---

## Success Criteria

### ✅ All 4 Instructions Working:
1. `initialize_merchant` - Merchant registration on-chain
2. `create_coupon` - NFT minted to Escrow PDA
3. `redeem_coupon` - NFT burned from user wallet
4. `update_coupon_status` - Activate/deactivate coupons

### ✅ NFT Flows Working:
- Free claim: Escrow PDA → User (no payment)
- Paid purchase: Atomic (payment + NFT transfer)
- All verifiable on Solscan

### ✅ Production Architecture:
- Decentralized (no backend keys)
- Atomic transactions
- Industry standard pattern

---

## Next Steps

1. **Start with Smart Contract** (Phase 1)
2. **Build & Deploy** (Phase 2)
3. **Frontend Integration** (Phase 3)
4. **Test Everything** (Phase 4)
5. **Demo for Hackathon** 🚀

**Ready to implement?** Bismillah, let's build! 💪

---

**Status:** 🚧 In Progress
**Current Task:** Smart Contract Modifications

**MashaAllah! This will be impressive!** ✨
