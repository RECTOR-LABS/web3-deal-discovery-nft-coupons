import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { createClient } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';
import { trackMetric, MetricType } from '@/lib/metrics';

const apiLogger = logger.child({ module: 'API:NFT:Transfer' });

// ⚠️ SECURITY: Load merchant wallet from environment
const MERCHANT_WALLET_SECRET_KEY = process.env.MERCHANT_WALLET_SECRET_KEY;
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

interface TransferRequest {
  nftMint: string;
  fromWallet: string;
  toWallet: string;
  dealId: string;
  transferType: 'claim' | 'purchase' | 'resale';
  paymentSignature?: string;
}

/**
 * Transfer NFT from one wallet to another
 * Handles:
 * - Free coupon claim (merchant → user)
 * - Paid coupon purchase (merchant → user A)
 * - Resale transfer (user A → user B) - requires seller signature
 */
export async function POST(request: NextRequest) {
  try {
    const body: TransferRequest = await request.json();
    const {
      nftMint,
      fromWallet,
      toWallet,
      dealId,
      transferType,
      paymentSignature,
    } = body;

    // Validate required fields
    if (!nftMint || !fromWallet || !toWallet || !dealId || !transferType) {
      return NextResponse.json(
        { error: 'Missing required fields: nftMint, fromWallet, toWallet, dealId, transferType' },
        { status: 400 }
      );
    }

    // Verify payment signature for paid coupons
    if (transferType === 'purchase' && !paymentSignature) {
      return NextResponse.json(
        { error: 'Payment signature required for paid coupons' },
        { status: 400 }
      );
    }

    // Load merchant wallet keypair
    if (!MERCHANT_WALLET_SECRET_KEY) {
      apiLogger.error('Merchant wallet secret key not configured in environment');
      return NextResponse.json(
        { error: 'NFT transfer service not configured. Contact administrator.' },
        { status: 500 }
      );
    }

    let merchantKeypair: Keypair;
    try {
      merchantKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(MERCHANT_WALLET_SECRET_KEY))
      );
      apiLogger.info('Merchant wallet loaded', {
        publicKey: merchantKeypair.publicKey.toBase58(),
      });
    } catch (error) {
      apiLogger.error('Failed to parse merchant wallet secret key', { error });
      return NextResponse.json(
        { error: 'Invalid merchant wallet configuration' },
        { status: 500 }
      );
    }

    apiLogger.info('NFT transfer request', {
      nftMint,
      from: fromWallet,
      to: toWallet,
      dealId,
      transferType,
    });

    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    const mint = new PublicKey(nftMint);
    const from = new PublicKey(fromWallet);
    const to = new PublicKey(toWallet);

    // Verify the transfer is from merchant wallet (for claim/purchase)
    if (transferType !== 'resale' && fromWallet !== merchantKeypair.publicKey.toBase58()) {
      return NextResponse.json(
        { error: 'Invalid transfer: from wallet must be merchant wallet' },
        { status: 400 }
      );
    }

    // Get associated token accounts
    const fromATA = await getAssociatedTokenAddress(
      mint,
      from,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toATA = await getAssociatedTokenAddress(
      mint,
      to,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    apiLogger.info('Token accounts', {
      fromATA: fromATA.toBase58(),
      toATA: toATA.toBase58(),
    });

    // Verify sender owns the NFT
    try {
      const fromAccountInfo = await getAccount(connection, fromATA);
      if (Number(fromAccountInfo.amount) !== 1) {
        apiLogger.warn('Sender does not own NFT', {
          fromWallet,
          nftMint,
          balance: fromAccountInfo.amount.toString(),
        });
        return NextResponse.json(
          { error: 'Sender does not own this NFT' },
          { status: 400 }
        );
      }
      apiLogger.info('Verified sender owns NFT');
    } catch (error) {
      apiLogger.error('Failed to verify NFT ownership', { error });
      return NextResponse.json(
        { error: 'NFT not found in sender wallet' },
        { status: 400 }
      );
    }

    // Build transfer transaction
    const transaction = new Transaction();

    // Check if recipient's token account exists, create if not
    let recipientAccountExists = true;
    try {
      await getAccount(connection, toATA);
      apiLogger.info('Recipient token account already exists');
    } catch (error) {
      apiLogger.info('Recipient token account does not exist, will create');
      recipientAccountExists = false;
    }

    if (!recipientAccountExists) {
      // Add instruction to create recipient's token account
      // Merchant pays the rent (~0.00203 SOL)
      transaction.add(
        createAssociatedTokenAccountInstruction(
          merchantKeypair.publicKey, // payer (merchant)
          toATA,                      // new account
          to,                         // owner
          mint,                       // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      apiLogger.info('Added create token account instruction');
    }

    // Add NFT transfer instruction
    transaction.add(
      createTransferInstruction(
        fromATA,                    // from token account
        toATA,                      // to token account
        from,                       // authority (current owner)
        1,                          // amount (NFTs = 1)
        [],                         // multisig signers
        TOKEN_PROGRAM_ID
      )
    );
    apiLogger.info('Added transfer instruction');

    // Get recent blockhash and set fee payer
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = merchantKeypair.publicKey;

    // Sign transaction
    // For merchant → user: merchant signs (merchant is the authority)
    // For user → user: needs user signature (not supported yet)
    if (transferType === 'resale') {
      // Resale requires seller's signature
      // Frontend must sign this transaction
      apiLogger.warn('Resale transfers require seller signature (not implemented)');
      return NextResponse.json(
        {
          error: 'Resale transfers require seller signature. Feature coming soon.',
          requiresUserSignature: true,
        },
        { status: 501 } // Not Implemented
      );
    }

    // Merchant signs the transfer
    transaction.sign(merchantKeypair);
    apiLogger.info('Transaction signed by merchant');

    // Send transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      }
    );

    apiLogger.info('Transaction sent', { signature });

    // Confirm transaction
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    if (confirmation.value.err) {
      apiLogger.error('Transaction failed', {
        signature,
        error: confirmation.value.err,
      });
      return NextResponse.json(
        {
          error: 'Transaction failed on-chain',
          signature,
          details: confirmation.value.err,
        },
        { status: 500 }
      );
    }

    apiLogger.info('Transaction confirmed', { signature });

    // Record transfer event in database
    const supabase = createClient();
    const { error: dbError } = await supabase.from('events').insert({
      event_type: 'purchase', // Legacy route - always 'purchase' event type
      deal_id: dealId,
      user_wallet: toWallet,
      metadata: {
        nft_mint: nftMint,
        from_wallet: fromWallet,
        to_wallet: toWallet,
        transfer_signature: signature,
        transfer_type: transferType,
        payment_signature: paymentSignature || null,
        timestamp: new Date().toISOString(),
      },
    });

    if (dbError) {
      apiLogger.error('Failed to record transfer event in database', { dbError });
      // Non-critical: blockchain transfer succeeded
    } else {
      apiLogger.info('Transfer event recorded in database');
    }

    // Track metric (Legacy route - use NFT_TRANSFER for all)
    trackMetric(
      MetricType.NFT_TRANSFER,
      1,
      {
        transfer_type: transferType,
        nft_mint: nftMint,
      }
    );

    return NextResponse.json({
      success: true,
      signature,
      message: 'NFT transferred successfully',
      solscanUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
    });
  } catch (error) {
    apiLogger.error('NFT transfer error', { error });
    return NextResponse.json(
      {
        error: 'Failed to transfer NFT',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
