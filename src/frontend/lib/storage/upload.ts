import { createClient } from '@/lib/database/supabase';
import { uploadImageToArweave } from './arweave';

/**
 * Upload image to Arweave (permanent storage)
 * Falls back to Supabase if Arweave fails
 */
export async function uploadDealImage(
  file: File,
  merchantWallet: string
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    // Try Arweave first (permanent, decentralized storage)
    const useArweave = process.env.ARWEAVE_WALLET_PATH !== undefined;

    if (useArweave) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `${merchantWallet.slice(0, 8)}_${Date.now()}.${file.name.split('.').pop()}`;

        const arweaveResult = await uploadImageToArweave(
          buffer,
          file.type,
          filename
        );

        if ('error' in arweaveResult) {
          console.warn('Arweave upload failed, falling back to Supabase:', arweaveResult.error);
        } else {
          console.log('✅ Image uploaded to Arweave:', arweaveResult.url);
          return {
            url: arweaveResult.url,
            path: arweaveResult.txId,
          };
        }
      } catch (arweaveError) {
        console.warn('Arweave upload error, falling back to Supabase:', arweaveError);
      }
    }

    // Fallback to Supabase Storage
    const supabase = createClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${merchantWallet.slice(0, 8)}_${timestamp}.${fileExt}`;
    const filePath = `deals/${fileName}`;

    // Upload to Supabase Storage
    const { data: _data, error } = await supabase.storage
      .from('deal-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('deal-images')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      return { error: 'Failed to get public URL' };
    }

    console.log('📦 Image uploaded to Supabase (fallback):', publicUrlData.publicUrl);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload image' };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteDealImage(filePath: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from('deal-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
