use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct UpdateCouponStatus<'info> {
    #[account(
        seeds = [b"merchant", merchant_authority.key().as_ref()],
        bump = merchant.bump,
        has_one = authority @ CouponError::UnauthorizedMerchant
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"coupon", coupon_data.mint.as_ref()],
        bump = coupon_data.bump,
        constraint = coupon_data.merchant == merchant.key() @ CouponError::UnauthorizedMerchant
    )]
    pub coupon_data: Account<'info, CouponData>,

    /// CHECK: Merchant authority verified via merchant account
    pub authority: UncheckedAccount<'info>,

    pub merchant_authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateCouponStatus>,
    is_active: bool,
) -> Result<()> {
    let coupon_data = &mut ctx.accounts.coupon_data;

    coupon_data.is_active = is_active;

    msg!(
        "Coupon {} status updated: {}",
        coupon_data.mint,
        if is_active { "active" } else { "inactive" }
    );

    Ok(())
}
