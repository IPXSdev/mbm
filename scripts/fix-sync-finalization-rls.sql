-- Fix RLS policies for sync_finalizations to allow proper upserts
-- Run this in your Supabase SQL editor

-- Drop and recreate the INSERT policy to be more permissive
DROP POLICY IF EXISTS "Users can insert their own sync finalizations" ON sync_finalizations;

-- More permissive INSERT policy that allows upserts
CREATE POLICY "Users can insert their own sync finalizations" ON sync_finalizations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tracks 
            WHERE tracks.id = sync_finalizations.track_id 
            AND tracks.user_id = auth.uid()
        )
    );

-- Also ensure UPDATE policy allows the user to update their own records
DROP POLICY IF EXISTS "Users can update their own sync finalizations" ON sync_finalizations;

CREATE POLICY "Users can update their own sync finalizations" ON sync_finalizations
    FOR UPDATE USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tracks 
            WHERE tracks.id = sync_finalizations.track_id 
            AND tracks.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tracks 
            WHERE tracks.id = sync_finalizations.track_id 
            AND tracks.user_id = auth.uid()
        )
    );

-- Comments
COMMENT ON POLICY "Users can insert their own sync finalizations" ON sync_finalizations IS 'Allows users to insert sync finalizations for their own tracks';
COMMENT ON POLICY "Users can update their own sync finalizations" ON sync_finalizations IS 'Allows users to update sync finalizations for their own tracks';
