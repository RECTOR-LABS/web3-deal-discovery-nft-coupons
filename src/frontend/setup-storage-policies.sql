-- RLS Policies for deal-images bucket
-- Run this in Supabase Dashboard > SQL Editor if needed
-- (Bucket is already public, so these are optional additional security)

-- Public read access
CREATE POLICY IF NOT EXISTS "Public read access for deal images"
ON storage.objects FOR SELECT
USING (bucket_id = 'deal-images');

-- Authenticated uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can upload deal images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'deal-images');

-- Authenticated updates
CREATE POLICY IF NOT EXISTS "Authenticated users can update deal images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'deal-images')
WITH CHECK (bucket_id = 'deal-images');

-- Authenticated deletes
CREATE POLICY IF NOT EXISTS "Authenticated users can delete deal images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'deal-images');
