-- Fix foreign key constraints for chat tables
-- Run this in your Supabase SQL editor after the main chat tables have been created

-- Fix sync_chat_sessions table constraints
ALTER TABLE sync_chat_sessions 
DROP CONSTRAINT IF EXISTS sync_chat_sessions_track_id_fkey;

ALTER TABLE sync_chat_sessions 
ADD CONSTRAINT sync_chat_sessions_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES submissions(id) ON DELETE CASCADE;

-- Fix sync_messages table constraints
ALTER TABLE sync_messages 
DROP CONSTRAINT IF EXISTS sync_messages_track_id_fkey;

ALTER TABLE sync_messages 
ADD CONSTRAINT sync_messages_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES submissions(id) ON DELETE CASCADE;

-- Also update the RLS policies to reference the correct table
DROP POLICY IF EXISTS "Users can view messages for their tracks" ON sync_messages;
DROP POLICY IF EXISTS "Users can send messages for their tracks" ON sync_messages;

-- Recreate RLS policies with correct table references
CREATE POLICY "Users can view messages for their tracks" ON sync_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM submissions 
            WHERE submissions.id = sync_messages.track_id 
            AND submissions.user_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'master_admin')
        )
    );

CREATE POLICY "Users can send messages for their tracks" ON sync_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        (
            (sender_role = 'user' AND EXISTS (
                SELECT 1 FROM submissions 
                WHERE submissions.id = sync_messages.track_id 
                AND submissions.user_id = auth.uid()
            ))
            OR 
            (sender_role = 'admin' AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role IN ('admin', 'master_admin')
            ))
        )
    );
