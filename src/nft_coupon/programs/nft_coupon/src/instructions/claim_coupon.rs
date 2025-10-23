use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::state::*;
use crate::errors::*;

/// Claim a free coupon NFT from the Escrow PDA
///
/// This instruction allows users to claim free coupons (price = 0).
/// The NFT is transferred from the Escrow PDA (program-controlled)
/// to the user's wallet atomically.
#[derive(Accounts)]
pub struct ClaimCoupon<'info> {
    /// Coupon data account (PDA derived from NFT mint address)
    /// Validates:
    /// - Coupon is active
    /// - Coupon is free (price = 0)
    /// - Not expired
    #[account(
        mut,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump,
        has_one = merchant @ CouponError::UnauthorizedMerchant,
        constraint = coupon_data.is_active @ CouponError::CouponInactive,
        constraint = coupon_data.price == 0 @ CouponError::NotFreeCoupon,
    )]
    pub coupon_data: Account<'info, CouponData>,

    /// Merchant account (PDA derived from merchant authority)
    #[account(
        mut,
        seeds = [b"merchant", merchant.authority.as_ref()],
        bump,
    )]
    pub merchant: Account<'info, Merchant>,

    /// NFT Escrow PDA - holds NFTs minted by create_coupon
    /// Seeds: ["nft_escrow", merchant_pda, nft_mint]
    /// Authority: Merchant PDA (program-controlled via merchant)
    #[account(
        mut,
        seeds = [b"nft_escrow", merchant.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = merchant,
    )]
    pub nft_escrow: Account<'info, TokenAccount>,

    /// NFT mint account
    pub nft_mint: Account<'info, Mint>,

    /// User's associated token account (created if not exists)
    /// This is where the NFT will be transferred
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    /// User claiming the coupon (pays for token account creation if needed)
    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimCoupon>) -> Result<()> {
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

    // Get PDA signer seeds for merchant (the escrow's authority)
    let authority_key = ctx.accounts.merchant.authority.key();
    let merchant_bump = ctx.bumps.merchant;
    let merchant_seeds = &[
        b"merchant".as_ref(),
        authority_key.as_ref(),
        &[merchant_bump],
    ];
    let signer = &[&merchant_seeds[..]];

    // Transfer NFT from Escrow PDA to User's wallet
    // This uses the Merchant PDA as authority (program-controlled transfer)
    let cpi_accounts = Transfer {
        from: ctx.accounts.nft_escrow.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.merchant.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, 1)?;

    // Update coupon data - decrement redemptions remaining
    let coupon_data = &mut ctx.accounts.coupon_data;
    coupon_data.redemptions_remaining = coupon_data
        .redemptions_remaining
        .checked_sub(1)
        .ok_or(CouponError::ArithmeticOverflow)?;

    msg!(
        "Free coupon claimed! NFT {} transferred to user {}",
        ctx.accounts.nft_mint.key(),
        ctx.accounts.user.key()
    );

    Ok(())
}
