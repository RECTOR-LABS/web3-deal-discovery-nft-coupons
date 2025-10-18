import { createClient } from '@/lib/database/supabase';

/**
 * Upload image to Supabase Storage
 * Bucket: deal-images (must be created in Supabase dashboard)
 */
export async function uploadDealImage(
  file: File,
  merchantWallet: string
): Promise<{ url: string; path: string } | { error: string }> {
  try {
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
