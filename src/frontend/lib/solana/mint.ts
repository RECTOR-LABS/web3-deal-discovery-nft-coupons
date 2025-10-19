import {
  Connection,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import {
  getProgram,
  getMerchantPDA,
  getCouponDataPDA,
  getMetadataAccount,
  TOKEN_METADATA_PROGRAM_ID,
} from './program';
import { uploadDealImage } from '@/lib/storage/upload';
import { createClient } from '@/lib/database/supabase';

export interface DealData {
  title: string;
  description: string;
  discountPercentage: number;
  expiryDate: string; // ISO string
  category: string;
  quantity: number;
  imageFile: File | null;
}

export interface MintResult {
  success: boolean;
  signature?: string;
  nftMint?: string;
  error?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    category: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
    files?: Array<{
      uri: string;
      type: string;
    }>;
  };
}

/**
 * Create NFT metadata JSON
 */
function createMetadata(
  dealData: DealData,
  imageUrl: string,
  merchantWallet: string
) {
  return {
    name: dealData.title,
    description: dealData.description,
    image: imageUrl,
    external_url: `https://dealcoupon.app/deals/${merchantWallet}`,
    attributes: [
      {
        trait_type: 'Discount',
        value: `${dealData.discountPercentage}%`,
      },
      {
        trait_type: 'Merchant',
        value: merchantWallet.slice(0, 8),
      },
      {
        trait_type: 'Merchant ID',
        value: merchantWallet,
      },
      {
        trait_type: 'Expiry',
        value: new Date(dealData.expiryDate).toISOString().split('T')[0],
      },
      {
        trait_type: 'Redemptions Remaining',
        value: '1',
      },
      {
        trait_type: 'Category',
        value: dealData.category,
      },
      {
        trait_type: 'Created At',
        value: new Date().toISOString().split('T')[0],
      },
    ],
    properties: {
      category: 'image',
      creators: [
        {
          address: merchantWallet,
          share: 100,
        },
      ],
    },
  };
}

/**
 * Upload metadata to Arweave (permanent storage)
 * Falls back to Supabase if Arweave fails
 */
async function uploadMetadata(
  metadata: NFTMetadata,
  nftMint: string
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    // Try Arweave first (permanent, immutable storage - perfect for NFT metadata)
    const useArweave = process.env.ARWEAVE_WALLET_PATH !== undefined;

    if (useArweave) {
      try {
        const { uploadMetadataToArweave } = await import('@/lib/storage/arweave');
        const arweaveResult = await uploadMetadataToArweave(metadata, nftMint);

        if ('error' in arweaveResult) {
          console.warn('Arweave metadata upload failed, falling back to Supabase:', arweaveResult.error);
        } else {
          console.log('✅ Metadata uploaded to Arweave:', arweaveResult.url);
          return {
            url: arweaveResult.url,
            path: arweaveResult.txId,
          };
        }
      } catch (arweaveError) {
        console.warn('Arweave metadata upload error, falling back to Supabase:', arweaveError);
      }
    }

    // Fallback to Supabase Storage
    const supabase = createClient();

    const fileName = `${nftMint}.json`;
    const filePath = `metadata/${fileName}`;

    // Upload metadata JSON
    const { data: _data, error } = await supabase.storage
      .from('deal-images')
      .upload(filePath, JSON.stringify(metadata, null, 2), {
        contentType: 'application/json',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Metadata upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('deal-images')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      return { error: 'Failed to get metadata URL' };
    }

    console.log('📦 Metadata uploaded to Supabase (fallback):', publicUrlData.publicUrl);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return { error: 'Failed to upload metadata' };
  }
}

/**
 * Mint NFT coupon
 */
export async function mintCoupon(
  connection: Connection,
  wallet: AnchorWallet,
  dealData: DealData,
  merchantId: string
): Promise<MintResult> {
  try {
    if (!wallet.publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Step 1: Upload image
    let imageUrl = '';
    if (dealData.imageFile) {
      const uploadResult = await uploadDealImage(
        dealData.imageFile,
        wallet.publicKey.toBase58()
      );

      if ('error' in uploadResult) {
        return { success: false, error: uploadResult.error };
      }

      imageUrl = uploadResult.url;
    } else {
      // Use placeholder image if no image provided
      imageUrl =
        'https://via.placeholder.com/800x450.png?text=Deal+Coupon';
    }

    // Step 2: Generate NFT mint keypair
    const nftMint = Keypair.generate();

    // Step 3: Create metadata
    const metadata = createMetadata(
      dealData,
      imageUrl,
      wallet.publicKey.toBase58()
    );

    // Step 4: Upload metadata
    const metadataUploadResult = await uploadMetadata(
      metadata,
      nftMint.publicKey.toBase58()
    );

    if ('error' in metadataUploadResult) {
      return { success: false, error: metadataUploadResult.error };
    }

    const metadataUri = metadataUploadResult.url;

    // Step 5: Get PDAs
    const [merchantPDA] = getMerchantPDA(wallet.publicKey);
    const [couponDataPDA] = getCouponDataPDA(nftMint.publicKey);
    const metadataAccount = getMetadataAccount(nftMint.publicKey);
    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      wallet.publicKey
    );

    // Step 6: Call smart contract to create coupon
    const program = getProgram(connection, wallet);

    // Map category to enum variant (must match smart contract enum)
    type CategoryVariant =
      | { foodBeverage: Record<string, never> }
      | { retail: Record<string, never> }
      | { services: Record<string, never> }
      | { travel: Record<string, never> }
      | { entertainment: Record<string, never> }
      | { other: Record<string, never> };

    const categoryMap: Record<string, CategoryVariant> = {
      'Food & Beverage': { foodBeverage: {} },
      'Retail': { retail: {} },
      'Services': { services: {} },
      'Travel': { travel: {} },
      'Entertainment': { entertainment: {} },
      'Other': { other: {} },
    };

    const categoryVariant: CategoryVariant = categoryMap[dealData.category] || { other: {} };

    const tx = await program.methods
      .createCoupon(
        dealData.title,
        metadataUri,
        dealData.discountPercentage,
        Math.floor(new Date(dealData.expiryDate).getTime() / 1000), // Unix timestamp
        1, // max_redemptions (single-use)
        categoryVariant
      )
      .accounts({
        merchant: merchantPDA,
        couponData: couponDataPDA,
        nftMint: nftMint.publicKey,
        metadataAccount: metadataAccount,
        nftTokenAccount: nftTokenAccount,
        merchantAuthority: wallet.publicKey,
        authority: wallet.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([nftMint])
      .rpc();

    // Step 7: Save deal to database
    const supabase = createClient();
    await supabase.from('deals').insert({
      merchant_id: merchantId,
      nft_mint_address: nftMint.publicKey.toBase58(),
      title: dealData.title,
      description: dealData.description,
      image_url: imageUrl,
      discount_percentage: dealData.discountPercentage,
      expiry_date: new Date(dealData.expiryDate).toISOString(),
      category: dealData.category,
      is_active: true,
    });

    return {
      success: true,
      signature: tx,
      nftMint: nftMint.publicKey.toBase58(),
    };
  } catch (error) {
    console.error('Minting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT',
    };
  }
}
