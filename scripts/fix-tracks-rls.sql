-- Fix RLS policies for tracks table to allow users to access their own tracks
-- Run this in your Supabase SQL editor

-- Enable RLS on tracks table if not already enabled
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own tracks" ON tracks;
DROP POLICY IF EXISTS "Users can insert their own tracks" ON tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON tracks;
DROP POLICY IF EXISTS "Admins can view all tracks" ON tracks;

-- Create RLS policies for tracks table
CREATE POLICY "Users can view their own tracks" ON tracks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracks" ON tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" ON tracks
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all tracks
CREATE POLICY "Admins can view all tracks" ON tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'master_admin')
        )
    );

-- Allow admins to update all tracks
CREATE POLICY "Admins can update all tracks" ON tracks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'master_admin')
        )
    );

-- Comments for documentation
COMMENT ON POLICY "Users can view their own tracks" ON tracks IS 'Allows users to view tracks they own';
COMMENT ON POLICY "Users can insert their own tracks" ON tracks IS 'Allows users to insert tracks with their user_id';
COMMENT ON POLICY "Users can update their own tracks" ON tracks IS 'Allows users to update tracks they own';
COMMENT ON POLICY "Admins can view all tracks" ON tracks IS 'Allows admins to view all tracks';
COMMENT ON POLICY "Admins can update all tracks" ON tracks IS 'Allows admins to update all tracks';
