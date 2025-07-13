-- Enable RLS on storage buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for users to upload tracks to their own folder
CREATE POLICY "Users can upload tracks to own folder" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tracks' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Create policy for everyone to view tracks  
CREATE POLICY "Everyone can view tracks" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tracks');

-- Create policy for users to upload images to their own folder
CREATE POLICY "Users can upload images to own folder" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Create policy for everyone to view images
CREATE POLICY "Everyone can view images" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own tracks" ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tracks' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Allow admins to manage all files
CREATE POLICY "Admins can manage all tracks" ON storage.objects 
FOR ALL 
USING (bucket_id = 'tracks' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'master_admin')
));

CREATE POLICY "Admins can manage all images" ON storage.objects 
FOR ALL 
USING (bucket_id = 'images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'master_admin')
));
