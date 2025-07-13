-- Add mood column to replace description in submissions table
-- This migration adds the mood field and removes the description field

-- Add mood column
ALTER TABLE submissions ADD COLUMN mood TEXT;

-- Copy any existing description data to mood (if needed for data preservation)
-- UPDATE submissions SET mood = description WHERE description IS NOT NULL;

-- Remove description column
ALTER TABLE submissions DROP COLUMN IF EXISTS description;

-- Add comment for documentation
COMMENT ON COLUMN submissions.mood IS 'Track mood/emotion category selected by user';
