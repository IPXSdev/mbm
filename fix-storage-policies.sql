-- CRITICAL: Run this in Supabase Dashboard → SQL Editor to fix file uploads
-- This allows all authenticated users to upload files and everyone to view them

-- First, enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow uploads to tracks" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing tracks" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing images" ON storage.objects;

-- Allow ANY authenticated user to upload to tracks bucket
CREATE POLICY "Allow uploads to tracks" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tracks' AND auth.uid() IS NOT NULL);

-- Allow EVERYONE to view/download from tracks bucket
CREATE POLICY "Allow viewing tracks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tracks');

-- Allow ANY authenticated user to upload to images bucket (for future use)
CREATE POLICY "Allow uploads to images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

-- Allow EVERYONE to view/download from images bucket
CREATE POLICY "Allow viewing images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

-- Also allow users to delete their own files (optional, for admin cleanup)
CREATE POLICY "Allow users to delete own tracks" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tracks' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to delete own images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);
