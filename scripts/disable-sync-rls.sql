-- Temporarily disable RLS on sync_finalizations table for simple data entry
-- Run this in your Supabase SQL Editor

-- Disable RLS for sync_finalizations to allow simple data entry
ALTER TABLE sync_finalizations DISABLE ROW LEVEL SECURITY;

-- Also disable RLS for sync_chat_sessions if it's causing issues
ALTER TABLE sync_chat_sessions DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to re-enable later, use these commands:
-- ALTER TABLE sync_finalizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sync_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Note: This makes the table accessible for data entry without authentication barriers
-- Perfect for simple form submissions that admins will review later
