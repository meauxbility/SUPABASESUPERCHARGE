-- =====================================================================
-- MEAUXBILITY SUPABASE RLS POLICIES
-- =====================================================================
-- Run these SQL commands in your Supabase SQL Editor to secure storage

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- MEAUXBILITY-PUBLIC BUCKET POLICIES
-- =====================================================================
-- Public read access, authenticated write access

-- Allow public read access to meauxbility-public bucket
CREATE POLICY "Public read access to meauxbility-public" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'meauxbility-public');

-- Allow authenticated users to upload to meauxbility-public
CREATE POLICY "Authenticated write access to meauxbility-public" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'meauxbility-public' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files in meauxbility-public
CREATE POLICY "Authenticated update access to meauxbility-public" 
ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'meauxbility-public' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in meauxbility-public
CREATE POLICY "Authenticated delete access to meauxbility-public" 
ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'meauxbility-public' 
  AND auth.role() = 'authenticated'
);

-- =====================================================================
-- MEAUXBILITY-UPLOADS BUCKET POLICIES
-- =====================================================================
-- Authenticated users only (read/write)

-- Allow authenticated users full access to meauxbility-uploads
CREATE POLICY "Authenticated access to meauxbility-uploads" 
ON storage.objects
FOR ALL 
USING (
  bucket_id = 'meauxbility-uploads' 
  AND auth.role() = 'authenticated'
);

-- =====================================================================
-- MEAUXBILITY-ASSETS BUCKET POLICIES
-- =====================================================================
-- Authenticated users only (read/write)

-- Allow authenticated users full access to meauxbility-assets
CREATE POLICY "Authenticated access to meauxbility-assets" 
ON storage.objects
FOR ALL 
USING (
  bucket_id = 'meauxbility-assets' 
  AND auth.role() = 'authenticated'
);

-- =====================================================================
-- ADDITIONAL SECURITY POLICIES
-- =====================================================================

-- Prevent access to any other buckets
CREATE POLICY "Block access to non-allowlisted buckets" 
ON storage.objects
FOR ALL 
USING (
  bucket_id IN ('meauxbility-public', 'meauxbility-uploads', 'meauxbility-assets')
);

-- =====================================================================
-- VERIFICATION QUERIES
-- =====================================================================
-- Run these to verify policies are working

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- List all policies on storage.objects
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- =====================================================================
-- NOTES
-- =====================================================================
-- 
-- meauxbility-public: 
--   - Public read access (anyone can view files)
--   - Authenticated write access (only logged-in users can upload/update/delete)
--
-- meauxbility-uploads: 
--   - Authenticated only (only logged-in users can read/write)
--   - Use for user uploads, private documents, etc.
--
-- meauxbility-assets: 
--   - Authenticated only (only logged-in users can read/write)
--   - Use for application assets, user-generated content, etc.
--
-- Security Benefits:
--   - Prevents unauthorized access to private buckets
--   - Allows public access to public content
--   - Ensures only authenticated users can upload/modify content
--   - Blocks access to any other buckets not in allowlist
