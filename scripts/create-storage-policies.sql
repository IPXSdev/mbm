-- Create storage policies for file uploads

-- First, enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload tracks" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to tracks" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;

-- Create policies for tracks bucket
CREATE POLICY "Allow authenticated users to upload tracks" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'tracks');

CREATE POLICY "Allow public read access to tracks" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'tracks');

-- Create policies for images bucket
CREATE POLICY "Allow authenticated users to upload images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public read access to images" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'images');

-- Also allow authenticated users to update and delete their own files
CREATE POLICY "Allow authenticated users to update tracks" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'tracks');

CREATE POLICY "Allow authenticated users to delete tracks" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'tracks');

CREATE POLICY "Allow authenticated users to update images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to delete images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'images');
