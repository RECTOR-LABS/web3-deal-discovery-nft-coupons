import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createBurnInstruction,
} from '@solana/spl-token';
import { getConnection } from './connection';

export interface RedemptionParams {
  nftMint: string;
  userWallet: string;
  merchantWallet: PublicKey;
}

export interface RedemptionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Redeem an NFT coupon by burning it on-chain
 * This prevents the coupon from being reused
 */
export async function redeemCouponOnChain(
  params: RedemptionParams,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<RedemptionResult> {
  try {
    const connection = getConnection();
    const mint = new PublicKey(params.nftMint);
    const user = new PublicKey(params.userWallet);

    // Get the associated token account for the user
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      user
    );

    // Verify the token account exists and has balance
    const accountInfo = await connection.getAccountInfo(userTokenAccount);
    if (!accountInfo) {
      return {
        success: false,
        error: 'Token account not found',
      };
    }

    const tokenBalance = await connection.getTokenAccountBalance(userTokenAccount);
    if (tokenBalance.value.uiAmount !== 1) {
      return {
        success: false,
        error: 'Invalid NFT balance',
      };
    }

    // Create burn instruction
    // Note: For NFTs, we burn the entire supply (1 token)
    const burnInstruction = createBurnInstruction(
      userTokenAccount,
      mint,
      user,
      1, // Amount to burn (1 for NFT)
      [], // Multisig signers (none for regular wallet)
      TOKEN_PROGRAM_ID
    );

    // Create transaction
    const transaction = new Transaction();

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = params.merchantWallet;

    // Add burn instruction
    transaction.add(burnInstruction);

    // Sign and send transaction
    // The merchant wallet signs (pays fees), but the burn requires user's token account authority
    // In a real implementation, you'd need the user to sign this transaction
    // For now, we'll return a transaction that needs to be signed by both parties

    const signedTransaction = await signTransaction(transaction);

    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      }
    );

    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
      return {
        success: false,
        error: 'Transaction failed: ' + JSON.stringify(confirmation.value.err),
      };
    }

    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('Redemption error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during redemption',
    };
  }
}

/**
 * Alternative: Mark NFT as redeemed using program instruction
 * This doesn't burn the NFT but marks it as used in the smart contract
 */
export async function markCouponRedeemed(
  params: RedemptionParams,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<RedemptionResult> {
  try {
    // This would call the smart contract's updateCouponStatus or redeemCoupon instruction
    // For now, returning a placeholder
    // In production, you'd use Anchor to call the program instruction:

    // const program = new Program(IDL, PROGRAM_ID, provider);
    // const tx = await program.methods
    //   .redeemCoupon()
    //   .accounts({
    //     coupon: couponPda,
    //     merchant: merchantWallet,
    //     nftMint: mint,
    //     // ... other accounts
    //   })
    //   .transaction();

    return {
      success: false,
      error: 'Smart contract integration pending - use burn method for now',
    };
  } catch (error) {
    console.error('Mark redeemed error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Record redemption event to database
 */
export async function recordRedemptionEvent(params: {
  nftMint: string;
  userWallet: string;
  merchantWallet: string;
  signature: string;
  dealId?: string;
}) {
  try {
    const response = await fetch('/api/redemptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nft_mint: params.nftMint,
        user_wallet: params.userWallet,
        merchant_wallet: params.merchantWallet,
        transaction_signature: params.signature,
        deal_id: params.dealId,
        redeemed_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record redemption event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error recording redemption:', error);
    // Non-critical error - the on-chain redemption is what matters
    return null;
  }
}
