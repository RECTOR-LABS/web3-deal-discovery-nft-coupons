use anchor_lang::prelude::*;
use anchor_spl::{
    token::{burn, Burn, Mint, Token, TokenAccount},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct RedeemCoupon<'info> {
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump = coupon_data.bump
    )]
    pub coupon_data: Account<'info, CouponData>,

    #[account(
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = nft_token_account.mint == nft_mint.key(),
        constraint = nft_token_account.owner == user.key()
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<RedeemCoupon>) -> Result<()> {
    let coupon_data = &mut ctx.accounts.coupon_data;

    // Validate coupon is active
    require!(coupon_data.is_active, CouponError::CouponNotActive);

    // Validate coupon hasn't expired
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        coupon_data.expiry_date > current_time,
        CouponError::CouponExpired
    );

    // Validate redemptions remaining
    require!(
        coupon_data.redemptions_remaining > 0,
        CouponError::CouponFullyRedeemed
    );

    // Verify user owns the NFT
    require!(
        ctx.accounts.nft_token_account.amount >= 1,
        CouponError::UnauthorizedOwner
    );

    // Decrement redemptions remaining
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::ArithmeticOverflow)?;

    // If single-use or last redemption, burn the NFT
    if coupon_data.max_redemptions == 1 || coupon_data.redemptions_remaining == 0 {
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
        msg!(
            "Coupon redeemed: {} - {} redemptions remaining",
            ctx.accounts.nft_mint.key(),
            coupon_data.redemptions_remaining
        );
    }

    // Emit redemption event
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
