-- Create sync finalization tables
-- Run this in your Supabase SQL editor

-- Table for sync finalization data
CREATE TABLE IF NOT EXISTS sync_finalizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    pro_plan TEXT NOT NULL,
    pro_number TEXT NOT NULL,
    publisher_name TEXT NOT NULL,
    publisher_pro TEXT NOT NULL,
    publisher_number TEXT NOT NULL,
    copyright_owner TEXT NOT NULL,
    master_owner TEXT NOT NULL,
    isrc TEXT,
    upc TEXT,
    territory_rights TEXT NOT NULL,
    duration TEXT NOT NULL,
    bpm TEXT,
    key TEXT,
    lyrics TEXT,
    instrumental_available BOOLEAN DEFAULT FALSE,
    additional_notes TEXT,
    contributors JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'requires_updates')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id)
);

-- Table for chat sessions between admin and users
CREATE TABLE IF NOT EXISTS sync_chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id)
);

-- Table for chat messages
CREATE TABLE IF NOT EXISTS sync_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE sync_finalizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sync_finalizations
CREATE POLICY "Users can view their own sync finalizations" ON sync_finalizations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync finalizations" ON sync_finalizations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync finalizations" ON sync_finalizations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sync finalizations" ON sync_finalizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'master_admin')
        )
    );

-- RLS Policies for sync_chat_sessions  
CREATE POLICY "Users can view their own chat sessions" ON sync_chat_sessions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id);

CREATE POLICY "Admins can manage all chat sessions" ON sync_chat_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'master_admin')
        )
    );

-- RLS Policies for sync_messages
CREATE POLICY "Users can view messages for their tracks" ON sync_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracks 
            WHERE tracks.id = sync_messages.track_id 
            AND tracks.user_id = auth.uid()
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
                SELECT 1 FROM tracks 
                WHERE tracks.id = sync_messages.track_id 
                AND tracks.user_id = auth.uid()
            ))
            OR 
            (sender_role = 'admin' AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role IN ('admin', 'master_admin')
            ))
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_sync_finalizations_track_id ON sync_finalizations(track_id);
CREATE INDEX idx_sync_finalizations_user_id ON sync_finalizations(user_id);
CREATE INDEX idx_sync_finalizations_status ON sync_finalizations(status);
CREATE INDEX idx_sync_chat_sessions_track_id ON sync_chat_sessions(track_id);
CREATE INDEX idx_sync_messages_track_id ON sync_messages(track_id);
CREATE INDEX idx_sync_messages_created_at ON sync_messages(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sync_finalizations_updated_at 
    BEFORE UPDATE ON sync_finalizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_chat_sessions_updated_at 
    BEFORE UPDATE ON sync_chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE sync_finalizations IS 'Stores completed sync licensing finalization data for approved tracks';
COMMENT ON TABLE sync_chat_sessions IS 'Manages chat sessions between admins and users for sync licensing discussions';
COMMENT ON TABLE sync_messages IS 'Stores individual messages in sync licensing chat sessions';
