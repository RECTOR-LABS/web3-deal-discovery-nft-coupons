use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::errors::*;

/// Peer-to-peer NFT coupon transfer with payment
///
/// This instruction enables resale marketplace functionality:
/// - Buyer pays SOL (97.5% to seller, 2.5% to platform)
/// - Seller transfers NFT to buyer
/// - All happens atomically in ONE transaction
///
/// NO ESCROW PDA REQUIRED - Direct P2P atomic swap
#[derive(Accounts)]
pub struct TransferCoupon<'info> {
    /// NFT mint account
    pub nft_mint: Account<'info, Mint>,

    /// Seller's token account (source) - must have amount = 1 (owns NFT)
    #[account(
        mut,
        token::mint = nft_mint,
        token::authority = seller,
        constraint = seller_token_account.amount == 1 @ CouponError::InvalidNFTAmount,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    /// Buyer's token account (destination) - created if not exists
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    /// Seller - receives 97.5% of payment
    /// CHECK: Validated by token account constraint
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,

    /// Buyer - pays for NFT + token account creation + transaction fees
    #[account(mut)]
    pub buyer: Signer<'info>,

    /// Platform fee wallet - receives 2.5% of payment
    /// CHECK: Platform wallet address (configurable)
    #[account(mut)]
    pub platform_wallet: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<TransferCoupon>, price_lamports: u64) -> Result<()> {
    // Validate price
    require!(price_lamports > 0, CouponError::InvalidPrice);

    // Calculate payment splits
    let platform_fee = (price_lamports
        .checked_mul(25)
        .ok_or(CouponError::ArithmeticOverflow)?)
        .checked_div(1000)
        .ok_or(CouponError::ArithmeticOverflow)?; // 2.5%
    let seller_amount = price_lamports
        .checked_sub(platform_fee)
        .ok_or(CouponError::ArithmeticOverflow)?; // 97.5%

    msg!(
        "P2P Transfer: Price {} lamports | Seller {} | Platform {}",
        price_lamports,
        seller_amount,
        platform_fee
    );

    // ATOMIC TRANSACTION STEP 1: Transfer SOL to seller (97.5%)
    let transfer_seller_ix = system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &ctx.accounts.seller.key(),
        seller_amount,
    );
    invoke(
        &transfer_seller_ix,
        &[
            ctx.accounts.buyer.to_account_info(),
            ctx.accounts.seller.to_account_info(),
        ],
    )?;

    msg!("✅ Seller paid: {} lamports", seller_amount);

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

    // ATOMIC TRANSACTION STEP 3: Transfer NFT from Seller to Buyer
    let cpi_accounts = Transfer {
        from: ctx.accounts.seller_token_account.to_account_info(),
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, 1)?;

    msg!(
        "✅ NFT {} transferred from seller {} to buyer {}",
        ctx.accounts.nft_mint.key(),
        ctx.accounts.seller.key(),
        ctx.accounts.buyer.key()
    );

    msg!(
        "🎉 P2P Transfer complete! Buyer: {} | Seller: {} | Price: {} lamports | Marketplace fee: {}",
        ctx.accounts.buyer.key(),
        ctx.accounts.seller.key(),
        price_lamports,
        platform_fee
    );

    Ok(())
}
