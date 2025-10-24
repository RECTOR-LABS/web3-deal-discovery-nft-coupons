use anchor_lang::prelude::*;

declare_id!("RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7");

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

#[program]
pub mod nft_coupon {
    use super::*;

    /// Initialize a merchant account
    /// Merchants must register before creating coupons
    pub fn initialize_merchant(
        ctx: Context<InitializeMerchant>,
        business_name: String,
    ) -> Result<()> {
        instructions::initialize_merchant::handler(ctx, business_name)
    }

    /// Create a new NFT coupon
    /// Mints an NFT with Metaplex metadata and creates coupon data
    /// NFT is minted to Escrow PDA (program-controlled)
    pub fn create_coupon(
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

    /// Claim a free coupon (price = 0)
    /// Transfers NFT from Escrow PDA to user
    /// Magic Eden style: Program-controlled transfer, no backend signature
    pub fn claim_coupon(ctx: Context<ClaimCoupon>) -> Result<()> {
        instructions::claim_coupon::handler(ctx)
    }

    /// Purchase a paid coupon (price > 0)
    /// Atomic transaction: SOL payment + NFT transfer
    /// - User pays SOL (97.5% merchant, 2.5% platform)
    /// - NFT transferred from Escrow PDA to buyer
    /// - All or nothing (transaction fails if any step fails)
    pub fn purchase_coupon(ctx: Context<PurchaseCoupon>) -> Result<()> {
        instructions::purchase_coupon::handler(ctx)
    }

    /// Redeem a coupon
    /// Burns the NFT or decrements redemption counter
    pub fn redeem_coupon(ctx: Context<RedeemCoupon>) -> Result<()> {
        instructions::redeem_coupon::handler(ctx)
    }

    /// Update coupon active status
    /// Allows merchant to deactivate/reactivate a coupon
    pub fn update_coupon_status(
        ctx: Context<UpdateCouponStatus>,
        is_active: bool,
    ) -> Result<()> {
        instructions::update_coupon_status::handler(ctx, is_active)
    }

    /// Transfer NFT coupon between users (P2P resale)
    /// Atomic transaction: SOL payment + NFT transfer
    /// - Buyer pays SOL (97.5% to seller, 2.5% to platform)
    /// - Seller transfers NFT to buyer
    /// - All or nothing (transaction fails if any step fails)
    /// - No escrow PDA required (direct P2P swap)
    pub fn transfer_coupon(
        ctx: Context<TransferCoupon>,
        price_lamports: u64,
    ) -> Result<()> {
        instructions::transfer_coupon::handler(ctx, price_lamports)
    }

    /// List NFT coupon for resale (Step 1 of escrow-based resale)
    /// Transfers NFT from seller's wallet to Resale Escrow PDA
    /// Seller signs this transaction
    /// Industry-standard approach used by Magic Eden, OpenSea, Tensor
    pub fn list_for_resale(ctx: Context<ListForResale>) -> Result<()> {
        instructions::list_for_resale::handler(ctx)
    }

    /// Purchase NFT coupon from resale marketplace (Step 2 of escrow-based resale)
    /// Atomic transaction: SOL payment + NFT transfer from escrow
    /// - Buyer pays SOL (97.5% to seller, 2.5% to platform)
    /// - NFT transferred from Resale Escrow PDA to buyer
    /// - Seller does NOT need to sign (NFT already in escrow)
    /// - All or nothing (transaction fails if any step fails)
    pub fn purchase_from_resale(
        ctx: Context<PurchaseFromResale>,
        price_lamports: u64,
    ) -> Result<()> {
        instructions::purchase_from_resale::handler(ctx, price_lamports)
    }
}
