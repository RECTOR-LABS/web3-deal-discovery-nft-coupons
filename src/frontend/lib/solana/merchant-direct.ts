/**
 * Direct RPC Merchant Initialization
 *
 * This module bypasses the Anchor TypeScript client and manually constructs
 * transaction instructions to interact with the NFT Coupon smart contract.
 *
 * Reason: Anchor 0.32.1 has an IDL compatibility issue where AccountClient
 * cannot be initialized due to missing type metadata.
 *
 * Solution: Manual instruction construction using raw Solana web3.js
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SendTransactionError,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PROGRAM_ID, getMerchantPDA, getCouponDataPDA, getMasterEdition, TOKEN_METADATA_PROGRAM_ID } from './program';

/**
 * Manually encode a string using Borsh format
 * Borsh string format:
 * - 4 bytes: little-endian u32 length
 * - N bytes: UTF-8 string data
 */
function encodeBorshString(str: string): Buffer {
  const stringBytes = Buffer.from(str, 'utf8');
  const lengthBuffer = Buffer.allocUnsafe(4);
  lengthBuffer.writeUInt32LE(stringBytes.length, 0);
  return Buffer.concat([lengthBuffer, stringBytes]);
}

/**
 * Encode a u8 (1 byte unsigned integer)
 */
function encodeBorshU8(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(value, 0);
  return buffer;
}

/**
 * Encode an i64 (8 bytes signed integer, little-endian)
 */
function encodeBorshI64(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(8);
  // JavaScript's Number is 64-bit float, need to handle large integers carefully
  buffer.writeBigInt64LE(BigInt(value), 0);
  return buffer;
}

/**
 * Encode an enum variant (1 byte for variant index)
 */
function encodeBorshEnum(variantIndex: number): Buffer {
  return encodeBorshU8(variantIndex);
}

/**
 * Instruction discriminators from IDL
 * These are the first 8 bytes of the instruction data
 */
const DISCRIMINATORS = {
  INITIALIZE_MERCHANT: [7, 90, 74, 38, 99, 111, 142, 77],
  CREATE_COUPON: [29, 170, 159, 88, 211, 20, 13, 56],
  REDEEM_COUPON: [66, 181, 163, 197, 244, 189, 153, 0],
  UPDATE_COUPON_STATUS: [122, 226, 151, 161, 164, 22, 246, 242],
} as const;

export interface InitMerchantResult {
  success: boolean;
  signature?: string;
  merchantPDA?: string;
  error?: string;
}

/**
 * Check if a merchant account is initialized on-chain
 *
 * @param connection - Solana connection
 * @param wallet - User's wallet
 * @returns true if merchant PDA exists on-chain
 */
export async function isMerchantInitialized(
  connection: Connection,
  wallet: Pick<WalletContextState, 'publicKey'> | null
): Promise<boolean> {
  if (!wallet || !wallet.publicKey) {
    return false;
  }

  try {
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);
    const accountInfo = await connection.getAccountInfo(merchantPDA);
    return accountInfo !== null;
  } catch (error) {
    console.error('Error checking merchant initialization:', error);
    return false;
  }
}

/**
 * Initialize a merchant account on-chain using direct RPC calls
 *
 * This function manually constructs the transaction instruction without
 * relying on the Anchor TypeScript client.
 *
 * @param connection - Solana connection
 * @param wallet - User's wallet
 * @param businessName - Business name to register
 * @returns Result object with signature and merchant PDA
 */
export async function initializeMerchantDirect(
  connection: Connection,
  wallet: Pick<WalletContextState, 'publicKey' | 'sendTransaction'>,
  businessName: string
): Promise<InitMerchantResult> {
  try {
    if (!wallet.publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Validate business name
    if (!businessName || businessName.trim().length === 0) {
      return { success: false, error: 'Business name is required' };
    }

    if (businessName.length > 100) {
      return { success: false, error: 'Business name is too long (max 100 characters)' };
    }

    // Derive merchant PDA
    const [merchantPDA, bump] = getMerchantPDA(wallet.publicKey);
    console.log('Merchant PDA:', merchantPDA.toBase58());
    console.log('Merchant PDA bump:', bump);

    // Serialize instruction arguments using manual Borsh encoding
    const serializedArgs = encodeBorshString(businessName);

    // Construct instruction data: discriminator + serialized arguments
    const discriminator = Buffer.from(DISCRIMINATORS.INITIALIZE_MERCHANT);
    const data = Buffer.concat([discriminator, serializedArgs]);

    console.log('Instruction data length:', data.length);
    console.log('Discriminator:', discriminator.toString('hex'));
    console.log('Serialized args length:', serializedArgs.length);
    console.log('Business name:', businessName);

    // Build transaction instruction manually
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: merchantPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: PROGRAM_ID,
      data,
    });

    // Create and send transaction
    const transaction = new Transaction().add(instruction);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    console.log('Sending transaction...');

    // Send transaction via wallet (this will prompt user for approval)
    const signature = await wallet.sendTransaction(transaction, connection);

    console.log('Transaction sent:', signature);
    console.log('Confirming...');

    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }

    console.log('Transaction confirmed!');

    return {
      success: true,
      signature,
      merchantPDA: merchantPDA.toBase58(),
    };
  } catch (error) {
    console.error('Merchant initialization error (direct RPC):', error);

    // Enhanced error handling
    let errorMessage = 'Failed to initialize merchant on-chain';

    if (error instanceof SendTransactionError) {
      const logs = await error.getLogs(connection);
      console.error('Transaction logs:', logs);
      errorMessage = `Transaction failed: ${logs?.join('\n') || error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Merchant account data structure
 */
interface MerchantAccountData {
  exists: boolean;
  pda: string;
  lamports: number;
  owner: string;
}

/**
 * Get merchant account data from the blockchain
 *
 * Note: This function would require implementing Borsh deserialization
 * for the Merchant account structure. For now, we just check existence.
 *
 * @param connection - Solana connection
 * @param wallet - User's wallet
 * @returns Merchant account data or null
 */
export async function getMerchantAccountDirect(
  connection: Connection,
  wallet: Pick<WalletContextState, 'publicKey'> | null
): Promise<MerchantAccountData | null> {
  if (!wallet || !wallet.publicKey) {
    return null;
  }

  try {
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);
    const accountInfo = await connection.getAccountInfo(merchantPDA);

    if (!accountInfo) {
      return null;
    }

    // For now, just return raw account info
    // Full implementation would deserialize the account data
    return {
      exists: true,
      pda: merchantPDA.toBase58(),
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toBase58(),
      // TODO: Implement Borsh deserialization for Merchant struct
      // data: deserialize(MerchantSchema, accountInfo.data)
    };
  } catch (error) {
    console.error('Error fetching merchant account:', error);
    return null;
  }
}

/**
 * Coupon category enum mapping
 */
export enum CouponCategory {
  FoodAndBeverage = 0,
  Retail = 1,
  Services = 2,
  Travel = 3,
  Entertainment = 4,
  Other = 5,
}

export interface CreateCouponArgs {
  title: string;
  description: string;
  discountPercentage: number;
  expiryDate: number; // Unix timestamp
  category: CouponCategory;
  maxRedemptions: number;
  metadataUri: string;
  nftMint: Keypair;
  metadataAccount: PublicKey;
  nftTokenAccount: PublicKey;
}

export interface CreateCouponResult {
  success: boolean;
  signature?: string;
  nftMint?: string;
  error?: string;
}

/**
 * Create a coupon NFT on-chain using direct RPC calls
 *
 * Bypasses the Anchor TypeScript client and manually constructs the transaction
 */
export async function createCouponDirect(
  connection: Connection,
  wallet: Pick<WalletContextState, 'publicKey' | 'sendTransaction' | 'signTransaction'>,
  args: CreateCouponArgs
): Promise<CreateCouponResult> {
  try {
    if (!wallet.publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Derive PDAs
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);
    const [couponDataPDA] = getCouponDataPDA(args.nftMint.publicKey);
    const masterEdition = getMasterEdition(args.nftMint.publicKey);

    console.log('Creating coupon...');
    console.log('Merchant PDA:', merchantPDA.toBase58());
    console.log('Coupon Data PDA:', couponDataPDA.toBase58());
    console.log('NFT Mint:', args.nftMint.publicKey.toBase58());
    console.log('Master Edition:', masterEdition.toBase58());

    // Serialize instruction arguments using manual Borsh encoding
    // Order: title, description, discount_percentage, expiry_date, category, max_redemptions, metadata_uri
    const serializedArgs = Buffer.concat([
      encodeBorshString(args.title),
      encodeBorshString(args.description),
      encodeBorshU8(args.discountPercentage),
      encodeBorshI64(args.expiryDate),
      encodeBorshEnum(args.category),
      encodeBorshU8(args.maxRedemptions),
      encodeBorshString(args.metadataUri),
    ]);

    // Construct instruction data: discriminator + serialized arguments
    const discriminator = Buffer.from(DISCRIMINATORS.CREATE_COUPON);
    const data = Buffer.concat([discriminator, serializedArgs]);

    console.log('Instruction data length:', data.length);
    console.log('Discriminator:', discriminator.toString('hex'));
    console.log('Args length:', serializedArgs.length);

    // Build transaction instruction manually
    // Account order must match IDL exactly
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: merchantPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: couponDataPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: args.nftMint.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: args.metadataAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: masterEdition,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: args.nftTokenAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: wallet.publicKey, // authority (same as merchant_authority)
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: TOKEN_METADATA_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SYSVAR_RENT_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: PROGRAM_ID,
      data,
    });

    // Create and send transaction
    const transaction = new Transaction().add(instruction);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    console.log('Requesting wallet signature...');

    // Get wallet signature first (this will prompt user)
    if (!wallet.signTransaction) {
      throw new Error('Wallet does not support transaction signing');
    }
    const signedTx = await wallet.signTransaction(transaction);

    console.log('Wallet signature received, adding nftMint signature...');

    // Now add nftMint signature to the signed transaction
    signedTx.partialSign(args.nftMint);

    console.log('Sending fully signed transaction...');

    // Send the fully signed transaction
    const signature = await connection.sendRawTransaction(signedTx.serialize());

    console.log('Transaction sent:', signature);
    console.log('Confirming...');

    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }

    console.log('Transaction confirmed!');

    return {
      success: true,
      signature,
      nftMint: args.nftMint.publicKey.toBase58(),
    };
  } catch (error) {
    console.error('Create coupon error (direct RPC):', error);

    let errorMessage = 'Failed to create coupon on-chain';

    if (error instanceof SendTransactionError) {
      const logs = await error.getLogs(connection);
      console.error('Transaction logs:', logs);
      errorMessage = `Transaction failed: ${logs?.join('\n') || error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
