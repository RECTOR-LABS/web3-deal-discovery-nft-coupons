import Arweave from 'arweave';
import type { JWKInterface } from 'arweave/node/lib/wallet';

/**
 * Initialize Arweave client
 * Uses AR.IO Testnet for development
 */
function getArweaveClient(): Arweave {
  return Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
}

/**
 * Load Arweave wallet from keyfile
 * Keyfile location: ../arweave-wallet.json (project root)
 * NOTE: This function only works server-side (Node.js environment)
 */
async function loadWallet(): Promise<JWKInterface> {
  try {
    // Dynamically import Node.js modules (server-side only)
    const { readFileSync } = await import('fs');
    const { join } = await import('path');

    const keyfilePath = process.env.ARWEAVE_WALLET_PATH || '../arweave-wallet.json';
    const absolutePath = join(process.cwd(), keyfilePath);
    const keyfile = readFileSync(absolutePath, 'utf-8');
    return JSON.parse(keyfile) as JWKInterface;
  } catch (error) {
    console.error('Failed to load Arweave wallet:', error);
    throw new Error('Arweave wallet keyfile not found. Please ensure arweave-wallet.json exists.');
  }
}

/**
 * Upload image to Arweave
 * Returns permanent storage URL
 */
export async function uploadImageToArweave(
  imageBuffer: Buffer,
  contentType: string,
  filename: string
): Promise<{ url: string; txId: string } | { error: string }> {
  try {
    const arweave = getArweaveClient();
    const wallet = await loadWallet();

    // Create transaction
    const transaction = await arweave.createTransaction(
      {
        data: imageBuffer,
      },
      wallet
    );

    // Add tags for metadata
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('App-Name', 'NFT-Coupon-Platform');
    transaction.addTag('App-Version', '1.0');
    transaction.addTag('File-Name', filename);
    transaction.addTag('Type', 'deal-image');

    // Sign transaction
    await arweave.transactions.sign(transaction, wallet);

    // Submit transaction
    const response = await arweave.transactions.post(transaction);

    if (response.status !== 200) {
      console.error('Arweave upload failed:', response);
      return { error: `Upload failed with status ${response.status}` };
    }

    // Transaction ID is the permanent identifier
    const txId = transaction.id;
    const url = `https://arweave.net/${txId}`;

    console.log('✅ Arweave upload successful:', { txId, url });

    return { url, txId };
  } catch (error) {
    console.error('Arweave upload error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to upload to Arweave',
    };
  }
}

/**
 * Upload JSON metadata to Arweave
 * Used for NFT metadata
 */
export async function uploadMetadataToArweave(
  metadata: object,
  nftMint: string
): Promise<{ url: string; txId: string } | { error: string }> {
  try {
    const arweave = getArweaveClient();
    const wallet = await loadWallet();

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

    // Sign and submit
    await arweave.transactions.sign(transaction, wallet);
    const response = await arweave.transactions.post(transaction);

    if (response.status !== 200) {
      console.error('Metadata upload failed:', response);
      return { error: `Upload failed with status ${response.status}` };
    }

    const txId = transaction.id;
    const url = `https://arweave.net/${txId}`;

    console.log('✅ Metadata uploaded to Arweave:', { txId, url });

    return { url, txId };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to upload metadata',
    };
  }
}

/**
 * Check wallet balance (for monitoring)
 */
export async function getWalletBalance(): Promise<string | null> {
  try {
    const arweave = getArweaveClient();
    const wallet = await loadWallet();
    const address = await arweave.wallets.jwkToAddress(wallet);
    const balance = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(balance);
    return ar;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    return null;
  }
}
