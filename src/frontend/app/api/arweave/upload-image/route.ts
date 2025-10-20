import { NextRequest, NextResponse } from 'next/server';
import Arweave from 'arweave';
import type { JWKInterface } from 'arweave/node/lib/wallet';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API Route: Upload image to Arweave
 * POST /api/arweave/upload-image
 *
 * Server-side only - loads wallet keyfile and uploads to Arweave
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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize Arweave
    const arweave = getArweaveClient();
    const wallet = loadWallet();

    // Create transaction
    const transaction = await arweave.createTransaction(
      {
        data: buffer,
      },
      wallet
    );

    // Add tags for metadata
    transaction.addTag('Content-Type', file.type);
    transaction.addTag('App-Name', 'NFT-Coupon-Platform');
    transaction.addTag('App-Version', '1.0');
    transaction.addTag('File-Name', filename || file.name);
    transaction.addTag('Type', 'deal-image');

    // Sign transaction
    await arweave.transactions.sign(transaction, wallet);

    // Upload using chunked uploader for reliability
    const uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`Upload progress: ${uploader.pctComplete}% complete`);
    }

    const txId = transaction.id;
    const url = `https://arweave-search.goldsky.com/${txId}`;

    console.log('✅ Arweave image upload successful:', { txId, url });

    return NextResponse.json({
      success: true,
      url,
      txId,
    });

  } catch (error) {
    console.error('Arweave image upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload to Arweave',
      },
      { status: 500 }
    );
  }
}
