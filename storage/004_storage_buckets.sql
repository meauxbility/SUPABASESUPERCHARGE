-- =====================================================================
-- MEAUXBILITY.ORG - STORAGE BUCKETS CONFIGURATION
-- =====================================================================
-- Version: 1.0.0
-- Purpose: Configure Supabase Storage for file uploads
-- =====================================================================

-- =====================================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================================

-- User Avatars (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Event Images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Product Images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Campaign Images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-images',
  'campaign-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Post Images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Digital Products (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'digital-products',
  'digital-products',
  false,
  104857600, -- 100MB
  ARRAY[
    'application/pdf',
    'application/zip',
    'audio/mpeg',
    'audio/mp3',
    'video/mp4',
    'application/epub+zip'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Documents (private - grants, financial reports, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Project Files (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'image/jpeg',
    'image/png'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Donation Receipts (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'donation-receipts',
  'donation-receipts',
  false,
  5242880, -- 5MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. STORAGE POLICIES FOR AVATARS
-- =====================================================================

-- Anyone can view avatars
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- =====================================================================
-- 3. STORAGE POLICIES FOR EVENT IMAGES
-- =====================================================================

-- Anyone can view event images
CREATE POLICY "Event images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

-- Admins can upload event images
CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images'
    AND public.is_admin()
  );

-- Admins can update event images
CREATE POLICY "Admins can update event images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-images'
    AND public.is_admin()
  );

-- Admins can delete event images
CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images'
    AND public.is_admin()
  );

-- =====================================================================
-- 4. STORAGE POLICIES FOR PRODUCT IMAGES
-- =====================================================================

-- Anyone can view product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Admins can manage product images
CREATE POLICY "Admins can manage product images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- =====================================================================
-- 5. STORAGE POLICIES FOR CAMPAIGN IMAGES
-- =====================================================================

-- Anyone can view campaign images
CREATE POLICY "Campaign images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'campaign-images');

-- Admins can manage campaign images
CREATE POLICY "Admins can manage campaign images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'campaign-images'
    AND public.is_admin()
  );

-- =====================================================================
-- 6. STORAGE POLICIES FOR POST IMAGES
-- =====================================================================

-- Anyone can view post images
CREATE POLICY "Post images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

-- Admins can manage post images
CREATE POLICY "Admins can manage post images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'post-images'
    AND public.is_admin()
  );

-- =====================================================================
-- 7. STORAGE POLICIES FOR DIGITAL PRODUCTS
-- =====================================================================

-- Only authenticated users with valid orders can download
CREATE POLICY "Users can download purchased digital products"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'digital-products'
    AND (
      -- Check if user has purchased this product
      EXISTS (
        SELECT 1
        FROM public.order_items oi
        JOIN public.orders o ON o.id = oi.order_id
        WHERE o.customer_id = auth.uid()
        AND o.status = 'completed'
        AND (storage.foldername(name))[1] = oi.product_id::TEXT
      )
      OR public.is_admin()
    )
  );

-- Admins can upload digital products
CREATE POLICY "Admins can upload digital products"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'digital-products'
    AND public.is_admin()
  );

-- Admins can manage digital products
CREATE POLICY "Admins can manage digital products"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'digital-products'
    AND public.is_admin()
  );

-- =====================================================================
-- 8. STORAGE POLICIES FOR DOCUMENTS
-- =====================================================================

-- Admins can view all documents
CREATE POLICY "Admins can view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND public.is_admin()
  );

-- Admins can manage documents
CREATE POLICY "Admins can manage documents"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documents'
    AND public.is_admin()
  );

-- =====================================================================
-- 9. STORAGE POLICIES FOR PROJECT FILES
-- =====================================================================

-- Project members can view project files
CREATE POLICY "Project members can view project files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-files'
    AND (
      public.is_project_member((storage.foldername(name))[1]::UUID)
      OR public.is_admin()
    )
  );

-- Project members can upload project files
CREATE POLICY "Project members can upload project files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-files'
    AND (
      public.is_project_member((storage.foldername(name))[1]::UUID)
      OR public.is_admin()
    )
  );

-- Project members can manage their uploads
CREATE POLICY "Project members can manage project files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-files'
    AND (
      public.is_project_member((storage.foldername(name))[1]::UUID)
      OR public.is_admin()
    )
  );

-- =====================================================================
-- 10. STORAGE POLICIES FOR DONATION RECEIPTS
-- =====================================================================

-- Donors can view their own receipts
CREATE POLICY "Donors can view own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'donation-receipts'
    AND (
      (storage.foldername(name))[1] = auth.uid()::TEXT
      OR public.is_admin()
    )
  );

-- System can generate receipts
CREATE POLICY "System can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'donation-receipts');

-- =====================================================================
-- STORAGE BUCKET STRUCTURE
-- =====================================================================

-- Recommended folder structure for each bucket:
--
-- avatars/
--   {user_id}/
--     avatar.jpg
--
-- event-images/
--   {event_id}/
--     featured.jpg
--     gallery/
--       img1.jpg
--       img2.jpg
--
-- product-images/
--   {product_id}/
--     main.jpg
--     thumb.jpg
--     gallery/
--
-- campaign-images/
--   {campaign_id}/
--     hero.jpg
--     thumb.jpg
--
-- post-images/
--   {post_id}/
--     featured.jpg
--     content/
--
-- digital-products/
--   {product_id}/
--     {filename}.pdf
--
-- documents/
--   grants/
--     {grant_id}/
--   financial-reports/
--     {year}/
--   legal/
--
-- project-files/
--   {project_id}/
--     {filename}
--
-- donation-receipts/
--   {donor_id}/
--     {year}/
--       receipt-{donation_id}.pdf

-- =====================================================================
-- COMPLETED: Storage Buckets Configured
-- =====================================================================
-- All storage buckets created with appropriate policies
-- Next: Create seed data (005_seed_data.sql)
-- =====================================================================
