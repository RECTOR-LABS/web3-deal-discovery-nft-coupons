import { Connection, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { getProgram, getMerchantPDA } from './program';

export interface InitMerchantResult {
  success: boolean;
  signature?: string;
  merchantPDA?: string;
  error?: string;
}

/**
 * Check if merchant account is already initialized on-chain
 */
export async function isMerchantInitialized(
  connection: Connection,
  wallet: AnchorWallet
): Promise<boolean> {
  try {
    if (!wallet.publicKey) {
      return false;
    }

    const [merchantPDA] = getMerchantPDA(wallet.publicKey);
    const accountInfo = await connection.getAccountInfo(merchantPDA);

    return accountInfo !== null;
  } catch (error) {
    console.error('Error checking merchant initialization:', error);
    return false;
  }
}

/**
 * Initialize merchant account on-chain
 * This must be called after merchant registration in database
 * and before creating any deals
 */
export async function initializeMerchant(
  connection: Connection,
  wallet: AnchorWallet,
  businessName: string
): Promise<InitMerchantResult> {
  try {
    if (!wallet.publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Check if merchant is already initialized
    const alreadyInitialized = await isMerchantInitialized(connection, wallet);
    if (alreadyInitialized) {
      const [merchantPDA] = getMerchantPDA(wallet.publicKey);
      return {
        success: true,
        merchantPDA: merchantPDA.toBase58(),
        error: 'Merchant already initialized',
      };
    }

    // Get merchant PDA
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);

    // Get program instance
    const program = getProgram(connection, wallet);

    // Call smart contract initialize_merchant instruction
    const tx = await program.methods
      .initializeMerchant(businessName)
      .accounts({
        merchant: merchantPDA,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('✅ Merchant initialized on-chain:', {
      merchantPDA: merchantPDA.toBase58(),
      signature: tx,
    });

    return {
      success: true,
      signature: tx,
      merchantPDA: merchantPDA.toBase58(),
    };
  } catch (error) {
    console.error('Merchant initialization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize merchant',
    };
  }
}

/**
 * Get merchant account data from on-chain
 */
export async function getMerchantAccount(
  connection: Connection,
  wallet: AnchorWallet
) {
  try {
    if (!wallet.publicKey) {
      return null;
    }

    const program = getProgram(connection, wallet);
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merchantAccount = await (program.account as any).merchant.fetch(merchantPDA);
    return merchantAccount;
  } catch (error) {
    console.error('Error fetching merchant account:', error);
    return null;
  }
}
