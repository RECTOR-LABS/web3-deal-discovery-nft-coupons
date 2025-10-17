use anchor_lang::prelude::*;

/// Merchant account - PDA to track merchant info and coupon creation
#[account]
pub struct Merchant {
    /// Merchant's wallet address (authority)
    pub authority: Pubkey,
    /// Business name
    pub business_name: String,
    /// Total coupons created by this merchant
    pub total_coupons_created: u64,
    /// Bump seed for PDA
    pub bump: u8,
}

impl Merchant {
    pub const MAX_NAME_LEN: usize = 100;

    /// Calculate space needed for Merchant account
    /// 8 (discriminator) + 32 (pubkey) + 4 + MAX_NAME_LEN (string) + 8 (u64) + 1 (u8)
    pub const LEN: usize = 8 + 32 + 4 + Self::MAX_NAME_LEN + 8 + 1;
}

/// Coupon metadata structure
/// This data is stored on-chain and linked to the NFT
#[account]
pub struct CouponData {
    /// Mint address of the NFT coupon
    pub mint: Pubkey,
    /// Merchant who created this coupon
    pub merchant: Pubkey,
    /// Discount percentage (0-100)
    pub discount_percentage: u8,
    /// Expiry date (Unix timestamp)
    pub expiry_date: i64,
    /// Category of the deal
    pub category: CouponCategory,
    /// Redemptions remaining (0 = fully redeemed)
    pub redemptions_remaining: u8,
    /// Original number of redemptions allowed
    pub max_redemptions: u8,
    /// Whether the coupon is still active
    pub is_active: bool,
    /// Bump seed for PDA
    pub bump: u8,
}

impl CouponData {
    /// Calculate space needed for CouponData account
    /// 8 (discriminator) + 32 (mint) + 32 (merchant) + 1 (u8) + 8 (i64) + 1 (enum) + 1 (u8) + 1 (u8) + 1 (bool) + 1 (bump)
    pub const LEN: usize = 8 + 32 + 32 + 1 + 8 + 1 + 1 + 1 + 1 + 1;
}

/// Coupon categories for filtering and organization
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum CouponCategory {
    FoodAndBeverage,
    Retail,
    Services,
    Travel,
    Entertainment,
    Other,
}

impl Default for CouponCategory {
    fn default() -> Self {
        CouponCategory::Other
    }
}
