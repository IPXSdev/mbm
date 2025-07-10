-- Create updated tracks table with all required fields
CREATE TABLE IF NOT EXISTS tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  image_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  plays INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  admin_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tracks', 'tracks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own tracks" ON tracks;
DROP POLICY IF EXISTS "Users can view their own tracks" ON tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON tracks;
DROP POLICY IF EXISTS "Admins can view all tracks" ON tracks;
DROP POLICY IF EXISTS "Admins can update all tracks" ON tracks;
DROP POLICY IF EXISTS "Users can upload tracks" ON storage.objects;
DROP POLICY IF EXISTS "Users can view tracks" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view images" ON storage.objects;

-- Create policies
CREATE POLICY "Users can insert their own tracks" ON tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tracks" ON tracks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" ON tracks
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (you'll need to set up admin roles)
CREATE POLICY "Admins can view all tracks" ON tracks
  FOR SELECT USING (true); -- You should add proper admin role check here

CREATE POLICY "Admins can update all tracks" ON tracks
  FOR UPDATE USING (true); -- You should add proper admin role check here

-- Storage policies
CREATE POLICY "Users can upload tracks" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tracks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view tracks" ON storage.objects
  FOR SELECT USING (bucket_id = 'tracks');

CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tracks_user_id_idx ON tracks(user_id);
CREATE INDEX IF NOT EXISTS tracks_status_idx ON tracks(status);
CREATE INDEX IF NOT EXISTS tracks_created_at_idx ON tracks(created_at);
CREATE INDEX IF NOT EXISTS tracks_genre_idx ON tracks(genre);

-- Create episodes table if it doesn't exist
CREATE TABLE IF NOT EXISTS episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  plays INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for episodes
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Create policy for episodes (public read access)
CREATE POLICY "Anyone can view episodes" ON episodes
  FOR SELECT USING (true);

-- Create indexes for episodes
CREATE INDEX IF NOT EXISTS episodes_published_at_idx ON episodes(published_at);
CREATE INDEX IF NOT EXISTS episodes_featured_idx ON episodes(featured);
