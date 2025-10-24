use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::errors::*;

/// Purchase an NFT coupon from resale marketplace
///
/// This instruction handles the atomic purchase of a resale listing:
/// 1. Buyer pays SOL (97.5% to seller, 2.5% to platform)
/// 2. NFT transferred from Resale Escrow PDA to buyer
/// 3. All or nothing (transaction fails if any step fails)
///
/// This is the industry-standard approach used by Magic Eden, OpenSea, Tensor, etc.
#[derive(Accounts)]
pub struct PurchaseFromResale<'info> {
    /// NFT mint account
    pub nft_mint: Account<'info, Mint>,

    /// Resale Escrow PDA - holds NFT until purchased
    /// Seeds: ["resale_escrow", nft_mint, seller]
    /// Authority: Resale Escrow PDA itself (self-custodial, can sign via PDA)
    #[account(
        mut,
        seeds = [b"resale_escrow", nft_mint.key().as_ref(), seller.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = resale_escrow,
        constraint = resale_escrow.amount == 1 @ CouponError::InvalidNFTAmount,
    )]
    pub resale_escrow: Account<'info, TokenAccount>,

    /// Buyer's token account (destination) - created if not exists
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    /// Seller - receives 97.5% of payment
    /// CHECK: Validated by resale_escrow PDA seeds
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

pub fn handler(ctx: Context<PurchaseFromResale>, price_lamports: u64) -> Result<()> {
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
        "Resale Purchase: Price {} lamports | Seller {} | Platform {}",
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

    // ATOMIC TRANSACTION STEP 3: Transfer NFT from Resale Escrow PDA to Buyer
    // Get PDA signer seeds for Resale Escrow
    let nft_mint_key = ctx.accounts.nft_mint.key();
    let seller_key = ctx.accounts.seller.key();
    let bump = ctx.bumps.resale_escrow;
    let seeds = &[
        b"resale_escrow".as_ref(),
        nft_mint_key.as_ref(),
        seller_key.as_ref(),
        &[bump],
    ];
    let signer = &[&seeds[..]];

    // Transfer NFT using Resale Escrow PDA authority
    let cpi_accounts = Transfer {
        from: ctx.accounts.resale_escrow.to_account_info(),
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.resale_escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, 1)?;

    msg!(
        "✅ NFT {} transferred from Resale Escrow to buyer {}",
        ctx.accounts.nft_mint.key(),
        ctx.accounts.buyer.key()
    );

    msg!(
        "🎉 Resale purchase complete! Buyer: {} | Seller: {} | Price: {} lamports | Fee: {}",
        ctx.accounts.buyer.key(),
        ctx.accounts.seller.key(),
        price_lamports,
        platform_fee
    );

    Ok(())
}
