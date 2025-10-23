/**
 * Coupon Marketplace - Escrow PDA Architecture
 *
 * Magic Eden style implementation:
 * - NFTs held in program-controlled Escrow PDAs
 * - Claim free coupons via smart contract
 * - Purchase paid coupons atomically (payment + NFT in 1 transaction)
 * - No backend signatures required
 *
 * Bismillah!
 */

import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { NftCoupon } from '@/lib/types/nft_coupon';
import idl from '@/lib/idl/nft_coupon.json';

// Program ID (deployed to devnet)
export const PROGRAM_ID = new PublicKey('RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7');

// Platform wallet for fee collection (2.5%)
export const PLATFORM_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_WALLET || 'HAtDqhYd52qhbRRwZG8xVJVJu3Mfp23xK7vdW5Ube5'
);

/**
 * Result types for marketplace operations
 */
export interface ClaimResult {
  success: boolean;
  signature?: string;
  error?: string;
  solscanUrl?: string;
}

export interface PurchaseResult {
  success: boolean;
  signature?: string;
  error?: string;
  solscanUrl?: string;
}

/**
 * Derive Merchant PDA
 * Seeds: ["merchant", merchant_authority]
 */
export function getMerchantPDA(merchantAuthority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('merchant'), merchantAuthority.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Derive Coupon Data PDA
 * Seeds: ["coupon", nft_mint]
 */
export function getCouponDataPDA(nftMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('coupon'), nftMint.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Derive NFT Escrow PDA
 * Seeds: ["nft_escrow", merchant_pda, nft_mint]
 *
 * This is the program-controlled token account that holds NFTs
 * after they're minted, until claimed/purchased by users.
 */
export function getNFTEscrowPDA(
  merchantPDA: PublicKey,
  nftMint: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('nft_escrow'), merchantPDA.toBuffer(), nftMint.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Claim a free coupon (price = 0)
 *
 * Transfers NFT from Escrow PDA to user's wallet.
 * Uses program-controlled transfer (no backend signature required).
 *
 * @param connection - Solana connection
 * @param wallet - User's wallet
 * @param nftMint - NFT mint address
 * @param merchantAuthority - Merchant's wallet address
 * @returns Result with transaction signature
 */
export async function claimCouponDirect(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: PublicKey,
  merchantAuthority: PublicKey
): Promise<ClaimResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    console.log('[claimCouponDirect] Starting claim...');
    console.log('[claimCouponDirect] NFT Mint:', nftMint.toBase58());
    console.log('[claimCouponDirect] Merchant Authority:', merchantAuthority.toBase58());
    console.log('[claimCouponDirect] User:', wallet.publicKey.toBase58());

    // Create Anchor provider
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as any,
      provider
    );

    // Derive PDAs
    const [merchantPDA] = getMerchantPDA(merchantAuthority);
    const [couponDataPDA] = getCouponDataPDA(nftMint);
    const [nftEscrowPDA] = getNFTEscrowPDA(merchantPDA, nftMint);

    console.log('[claimCouponDirect] Merchant PDA:', merchantPDA.toBase58());
    console.log('[claimCouponDirect] Coupon Data PDA:', couponDataPDA.toBase58());
    console.log('[claimCouponDirect] NFT Escrow PDA:', nftEscrowPDA.toBase58());

    // Get user's token account (will be created if doesn't exist)
    const userTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      wallet.publicKey
    );

    console.log('[claimCouponDirect] User Token Account:', userTokenAccount.toBase58());
    console.log('[claimCouponDirect] Calling claim_coupon instruction...');

    // Call claim_coupon instruction
    const tx = await program.methods
      .claimCoupon()
      .accountsStrict({
        couponData: couponDataPDA,
        merchant: merchantPDA,
        nftEscrow: nftEscrowPDA,
        nftMint: nftMint,
        userTokenAccount: userTokenAccount,
        user: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('[claimCouponDirect] ✅ Transaction successful:', tx);

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet' ? '' : '?cluster=devnet';
    const solscanUrl = `https://solscan.io/tx/${tx}${network}`;

    return {
      success: true,
      signature: tx,
      solscanUrl,
    };
  } catch (error) {
    console.error('[claimCouponDirect] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Purchase a paid coupon (price > 0)
 *
 * Atomic transaction that does 3 things:
 * 1. Transfers SOL from buyer to merchant (97.5%)
 * 2. Transfers SOL from buyer to platform (2.5%)
 * 3. Transfers NFT from Escrow PDA to buyer
 *
 * All steps succeed or fail together (atomicity).
 *
 * @param connection - Solana connection
 * @param wallet - Buyer's wallet
 * @param nftMint - NFT mint address
 * @param merchantAuthority - Merchant's wallet address
 * @returns Result with transaction signature
 */
export async function purchaseCouponDirect(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: PublicKey,
  merchantAuthority: PublicKey
): Promise<PurchaseResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    console.log('[purchaseCouponDirect] Starting purchase...');
    console.log('[purchaseCouponDirect] NFT Mint:', nftMint.toBase58());
    console.log('[purchaseCouponDirect] Merchant Authority:', merchantAuthority.toBase58());
    console.log('[purchaseCouponDirect] Buyer:', wallet.publicKey.toBase58());
    console.log('[purchaseCouponDirect] Platform Wallet:', PLATFORM_WALLET.toBase58());

    // Create Anchor provider
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as any,
      provider
    );

    // Derive PDAs
    const [merchantPDA] = getMerchantPDA(merchantAuthority);
    const [couponDataPDA] = getCouponDataPDA(nftMint);
    const [nftEscrowPDA] = getNFTEscrowPDA(merchantPDA, nftMint);

    console.log('[purchaseCouponDirect] Merchant PDA:', merchantPDA.toBase58());
    console.log('[purchaseCouponDirect] Coupon Data PDA:', couponDataPDA.toBase58());
    console.log('[purchaseCouponDirect] NFT Escrow PDA:', nftEscrowPDA.toBase58());

    // Get buyer's token account (will be created if doesn't exist)
    const buyerTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      wallet.publicKey
    );

    console.log('[purchaseCouponDirect] Buyer Token Account:', buyerTokenAccount.toBase58());
    console.log('[purchaseCouponDirect] Calling purchase_coupon instruction...');

    // Call purchase_coupon instruction (atomic: payment + NFT transfer)
    const tx = await program.methods
      .purchaseCoupon()
      .accountsStrict({
        couponData: couponDataPDA,
        merchant: merchantPDA,
        merchantAuthority: merchantAuthority,
        platformWallet: PLATFORM_WALLET,
        nftEscrow: nftEscrowPDA,
        nftMint: nftMint,
        buyerTokenAccount: buyerTokenAccount,
        buyer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('[purchaseCouponDirect] ✅ Transaction successful:', tx);
    console.log('[purchaseCouponDirect] Atomic transaction complete:');
    console.log('[purchaseCouponDirect]   - SOL payment to merchant (97.5%)');
    console.log('[purchaseCouponDirect]   - SOL payment to platform (2.5%)');
    console.log('[purchaseCouponDirect]   - NFT transferred to buyer');

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet' ? '' : '?cluster=devnet';
    const solscanUrl = `https://solscan.io/tx/${tx}${network}`;

    return {
      success: true,
      signature: tx,
      solscanUrl,
    };
  } catch (error) {
    console.error('[purchaseCouponDirect] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get coupon data from blockchain
 *
 * @param connection - Solana connection
 * @param nftMint - NFT mint address
 * @returns Coupon data or null
 */
export async function getCouponData(
  connection: Connection,
  nftMint: PublicKey
): Promise<any | null> {
  try {
    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: 'confirmed' }
    );

    const program = new Program<NftCoupon>(
      idl as any,
      provider
    );

    const [couponDataPDA] = getCouponDataPDA(nftMint);

    const couponData = await program.account.couponData.fetch(couponDataPDA);

    return couponData;
  } catch (error) {
    console.error('[getCouponData] Error:', error);
    return null;
  }
}

/**
 * Check if NFT is in Escrow PDA
 *
 * @param connection - Solana connection
 * @param merchantAuthority - Merchant's wallet address
 * @param nftMint - NFT mint address
 * @returns Balance (should be 1 if NFT is in escrow, 0 if claimed/purchased)
 */
export async function checkNFTInEscrow(
  connection: Connection,
  merchantAuthority: PublicKey,
  nftMint: PublicKey
): Promise<number> {
  try {
    const [merchantPDA] = getMerchantPDA(merchantAuthority);
    const [nftEscrowPDA] = getNFTEscrowPDA(merchantPDA, nftMint);

    const accountInfo = await connection.getTokenAccountBalance(nftEscrowPDA);

    return parseInt(accountInfo.value.amount);
  } catch (error) {
    console.error('[checkNFTInEscrow] Error:', error);
    return 0;
  }
}
