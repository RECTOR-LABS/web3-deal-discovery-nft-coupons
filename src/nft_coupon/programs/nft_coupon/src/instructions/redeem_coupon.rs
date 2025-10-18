use anchor_lang::prelude::*;
use anchor_spl::{
    token::{burn, Burn, Mint, Token, TokenAccount},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct RedeemCoupon<'info> {
    /// Coupon data account (PDA derived from NFT mint)
    /// Seeds: ["coupon", nft_mint_pubkey]
    /// Tracks redemptions remaining and active status
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump = coupon_data.bump
    )]
    pub coupon_data: Account<'info, CouponData>,

    /// Merchant account (PDA derived from merchant authority)
    /// Seeds: ["merchant", merchant_authority_pubkey]
    /// Used for event logging and analytics
    #[account(
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    /// NFT mint account (must match coupon_data.mint)
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,

    /// User's token account holding the NFT
    /// Validates ownership via mint and owner constraints
    #[account(
        mut,
        constraint = nft_token_account.mint == nft_mint.key(),
        constraint = nft_token_account.owner == user.key()
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    /// User redeeming the coupon (must own the NFT)
    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<RedeemCoupon>) -> Result<()> {
    let coupon_data = &mut ctx.accounts.coupon_data;

    // Security checks: Validate coupon state before redemption

    // 1. Coupon must be active (merchant can deactivate via update_coupon_status)
    require!(coupon_data.is_active, CouponError::CouponNotActive);

    // 2. Coupon must not be expired (checked against on-chain clock)
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        coupon_data.expiry_date > current_time,
        CouponError::CouponExpired
    );

    // 3. Coupon must have redemptions remaining (prevents double-spend)
    require!(
        coupon_data.redemptions_remaining > 0,
        CouponError::CouponFullyRedeemed
    );

    // 4. User must own the NFT (verified by token account constraints + amount check)
    require!(
        ctx.accounts.nft_token_account.amount >= 1,
        CouponError::UnauthorizedOwner
    );

    // Decrement redemption counter atomically (prevents overflow attacks)
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::ArithmeticOverflow)?;

    // Multi-use coupon support (bonus feature beyond requirements):
    // - Single-use (max_redemptions=1): Burn NFT immediately
    // - Multi-use (max_redemptions>1): Keep NFT until last redemption
    // This allows "buy 5 coffees, get 1 free" style coupons
    if coupon_data.max_redemptions == 1 || coupon_data.redemptions_remaining == 0 {
        // CPI: Burn NFT to prevent reuse
        // Burns from user's token account, requires user signature
        burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.nft_mint.to_account_info(),
                    from: ctx.accounts.nft_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            1, // Burn 1 NFT
        )?;

        msg!(
            "Coupon redeemed and NFT burned: {}",
            ctx.accounts.nft_mint.key()
        );
    } else {
        // Multi-use: NFT remains in wallet for future redemptions
        msg!(
            "Coupon redeemed: {} - {} redemptions remaining",
            ctx.accounts.nft_mint.key(),
            coupon_data.redemptions_remaining
        );
    }

    // Emit redemption event for off-chain analytics and indexing
    // Used by frontend to display redemption history and merchant analytics
    emit!(RedemptionEvent {
        nft_mint: ctx.accounts.nft_mint.key(),
        merchant: coupon_data.merchant,
        user: ctx.accounts.user.key(),
        redemptions_remaining: coupon_data.redemptions_remaining,
        timestamp: current_time,
    });

    Ok(())
}

#[event]
pub struct RedemptionEvent {
    pub nft_mint: Pubkey,
    pub merchant: Pubkey,
    pub user: Pubkey,
    pub redemptions_remaining: u8,
    pub timestamp: i64,
}
