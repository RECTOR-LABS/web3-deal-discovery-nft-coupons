use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

/// List an NFT coupon for resale
///
/// This instruction transfers the NFT from the seller's wallet to a Resale Escrow PDA,
/// where it will be held until purchased or delisted.
///
/// This is the industry-standard approach used by Magic Eden, OpenSea, Tensor, etc.
///
/// Flow:
/// 1. Seller lists NFT (this instruction) - NFT transferred to Resale Escrow PDA
/// 2. Buyer purchases (purchase_from_resale instruction) - NFT transferred from escrow to buyer
#[derive(Accounts)]
pub struct ListForResale<'info> {
    /// NFT mint account
    pub nft_mint: Account<'info, Mint>,

    /// Seller's token account (source) - must have amount = 1 (owns NFT)
    #[account(
        mut,
        token::mint = nft_mint,
        token::authority = seller,
        constraint = seller_token_account.amount == 1 @ ListingError::SellerDoesNotOwnNFT,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    /// Resale Escrow PDA - holds NFT until purchased or delisted
    /// Seeds: ["resale_escrow", nft_mint, seller]
    /// Authority: Resale Escrow PDA itself (self-custodial)
    #[account(
        init_if_needed,
        payer = seller,
        seeds = [b"resale_escrow", nft_mint.key().as_ref(), seller.key().as_ref()],
        bump,
        token::mint = nft_mint,
        token::authority = resale_escrow,
    )]
    pub resale_escrow: Account<'info, TokenAccount>,

    /// Seller - owns the NFT and lists it for resale
    #[account(mut)]
    pub seller: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ListForResale>) -> Result<()> {
    // Transfer NFT from seller's wallet to Resale Escrow PDA
    let cpi_accounts = Transfer {
        from: ctx.accounts.seller_token_account.to_account_info(),
        to: ctx.accounts.resale_escrow.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, 1)?;

    msg!(
        "✅ NFT {} listed for resale by seller {}",
        ctx.accounts.nft_mint.key(),
        ctx.accounts.seller.key()
    );
    msg!("   NFT transferred to Resale Escrow PDA");

    Ok(())
}

#[error_code]
pub enum ListingError {
    #[msg("Seller does not own the NFT (amount != 1)")]
    SellerDoesNotOwnNFT,
}
