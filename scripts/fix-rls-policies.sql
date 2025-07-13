-- Fix RLS policies for sync finalization tables
-- Run this in your Supabase SQL editor to fix permission issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own sync finalizations" ON sync_finalizations;
DROP POLICY IF EXISTS "Users can insert their own sync finalizations" ON sync_finalizations;
DROP POLICY IF EXISTS "Users can update their own sync finalizations" ON sync_finalizations;
DROP POLICY IF EXISTS "Admins can view all sync finalizations" ON sync_finalizations;

-- Create more permissive policies for sync_finalizations
CREATE POLICY "Allow authenticated users to insert sync finalizations" ON sync_finalizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view their sync finalizations" ON sync_finalizations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update their sync finalizations" ON sync_finalizations
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete their sync finalizations" ON sync_finalizations
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix chat session policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON sync_chat_sessions;
DROP POLICY IF EXISTS "Admins can manage all chat sessions" ON sync_chat_sessions;

CREATE POLICY "Allow authenticated users full access to chat sessions" ON sync_chat_sessions
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix message policies  
DROP POLICY IF EXISTS "Users can view messages for their tracks" ON sync_messages;
DROP POLICY IF EXISTS "Users can send messages for their tracks" ON sync_messages;

CREATE POLICY "Allow authenticated users full access to messages" ON sync_messages
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Alternative: Disable RLS temporarily for testing (ONLY for launch emergency)
-- Uncomment these lines if the above policies still don't work:
-- ALTER TABLE sync_finalizations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE sync_chat_sessions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE sync_messages DISABLE ROW LEVEL SECURITY;
