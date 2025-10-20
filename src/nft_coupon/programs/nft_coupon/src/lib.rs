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
    pub fn create_coupon(
        ctx: Context<CreateCoupon>,
        title: String,
        description: String,
        discount_percentage: u8,
        expiry_date: i64,
        category: CouponCategory,
        max_redemptions: u8,
        metadata_uri: String,
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
        )
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
}
