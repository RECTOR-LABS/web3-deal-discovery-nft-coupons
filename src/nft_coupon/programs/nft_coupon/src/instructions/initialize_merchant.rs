use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(business_name: String)]
pub struct InitializeMerchant<'info> {
    #[account(
        init,
        payer = authority,
        space = Merchant::LEN,
        seeds = [b"merchant", authority.key().as_ref()],
        bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeMerchant>,
    business_name: String,
) -> Result<()> {
    require!(
        business_name.len() <= Merchant::MAX_NAME_LEN,
        CouponError::BusinessNameTooLong
    );

    let merchant = &mut ctx.accounts.merchant;
    merchant.authority = ctx.accounts.authority.key();
    merchant.business_name = business_name;
    merchant.total_coupons_created = 0;
    merchant.bump = ctx.bumps.merchant;

    msg!("Merchant initialized: {}", merchant.business_name);

    Ok(())
}
