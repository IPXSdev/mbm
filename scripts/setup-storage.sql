-- Clean up test data
DELETE FROM public.submissions WHERE title = 'Test Song';

-- Create storage buckets if they don't exist
-- Note: These commands need to be run in the Supabase dashboard Storage section

-- First create buckets in Supabase dashboard:
-- 1. Go to Storage section
-- 2. Click "New bucket"
-- 3. Create bucket named "audio-files" with public access
-- 4. Create bucket named "images" with public access

-- Alternative: Use SQL to create if your project allows
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set storage policies to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload audio files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Public can view audio files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');
