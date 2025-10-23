use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::state::*;
use crate::errors::*;

/// Purchase a paid coupon NFT with atomic payment + NFT transfer
///
/// This instruction handles paid coupons in ONE atomic transaction:
/// 1. User pays SOL (97.5% to merchant, 2.5% to platform)
/// 2. NFT transferred from Escrow PDA to user
/// 3. All or nothing (transaction fails if any step fails)
#[derive(Accounts)]
pub struct PurchaseCoupon<'info> {
    /// Coupon data account (PDA derived from NFT mint address)
    /// Validates:
    /// - Coupon is active
    /// - Coupon requires payment (price > 0)
    /// - Not expired
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump,
        has_one = merchant @ CouponError::UnauthorizedMerchant,
        constraint = coupon_data.is_active @ CouponError::CouponInactive,
        constraint = coupon_data.price > 0 @ CouponError::NotPaidCoupon,
    )]
    pub coupon_data: Account<'info, CouponData>,

    /// Merchant account (PDA derived from merchant authority)
    #[account(
        mut,
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump,
    )]
    pub merchant: Account<'info, Merchant>,

    /// Merchant authority wallet - receives 97.5% of payment
    /// CHECK: Validated by merchant.authority constraint
    #[account(mut)]
    pub merchant_authority: UncheckedAccount<'info>,

    /// Platform fee wallet - receives 2.5% of payment
    /// CHECK: Platform wallet address (configurable)
    #[account(mut)]
    pub platform_wallet: UncheckedAccount<'info>,

    /// NFT Escrow PDA - holds NFTs minted by create_coupon
    /// Seeds: ["nft_escrow", merchant_pda, nft_mint]
    /// Authority: The PDA itself (self-custodial)
    #[account(
        mut,
        seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = nft_escrow,
    )]
    pub nft_escrow: Account<'info, TokenAccount>,

    /// NFT mint account
    pub nft_mint: Account<'info, Mint>,

    /// Buyer's associated token account (created if not exists)
    /// This is where the NFT will be transferred
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    /// Buyer purchasing the coupon
    /// Pays for: SOL payment + token account creation (if needed) + transaction fees
    #[account(mut)]
    pub buyer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<PurchaseCoupon>) -> Result<()> {
    let coupon_data = &ctx.accounts.coupon_data;

    // Validate expiry date
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        coupon_data.expiry_date > current_time,
        CouponError::CouponExpired
    );

    // Validate redemptions remaining
    require!(
        coupon_data.redemptions_remaining > 0,
        CouponError::NoRedemptionsRemaining
    );

    // Calculate payment splits
    // Price is stored in lamports (1 SOL = 1,000,000,000 lamports)
    let total_price = coupon_data.price;
    let platform_fee = (total_price
        .checked_mul(25)
        .ok_or(CouponError::ArithmeticOverflow)?)
        .checked_div(1000)
        .ok_or(CouponError::ArithmeticOverflow)?; // 2.5%
    let merchant_amount = total_price
        .checked_sub(platform_fee)
        .ok_or(CouponError::ArithmeticOverflow)?; // 97.5%

    msg!(
        "Purchase: Total {} lamports | Merchant {} | Platform {}",
        total_price,
        merchant_amount,
        platform_fee
    );

    // ATOMIC TRANSACTION STEP 1: Transfer SOL to merchant (97.5%)
    let transfer_merchant_ix = system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &ctx.accounts.merchant_authority.key(),
        merchant_amount,
    );
    invoke(
        &transfer_merchant_ix,
        &[
            ctx.accounts.buyer.to_account_info(),
            ctx.accounts.merchant_authority.to_account_info(),
        ],
    )?;

    msg!("✅ Merchant paid: {} lamports", merchant_amount);

    // ATOMIC TRANSACTION STEP 2: Transfer SOL to platform (2.5%)
    if platform_fee > 0 {
        let transfer_platform_ix = system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.platform_wallet.key(),
            platform_fee,
        );
        invoke(
            &transfer_platform_ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.platform_wallet.to_account_info(),
            ],
        )?;

        msg!("✅ Platform fee paid: {} lamports", platform_fee);
    }

    // ATOMIC TRANSACTION STEP 3: Transfer NFT from Escrow PDA to Buyer
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
        authority: ctx.accounts.nft_escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, 1)?;

    msg!(
        "✅ NFT {} transferred to buyer {}",
        ctx.accounts.nft_mint.key(),
        ctx.accounts.buyer.key()
    );

    // Update coupon data - decrement redemptions remaining
    let coupon_data = &mut ctx.accounts.coupon_data;
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::ArithmeticOverflow)?;

    msg!(
        "🎉 Purchase complete! Buyer: {} | Price: {} lamports | Merchant: {} | Platform: {}",
        ctx.accounts.buyer.key(),
        total_price,
        merchant_amount,
        platform_fee
    );

    Ok(())
}
