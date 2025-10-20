import { NextRequest, NextResponse } from 'next/server';
import Arweave from 'arweave';
import type { JWKInterface } from 'arweave/node/lib/wallet';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API Route: Upload JSON metadata to Arweave
 * POST /api/arweave/upload-metadata
 *
 * Server-side only - loads wallet keyfile and uploads NFT metadata to Arweave
 */

function getArweaveClient(): Arweave {
  // Use AR.IO Testnet (wallet funded with 10,000 AR testnet tokens)
  return Arweave.init({
    host: 'arweave-search.goldsky.com',
    port: 443,
    protocol: 'https',
  });
}

function loadWallet(): JWKInterface {
  try {
    const keyfilePath = process.env.ARWEAVE_WALLET_PATH || '../arweave-wallet.json';
    const absolutePath = join(process.cwd(), keyfilePath);
    const keyfile = readFileSync(absolutePath, 'utf-8');
    return JSON.parse(keyfile) as JWKInterface;
  } catch (error) {
    console.error('Failed to load Arweave wallet:', error);
    throw new Error('Arweave wallet keyfile not found. Please ensure arweave-wallet.json exists.');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Arweave is configured
    if (!process.env.ARWEAVE_WALLET_PATH) {
      return NextResponse.json(
        { error: 'Arweave not configured' },
        { status: 503 }
      );
    }

    // Parse JSON body
    const body = await request.json();
    const { metadata, nftMint } = body;

    if (!metadata || !nftMint) {
      return NextResponse.json(
        { error: 'Missing metadata or nftMint' },
        { status: 400 }
      );
    }

    // Initialize Arweave
    const arweave = getArweaveClient();
    const wallet = loadWallet();

    const metadataString = JSON.stringify(metadata, null, 2);

    // Create transaction
    const transaction = await arweave.createTransaction(
      {
        data: metadataString,
      },
      wallet
    );

    // Add tags
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'NFT-Coupon-Platform');
    transaction.addTag('App-Version', '1.0');
    transaction.addTag('Type', 'nft-metadata');
    transaction.addTag('NFT-Mint', nftMint);

    // Sign transaction
    await arweave.transactions.sign(transaction, wallet);

    // Upload using chunked uploader for reliability
    const uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`Metadata upload progress: ${uploader.pctComplete}% complete`);
    }

    const txId = transaction.id;
    const url = `https://arweave-search.goldsky.com/${txId}`;

    console.log('✅ Arweave metadata upload successful:', { txId, url });

    return NextResponse.json({
      success: true,
      url,
      txId,
    });

  } catch (error) {
    console.error('Arweave metadata upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload metadata',
      },
      { status: 500 }
    );
  }
}
