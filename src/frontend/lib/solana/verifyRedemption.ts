import { PublicKey } from '@solana/web3.js';
import { getConnection } from './connection';
import nacl from 'tweetnacl';

export interface QRPayload {
  nftMint: string;
  userWallet: string;
  signature: string;
  timestamp: number;
  title: string;
  discount: number;
}

export interface VerificationResult {
  isValid: boolean;
  error?: string;
  couponData?: {
    nftMint: string;
    userWallet: string;
    title: string;
    discount: number;
    currentOwner?: string;
  };
}

/**
 * Verify QR code data and check NFT ownership
 */
export async function verifyRedemption(qrData: string): Promise<VerificationResult> {
  try {
    // Parse QR data
    const payload: QRPayload = JSON.parse(qrData);

    // Validate required fields
    if (!payload.nftMint || !payload.userWallet || !payload.signature || !payload.timestamp) {
      return {
        isValid: false,
        error: 'Invalid QR code format - missing required fields',
      };
    }

    // Check timestamp (QR should be recent - within 5 minutes)
    const now = Date.now();
    const qrAge = now - payload.timestamp;
    const maxAge = 5 * 60 * 1000; // 5 minutes

    if (qrAge > maxAge) {
      return {
        isValid: false,
        error: 'QR code has expired. Please generate a new one.',
      };
    }

    // Verify signature
    const message = `Redeem coupon: ${payload.nftMint} at ${payload.timestamp}`;
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(payload.signature, 'base64');
    const userPublicKey = new PublicKey(payload.userWallet);

    const isSignatureValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      userPublicKey.toBytes()
    );

    if (!isSignatureValid) {
      return {
        isValid: false,
        error: 'Invalid signature - QR code may be tampered',
      };
    }

    // Check NFT ownership on-chain
    const connection = getConnection();
    const nftMint = new PublicKey(payload.nftMint);

    // Get token accounts for this NFT
    const tokenAccounts = await connection.getTokenAccountsByOwner(userPublicKey, {
      mint: nftMint,
    });

    if (tokenAccounts.value.length === 0) {
      return {
        isValid: false,
        error: 'User no longer owns this NFT coupon',
      };
    }

    // Check token balance (should be 1 for NFT)
    const accountInfo = await connection.getTokenAccountBalance(
      tokenAccounts.value[0].pubkey
    );

    if (accountInfo.value.uiAmount !== 1) {
      return {
        isValid: false,
        error: 'NFT coupon has already been redeemed or transferred',
      };
    }

    // All checks passed
    return {
      isValid: true,
      couponData: {
        nftMint: payload.nftMint,
        userWallet: payload.userWallet,
        title: payload.title,
        discount: payload.discount,
        currentOwner: userPublicKey.toBase58(),
      },
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to verify QR code',
    };
  }
}

/**
 * Get NFT metadata from on-chain data
 */
export async function getNFTMetadata(mintAddress: string): Promise<{
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
} | null> {
  try {
    const _connection = getConnection();
    const _mint = new PublicKey(mintAddress);

    // This is a simplified version - in production, you'd use Metaplex SDK
    // to properly fetch and parse NFT metadata from Arweave/IPFS
    // For now, we'll return null and rely on QR payload data

    return null;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}
