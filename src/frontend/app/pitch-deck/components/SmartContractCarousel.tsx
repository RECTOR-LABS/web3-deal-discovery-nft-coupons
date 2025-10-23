'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, Shield, Coins, ShoppingCart, CheckCircle, RefreshCw, ArrowRightLeft } from 'lucide-react';

const contractInstructions = [
  {
    id: 1,
    filename: 'initialize_merchant.rs',
    title: 'Initialize Merchant',
    description: 'Register merchant account on-chain with PDA',
    icon: Shield,
    category: 'Setup',
    code: `pub fn handler(
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
}`,
  },
  {
    id: 2,
    filename: 'create_coupon.rs',
    title: 'Create Coupon (Metaplex v5)',
    description: 'Mint NFT coupon with metadata to Escrow PDA',
    icon: Coins,
    category: 'Minting',
    code: `pub fn handler(
    ctx: Context<CreateCoupon>,
    name: String,
    discount_percent: u8,
    expiry: i64,
    price: u64,
) -> Result<()> {
    // Create NFT with Metaplex v5
    create_v1(
        CpiContext::new_with_signer(
            ctx.accounts.mpl_core_program.to_account_info(),
            CreateV1 {
                asset: ctx.accounts.nft_mint.to_account_info(),
                collection: None,
                authority: Some(ctx.accounts.merchant.to_account_info()),
                payer: ctx.accounts.merchant_authority.to_account_info(),
                /* ... */
            },
            &[merchant_seeds],
        ),
        CreateV1Args {
            name: name.clone(),
            uri: metadata_uri,
            plugins: vec![/* ... */],
        },
    )?;

    // Initialize coupon data PDA
    let coupon = &mut ctx.accounts.coupon_data;
    coupon.merchant = ctx.accounts.merchant.key();
    coupon.nft_mint = ctx.accounts.nft_mint.key();
    coupon.discount_percent = discount_percent;
    coupon.expiry = expiry;
    coupon.price = price;
    coupon.is_active = true;

    Ok(())
}`,
  },
  {
    id: 3,
    filename: 'claim_coupon.rs',
    title: 'Claim Coupon (FREE)',
    description: 'Transfer FREE coupon from Escrow PDA to user wallet',
    icon: CheckCircle,
    category: 'User Action',
    code: `pub fn handler(ctx: Context<ClaimCoupon>) -> Result<()> {
    let coupon = &ctx.accounts.coupon_data;

    // Verify coupon is free
    require!(
        coupon.price == 0,
        CouponError::NotFreeCoupon
    );
    require!(
        coupon.is_active,
        CouponError::CouponInactive
    );

    // Transfer NFT from Escrow PDA to user
    let merchant_seeds = &[
        b"merchant",
        ctx.accounts.merchant.authority.as_ref(),
        &[ctx.accounts.merchant.bump],
    ];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.nft_escrow.to_account_info(),
                to: ctx.accounts.user_nft_account.to_account_info(),
                authority: ctx.accounts.merchant.to_account_info(),
            },
            &[merchant_seeds],
        ),
        1, // NFT amount
    )?;

    msg!("Coupon claimed by user: {}", ctx.accounts.user.key());
    Ok(())
}`,
  },
  {
    id: 4,
    filename: 'purchase_coupon.rs',
    title: 'Purchase Coupon (PAID)',
    description: 'Buy PAID coupon with SOL, NFT from Escrow to user',
    icon: ShoppingCart,
    category: 'User Action',
    code: `pub fn handler(ctx: Context<PurchaseCoupon>) -> Result<()> {
    let coupon = &ctx.accounts.coupon_data;

    // Verify coupon requires payment
    require!(
        coupon.price > 0,
        CouponError::NotPaidCoupon
    );

    // Transfer SOL from user to merchant
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.merchant_authority.key(),
        coupon.price,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.merchant_authority.to_account_info(),
        ],
    )?;

    // Transfer NFT from Escrow to user (same as claim_coupon)
    let merchant_seeds = &[/* ... */];
    token::transfer(
        CpiContext::new_with_signer(/* ... */, &[merchant_seeds]),
        1,
    )?;

    msg!("Coupon purchased for {} lamports", coupon.price);
    Ok(())
}`,
  },
  {
    id: 5,
    filename: 'redeem_coupon.rs',
    title: 'Redeem Coupon',
    description: 'Burn NFT after merchant verification',
    icon: Code,
    category: 'Redemption',
    code: `pub fn handler(ctx: Context<RedeemCoupon>) -> Result<()> {
    let coupon = &ctx.accounts.coupon_data;

    // Verify ownership & expiration
    require!(
        ctx.accounts.user_nft_account.owner == ctx.accounts.user.key(),
        CouponError::Unauthorized
    );
    require!(
        Clock::get()?.unix_timestamp < coupon.expiry,
        CouponError::CouponExpired
    );

    // Burn NFT (close account, reclaim rent)
    token::close_account(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::CloseAccount {
                account: ctx.accounts.user_nft_account.to_account_info(),
                destination: ctx.accounts.user.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
    )?;

    emit!(RedemptionEvent {
        merchant: coupon.merchant,
        user: ctx.accounts.user.key(),
        coupon_id: ctx.accounts.nft_mint.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("Coupon redeemed and burned");
    Ok(())
}`,
  },
  {
    id: 6,
    filename: 'update_coupon_status.rs',
    title: 'Update Coupon Status',
    description: 'Merchant toggles active/inactive state',
    icon: RefreshCw,
    category: 'Management',
    code: `pub fn handler(
    ctx: Context<UpdateCouponStatus>,
    is_active: bool,
) -> Result<()> {
    // Verify merchant ownership
    require!(
        ctx.accounts.coupon_data.merchant == ctx.accounts.merchant.key(),
        CouponError::UnauthorizedMerchant
    );

    let coupon = &mut ctx.accounts.coupon_data;
    coupon.is_active = is_active;

    msg!(
        "Coupon status updated to: {}",
        if is_active { "ACTIVE" } else { "INACTIVE" }
    );

    Ok(())
}`,
  },
  {
    id: 7,
    filename: 'list_for_resale.rs',
    title: 'List for Resale (Epic 13)',
    description: 'Transfer NFT to Resale Escrow PDA for secondary market',
    icon: ArrowRightLeft,
    category: 'Resale',
    code: `pub fn handler(
    ctx: Context<ListForResale>,
    resale_price: u64,
) -> Result<()> {
    require!(
        resale_price > 0,
        CouponError::InvalidResalePrice
    );

    // Transfer NFT from user to Resale Escrow PDA
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_nft_account.to_account_info(),
                to: ctx.accounts.resale_escrow.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        1,
    )?;

    // Create resale listing PDA
    let listing = &mut ctx.accounts.resale_listing;
    listing.seller = ctx.accounts.user.key();
    listing.nft_mint = ctx.accounts.nft_mint.key();
    listing.price = resale_price;
    listing.is_active = true;

    msg!("Listed for resale at {} lamports", resale_price);
    Ok(())
}`,
  },
  {
    id: 8,
    filename: 'purchase_from_resale.rs',
    title: 'Purchase from Resale (Epic 13)',
    description: 'Atomic swap: SOL payment + NFT from Resale Escrow',
    icon: ShoppingCart,
    category: 'Resale',
    code: `pub fn handler(ctx: Context<PurchaseFromResale>) -> Result<()> {
    let listing = &ctx.accounts.resale_listing;

    require!(listing.is_active, CouponError::ResaleListingInactive);

    // Calculate fees (2.5% platform fee)
    let platform_fee = (listing.price * 25) / 1000;
    let seller_amount = listing.price - platform_fee;

    // Transfer SOL to seller (97.5%)
    let ix_seller = system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &listing.seller,
        seller_amount,
    );
    invoke(&ix_seller, &[/* ... */])?;

    // Transfer platform fee (2.5%)
    let ix_fee = system_instruction::transfer(
        &ctx.accounts.buyer.key(),
        &ctx.accounts.platform_fee_account.key(),
        platform_fee,
    );
    invoke(&ix_fee, &[/* ... */])?;

    // Transfer NFT from Resale Escrow to buyer
    token::transfer(
        CpiContext::new_with_signer(/* ... */),
        1,
    )?;

    msg!("Resale purchase complete");
    Ok(())
}`,
  },
  {
    id: 9,
    filename: 'transfer_coupon.rs',
    title: 'Transfer Coupon (Deprecated)',
    description: 'P2P transfer - replaced by escrow model',
    icon: ArrowRightLeft,
    category: 'Legacy',
    code: `// DEPRECATED: Use list_for_resale + purchase_from_resale instead
// This direct P2P transfer is replaced by the escrow-based
// resale marketplace for better security and atomicity.

pub fn handler(ctx: Context<TransferCoupon>) -> Result<()> {
    // Simple P2P transfer (no escrow, no fees)
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_account.to_account_info(),
                to: ctx.accounts.to_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        ),
        1,
    )?;

    msg!("Coupon transferred (deprecated method)");
    Ok(())
}

// Note: This instruction is kept for backward compatibility
// but new implementations should use the resale marketplace.`,
  },
];

export default function SmartContractCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? contractInstructions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === contractInstructions.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentInstruction = contractInstructions[currentIndex];
  const IconComponent = currentInstruction.icon;

  return (
    <div className="w-full">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-[#0d2a13] mb-3">
          Smart Contract Architecture
        </h3>
        <p className="text-[#0d2a13]/70 text-lg">
          9 production instructions powering the entire NFT coupon lifecycle
        </p>
      </motion.div>

      {/* Main Code Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#0d2a13] rounded-2xl overflow-hidden border-2 border-[#00ff4d]/30 mb-6 shadow-2xl"
      >
        {/* Code Header */}
        <div className="bg-[#00ff4d]/20 px-6 py-3 border-b border-[#00ff4d]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ff4d]/30 rounded-lg">
                <IconComponent className="w-5 h-5 text-[#00ff4d]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#00ff4d]" />
                  <span className="font-mono text-sm text-[#f2eecb] font-semibold">
                    {currentInstruction.filename}
                  </span>
                </div>
                <p className="text-xs text-[#f2eecb]/60 mt-0.5">
                  {currentInstruction.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#00ff4d] text-[#0d2a13] text-xs font-bold rounded-full">
                {currentInstruction.category}
              </span>
              <span className="text-[#f2eecb]/60 text-sm font-mono">
                {currentIndex + 1}/9
              </span>
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.pre
              key={currentInstruction.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 overflow-x-auto text-sm leading-relaxed max-h-96"
            >
              <code className="text-[#f2eecb]/90 font-mono whitespace-pre">
                {currentInstruction.code}
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center -translate-y-1/2 pointer-events-none z-20">
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto w-10 h-10 bg-[#00ff4d]/90 hover:bg-[#00ff4d] rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[#0d2a13]" />
          </motion.button>
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto w-10 h-10 bg-[#00ff4d]/90 hover:bg-[#00ff4d] rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[#0d2a13]" />
          </motion.button>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {contractInstructions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-12 bg-[#00ff4d]'
                  : 'w-8 bg-[#f2eecb]/30 hover:bg-[#f2eecb]/50'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Instruction Grid Navigation */}
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {contractInstructions.map((instruction, index) => {
          const Icon = instruction.icon;
          return (
            <motion.button
              key={instruction.id}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#00ff4d] bg-[#00ff4d]/20 shadow-lg shadow-[#00ff4d]/50'
                  : 'border-[#0d2a13]/20 bg-white hover:border-[#00ff4d]/50'
              }`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <Icon
                  className={`w-5 h-5 mb-1 ${
                    index === currentIndex ? 'text-[#00ff4d]' : 'text-[#0d2a13]/60'
                  }`}
                />
                <span
                  className={`text-xs font-semibold text-center leading-tight ${
                    index === currentIndex ? 'text-[#0d2a13]' : 'text-[#0d2a13]/60'
                  }`}
                >
                  {instruction.title.split(' ')[0]}
                </span>
                {index === currentIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#00ff4d] rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-3 h-3 text-[#0d2a13]" fill="currentColor" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Instruction Details */}
      <motion.div
        key={currentInstruction.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 bg-gradient-to-br from-[#00ff4d]/10 to-[#0d2a13]/5 rounded-xl p-6 border border-[#00ff4d]/20"
      >
        <h4 className="text-lg font-bold text-[#0d2a13] mb-2">
          {currentInstruction.title}
        </h4>
        <p className="text-sm text-[#0d2a13]/70 mb-4">
          {currentInstruction.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-[#0d2a13]/60">
          <span className="px-2 py-1 bg-[#0d2a13]/10 rounded">
            Category: {currentInstruction.category}
          </span>
          <span className="px-2 py-1 bg-[#0d2a13]/10 rounded">
            Instruction {currentIndex + 1} of 9
          </span>
          <span className="px-2 py-1 bg-[#0d2a13]/10 rounded">
            Anchor Framework 0.32.1
          </span>
        </div>
      </motion.div>
    </div>
  );
}
