-- Fix foreign key constraint issue for sync finalization
-- Run this in your Supabase SQL editor

-- Remove foreign key constraint that's causing the error
ALTER TABLE sync_finalizations DROP CONSTRAINT IF EXISTS sync_finalizations_track_id_fkey;
ALTER TABLE sync_finalizations DROP CONSTRAINT IF EXISTS sync_finalizations_user_id_fkey;

-- Update the constraint to reference the correct table name (submissions instead of tracks)
ALTER TABLE sync_finalizations 
ADD CONSTRAINT sync_finalizations_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES submissions(id) ON DELETE CASCADE;

-- Add user constraint back (this should work)
ALTER TABLE sync_finalizations 
ADD CONSTRAINT sync_finalizations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
