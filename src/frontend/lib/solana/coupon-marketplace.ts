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

import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL as _LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, BN, type Idl } from '@coral-xyz/anchor';
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
  (process.env.NEXT_PUBLIC_PLATFORM_WALLET && process.env.NEXT_PUBLIC_PLATFORM_WALLET.trim()) || 'HAtDqhYd52qhbRRwZG8xVJVJu3Mfp23xK7vdW5Ube5'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as Idl,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as Idl,
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
 * List a coupon for resale (escrow-based)
 *
 * Transfers NFT from seller's wallet to Resale Escrow PDA.
 * The NFT will be held in escrow until purchased by a buyer.
 *
 * Industry-standard approach used by Magic Eden, OpenSea, Tensor.
 *
 * @param connection - Solana connection
 * @param wallet - Seller's wallet
 * @param nftMint - NFT mint address
 * @returns Result with transaction signature
 */
export async function listCouponForResale(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: PublicKey
): Promise<ClaimResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    console.log('[listCouponForResale] Starting listing for resale...');
    console.log('[listCouponForResale] NFT Mint:', nftMint.toBase58());
    console.log('[listCouponForResale] Seller:', wallet.publicKey.toBase58());

    // Create Anchor provider
    const provider = new AnchorProvider(
      connection,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as Idl,
      provider
    );

    // Get seller's token account (source)
    const sellerTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      wallet.publicKey
    );

    // Derive Resale Escrow PDA
    // Seeds: ["resale_escrow", nft_mint, seller]
    const [resaleEscrowPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('resale_escrow'),
        nftMint.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );

    console.log('[listCouponForResale] Seller Token Account:', sellerTokenAccount.toBase58());
    console.log('[listCouponForResale] Resale Escrow PDA:', resaleEscrowPDA.toBase58());
    console.log('[listCouponForResale] Calling list_for_resale instruction...');

    // Call list_for_resale instruction (transfers NFT to escrow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx = await (program.methods as any)
      .listForResale()
      .accountsStrict({
        nftMint: nftMint,
        sellerTokenAccount: sellerTokenAccount,
        resaleEscrow: resaleEscrowPDA,
        seller: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('[listCouponForResale] ✅ Transaction successful:', tx);
    console.log('[listCouponForResale] NFT transferred to Resale Escrow PDA');
    console.log('[listCouponForResale] Coupon is now listed for resale!');

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet' ? '' : '?cluster=devnet';
    const solscanUrl = `https://solscan.io/tx/${tx}${network}`;

    return {
      success: true,
      signature: tx,
      solscanUrl,
    };
  } catch (error) {
    console.error('[listCouponForResale] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Purchase a coupon from resale marketplace (escrow-based)
 *
 * Atomic transaction that does 3 things:
 * 1. Transfers SOL from buyer to seller (97.5%)
 * 2. Transfers SOL from buyer to platform (2.5%)
 * 3. Transfers NFT from Resale Escrow PDA to buyer
 *
 * All steps succeed or fail together (atomicity).
 * Seller does NOT need to sign (NFT already in escrow).
 *
 * @param connection - Solana connection
 * @param wallet - Buyer's wallet
 * @param nftMint - NFT mint address
 * @param sellerWallet - Seller's wallet address
 * @param priceLamports - Price in lamports
 * @returns Result with transaction signature
 */
export async function purchaseResaleCoupon(
  connection: Connection,
  wallet: WalletContextState,
  nftMint: PublicKey,
  sellerWallet: PublicKey,
  priceLamports: number
): Promise<PurchaseResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    console.log('[purchaseResaleCoupon] Starting escrow-based resale purchase...');
    console.log('[purchaseResaleCoupon] NFT Mint:', nftMint.toBase58());
    console.log('[purchaseResaleCoupon] Seller:', sellerWallet.toBase58());
    console.log('[purchaseResaleCoupon] Buyer:', wallet.publicKey.toBase58());
    console.log('[purchaseResaleCoupon] Price:', priceLamports, 'lamports');
    console.log('[purchaseResaleCoupon] Platform Wallet:', PLATFORM_WALLET.toBase58());

    // Create Anchor provider
    const provider = new AnchorProvider(
      connection,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wallet as any,
      { commitment: 'confirmed' }
    );

    // Load program
    const program = new Program<NftCoupon>(
      idl as Idl,
      provider
    );

    // Derive Resale Escrow PDA
    // Seeds: ["resale_escrow", nft_mint, seller]
    const [resaleEscrowPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('resale_escrow'),
        nftMint.toBuffer(),
        sellerWallet.toBuffer(),
      ],
      PROGRAM_ID
    );

    // Get buyer's token account (destination - will be created if doesn't exist)
    const buyerTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      wallet.publicKey
    );

    console.log('[purchaseResaleCoupon] Resale Escrow PDA:', resaleEscrowPDA.toBase58());
    console.log('[purchaseResaleCoupon] Buyer Token Account:', buyerTokenAccount.toBase58());
    console.log('[purchaseResaleCoupon] Calling purchase_from_resale instruction...');

    // Call purchase_from_resale instruction (atomic: payment + NFT from escrow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx = await (program.methods as any)
      .purchaseFromResale(new BN(priceLamports))
      .accountsStrict({
        nftMint: nftMint,
        resaleEscrow: resaleEscrowPDA,
        buyerTokenAccount: buyerTokenAccount,
        seller: sellerWallet,
        buyer: wallet.publicKey,
        platformWallet: PLATFORM_WALLET,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('[purchaseResaleCoupon] ✅ Transaction successful:', tx);
    console.log('[purchaseResaleCoupon] Escrow-based atomic transaction complete:');
    console.log('[purchaseResaleCoupon]   - SOL payment to seller (97.5%)');
    console.log('[purchaseResaleCoupon]   - SOL payment to platform (2.5%)');
    console.log('[purchaseResaleCoupon]   - NFT transferred from Resale Escrow to buyer');

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet' ? '' : '?cluster=devnet';
    const solscanUrl = `https://solscan.io/tx/${tx}${network}`;

    return {
      success: true,
      signature: tx,
      solscanUrl,
    };
  } catch (error) {
    console.error('[purchaseResaleCoupon] Error:', error);
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
): Promise<unknown | null> {
  try {
    const provider = new AnchorProvider(
      connection,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
      { commitment: 'confirmed' }
    );

    const program = new Program<NftCoupon>(
      idl as Idl,
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
