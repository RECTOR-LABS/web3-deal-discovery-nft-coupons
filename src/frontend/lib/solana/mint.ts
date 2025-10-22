import {
  Connection,
  Keypair,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  getMerchantPDA,
  getCouponDataPDA,
  getMetadataAccount,
} from './program';
import {
  createCouponDirect,
  CouponCategory,
  CreateCouponArgs,
} from './merchant-direct';
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
    // Use API route (server-side) for Arweave access
    try {
      const response = await fetch('/api/arweave/upload-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata,
          nftMint,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Metadata uploaded to Arweave:', result.url);
        return {
          url: result.url,
          path: result.txId,
        };
      } else {
        console.warn('Arweave metadata upload failed, falling back to Supabase:', result.error);
      }
    } catch (arweaveError) {
      console.warn('Arweave metadata upload error, falling back to Supabase:', arweaveError);
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
  wallet: Pick<WalletContextState, 'publicKey' | 'signTransaction' | 'signAllTransactions' | 'sendTransaction'>,
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
    const [_merchantPDA] = getMerchantPDA(wallet.publicKey);
    const [_couponDataPDA] = getCouponDataPDA(nftMint.publicKey);
    const metadataAccount = getMetadataAccount(nftMint.publicKey);
    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      wallet.publicKey
    );

    // Step 6: Call smart contract to create coupon using direct RPC
    // Map category to enum index
    const categoryMap: Record<string, CouponCategory> = {
      'Food & Beverage': CouponCategory.FoodAndBeverage,
      'Retail': CouponCategory.Retail,
      'Services': CouponCategory.Services,
      'Travel': CouponCategory.Travel,
      'Entertainment': CouponCategory.Entertainment,
      'Other': CouponCategory.Other,
    };

    const category: CouponCategory = categoryMap[dealData.category] || CouponCategory.Other;

    const createCouponArgs: CreateCouponArgs = {
      title: dealData.title,
      description: dealData.description,
      discountPercentage: dealData.discountPercentage,
      expiryDate: Math.floor(new Date(dealData.expiryDate).getTime() / 1000), // Unix timestamp
      category,
      maxRedemptions: 1, // single-use
      metadataUri,
      nftMint,
      metadataAccount,
      nftTokenAccount,
    };

    const result = await createCouponDirect(connection, wallet, createCouponArgs);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const tx = result.signature;
    const nftMintAddress = nftMint.publicKey.toBase58();

    // Step 7: Save deal to database via API (server-side)
    // API has access to service role key and can bypass RLS
    try {
      const saveResponse = await fetch('/api/deals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId,
          nft_mint_address: nftMintAddress,
          title: dealData.title,
          description: dealData.description,
          image_url: imageUrl,
          discount_percentage: dealData.discountPercentage,
          expiry_date: new Date(dealData.expiryDate).toISOString(),
          category: dealData.category,
          is_active: true,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('❌ Database insert error:', errorData);
        return {
          success: false,
          error: `NFT minted successfully (${nftMintAddress}), but failed to save to database: ${errorData.error}. Please contact support.`,
        };
      }

      const saveResult = await saveResponse.json();
      console.log('✅ Deal saved to database:', saveResult.deal);
    } catch (dbError) {
      console.error('❌ API request error:', dbError);
      return {
        success: false,
        error: `NFT minted successfully (${nftMintAddress}), but failed to save to database. Please contact support.`,
      };
    }

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
