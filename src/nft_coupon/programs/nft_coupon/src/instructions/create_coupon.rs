use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use mpl_token_metadata::{
    instructions::{CreateV1CpiBuilder, MintV1CpiBuilder},
    types::{PrintSupply, TokenStandard},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct CreateCoupon<'info> {
    /// Merchant account (PDA derived from merchant authority)
    /// Seeds: ["merchant", merchant_authority_pubkey]
    /// Validates that the merchant authority owns this merchant account
    #[account(
        mut,
        seeds = [b"merchant", merchant_authority.key().as_ref()],
        bump,
        has_one = authority @ CouponError::UnauthorizedMerchant
    )]
    pub merchant: Account<'info, Merchant>,

    /// Coupon data account (PDA derived from NFT mint address)
    /// Seeds: ["coupon", nft_mint_pubkey]
    /// Stores discount %, expiry date, category, redemption tracking, price
    #[account(
        init,
        payer = merchant_authority,
        space = CouponData::LEN,
        seeds = [b"coupon", nft_mint.key().as_ref()],
        bump
    )]
    pub coupon_data: Account<'info, CouponData>,

    /// CHECK: Merchant's token account (ATA) - temporary holder for initial mint
    /// NFT will be minted here first, then transferred to escrow
    /// This account is validated and created by Metaplex MintV1 CPI automatically
    /// We cannot use init_if_needed here because the NFT mint doesn't exist yet
    #[account(mut)]
    pub merchant_token_account: UncheckedAccount<'info>,

    /// CHECK: NFT Escrow PDA - holds NFTs after minting (program-controlled)
    /// Seeds: ["nft_escrow", merchant_pda, nft_mint]
    /// Authority: Merchant PDA (program can sign on behalf of merchant)
    /// This account will be created manually after NFT mint exists
    /// We cannot use init here because nft_mint doesn't exist yet during account validation
    #[account(mut)]
    pub nft_escrow: UncheckedAccount<'info>,

    /// NFT mint account
    #[account(mut)]
    pub nft_mint: Signer<'info>,

    /// CHECK: Metadata account - validated by Metaplex CPI
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,

    /// CHECK: Master Edition account - Metaplex derives PDA but needs account for writing
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    #[account(mut)]
    pub merchant_authority: Signer<'info>,

    /// CHECK: This is the authority that will own the mint
    pub authority: UncheckedAccount<'info>,

    /// CHECK: Token Metadata Program
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    /// CHECK: Sysvar Instructions - required by Metaplex for authorization delegation
    #[account(address = anchor_lang::solana_program::sysvar::instructions::ID)]
    pub sysvar_instructions: UncheckedAccount<'info>,
}

pub fn handler(
    ctx: Context<CreateCoupon>,
    title: String,
    description: String,
    discount_percentage: u8,
    expiry_date: i64,
    category: CouponCategory,
    max_redemptions: u8,
    metadata_uri: String,
    price: u64, // NEW: Price in lamports (0 = free, >0 = paid)
) -> Result<()> {
    // Validate inputs
    require!(
        discount_percentage > 0 && discount_percentage <= 100,
        CouponError::InvalidDiscountPercentage
    );

    let current_time = Clock::get()?.unix_timestamp;
    require!(
        expiry_date > current_time,
        CouponError::InvalidExpiryDate
    );

    require!(
        max_redemptions > 0,
        CouponError::InvalidRedemptionAmount
    );

    // Initialize coupon data with validated parameters
    let coupon_data = &mut ctx.accounts.coupon_data;
    coupon_data.mint = ctx.accounts.nft_mint.key();
    coupon_data.merchant = ctx.accounts.merchant.key();
    coupon_data.discount_percentage = discount_percentage;
    coupon_data.expiry_date = expiry_date;
    coupon_data.category = category;
    coupon_data.redemptions_remaining = max_redemptions;
    coupon_data.max_redemptions = max_redemptions;
    coupon_data.is_active = true;
    coupon_data.price = price; // NEW: Store price
    coupon_data.bump = ctx.bumps.coupon_data;

    // Truncate title to Metaplex's 32-character limit
    let nft_name = if title.len() > 32 {
        title.chars().take(32).collect::<String>()
    } else {
        title
    };

    // CPI: Create Metaplex NFT metadata using Token Metadata v5.0.0
    // - NonFungible token standard (unique NFT, not semi-fungible)
    // - PrintSupply::Limited(1) allows exactly 1 print (the original NFT)
    // - This preserves mint authority so we can mint the token after creation
    CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program.to_account_info())
        .metadata(&ctx.accounts.metadata_account.to_account_info())
        .master_edition(Some(&ctx.accounts.master_edition.to_account_info()))
        .mint(&ctx.accounts.nft_mint.to_account_info(), true)
        .authority(&ctx.accounts.merchant_authority.to_account_info())
        .payer(&ctx.accounts.merchant_authority.to_account_info())
        .update_authority(&ctx.accounts.merchant_authority.to_account_info(), true)
        .system_program(&ctx.accounts.system_program.to_account_info())
        .sysvar_instructions(&ctx.accounts.sysvar_instructions.to_account_info())
        .spl_token_program(Some(&ctx.accounts.token_program.to_account_info()))
        .name(nft_name)
        .uri(metadata_uri)
        .seller_fee_basis_points(0)
        .token_standard(TokenStandard::NonFungible)
        .print_supply(PrintSupply::Limited(1))
        .invoke()?;

    // Now that NFT mint exists, create the escrow token account
    // Derive PDA for nft_escrow
    let merchant_key = ctx.accounts.merchant.key();
    let mint_key = ctx.accounts.nft_mint.key();
    let escrow_seeds = &[
        b"nft_escrow",
        merchant_key.as_ref(),
        mint_key.as_ref(),
    ];
    let (_escrow_pda, escrow_bump) = Pubkey::find_program_address(escrow_seeds, ctx.program_id);

    // Create the escrow token account
    let rent = Rent::get()?;
    let space = anchor_spl::token::TokenAccount::LEN;

    let escrow_signer_seeds: &[&[&[u8]]] = &[&[
        b"nft_escrow",
        merchant_key.as_ref(),
        mint_key.as_ref(),
        &[escrow_bump],
    ]];

    anchor_lang::system_program::create_account(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::CreateAccount {
                from: ctx.accounts.merchant_authority.to_account_info(),
                to: ctx.accounts.nft_escrow.to_account_info(),
            },
            escrow_signer_seeds,
        ),
        rent.minimum_balance(space),
        space as u64,
        &ctx.accounts.token_program.key(),
    )?;

    // Initialize the token account
    anchor_spl::token::initialize_account3(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::InitializeAccount3 {
                account: ctx.accounts.nft_escrow.to_account_info(),
                mint: ctx.accounts.nft_mint.to_account_info(),
                authority: ctx.accounts.merchant.to_account_info(),
            },
        ),
    )?;

    // CPI: Mint exactly 1 NFT to merchant's token account using Metaplex MintV1
    // We mint to merchant's ATA first (simpler, no PDA signing needed)
    // Then transfer to escrow PDA in the next step
    MintV1CpiBuilder::new(&ctx.accounts.token_metadata_program.to_account_info())
        .token(&ctx.accounts.merchant_token_account.to_account_info()) // Mint to merchant ATA
        .token_owner(Some(&ctx.accounts.merchant_authority.to_account_info())) // Owner: merchant
        .metadata(&ctx.accounts.metadata_account.to_account_info())
        .master_edition(Some(&ctx.accounts.master_edition.to_account_info()))
        .mint(&ctx.accounts.nft_mint.to_account_info())
        .authority(&ctx.accounts.merchant_authority.to_account_info())
        .payer(&ctx.accounts.merchant_authority.to_account_info())
        .system_program(&ctx.accounts.system_program.to_account_info())
        .sysvar_instructions(&ctx.accounts.sysvar_instructions.to_account_info())
        .spl_token_program(&ctx.accounts.token_program.to_account_info())
        .spl_ata_program(&ctx.accounts.associated_token_program.to_account_info())
        .amount(1) // Mint 1 NFT
        .invoke()?;

    // Transfer NFT from merchant's token account to escrow PDA
    // This locks the NFT under program control until claimed/purchased
    // Use anchor_spl::token::Transfer to move the NFT
    anchor_spl::token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.merchant_token_account.to_account_info(),
                to: ctx.accounts.nft_escrow.to_account_info(),
                authority: ctx.accounts.merchant_authority.to_account_info(),
            },
        ),
        1, // Transfer 1 NFT
    )?;

    // Update merchant stats
    let merchant = &mut ctx.accounts.merchant;
    merchant.total_coupons_created = merchant
        .total_coupons_created
        .checked_add(1)
        .ok_or(CouponError::ArithmeticOverflow)?;

    msg!(
        "NFT Coupon created: {} - {}% discount",
        coupon_data.mint,
        discount_percentage
    );

    Ok(())
}
