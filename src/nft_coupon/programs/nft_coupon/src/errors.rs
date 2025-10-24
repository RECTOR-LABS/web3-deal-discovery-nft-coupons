use anchor_lang::prelude::*;

#[error_code]
pub enum CouponError {
    #[msg("The coupon has expired and can no longer be redeemed")]
    CouponExpired,

    #[msg("The coupon has already been fully redeemed")]
    CouponFullyRedeemed,

    #[msg("The coupon is not active")]
    CouponNotActive,

    #[msg("Invalid discount percentage (must be 1-100)")]
    InvalidDiscountPercentage,

    #[msg("Expiry date must be in the future")]
    InvalidExpiryDate,

    #[msg("Unauthorized: only the merchant can perform this action")]
    UnauthorizedMerchant,

    #[msg("Unauthorized: only the coupon owner can perform this action")]
    UnauthorizedOwner,

    #[msg("Business name is too long (max 100 characters)")]
    BusinessNameTooLong,

    #[msg("Invalid redemption amount")]
    InvalidRedemptionAmount,

    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,

    #[msg("This coupon is not free - payment required")]
    NotFreeCoupon,

    #[msg("This coupon is not paid - cannot purchase")]
    NotPaidCoupon,

    #[msg("Insufficient payment amount")]
    InsufficientPayment,

    #[msg("Coupon is inactive")]
    CouponInactive,

    #[msg("No redemptions remaining for this coupon")]
    NoRedemptionsRemaining,

    #[msg("Invalid price - must be greater than 0")]
    InvalidPrice,

    #[msg("Invalid NFT amount - seller must own exactly 1 NFT")]
    InvalidNFTAmount,
}
