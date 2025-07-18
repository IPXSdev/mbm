import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create sync_finalizations table and related tables
    const { error: syncTableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create sync finalization tables
        CREATE TABLE IF NOT EXISTS sync_finalizations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            track_id UUID NOT NULL,
            user_id UUID NOT NULL,
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

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_sync_finalizations_track_id ON sync_finalizations(track_id);
        CREATE INDEX IF NOT EXISTS idx_sync_finalizations_user_id ON sync_finalizations(user_id);
        CREATE INDEX IF NOT EXISTS idx_sync_finalizations_status ON sync_finalizations(status);

        -- Create sync chat tables
        CREATE TABLE IF NOT EXISTS sync_chat_sessions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            track_id UUID NOT NULL,
            user_id UUID NOT NULL,
            admin_id UUID,
            status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(track_id)
        );

        CREATE TABLE IF NOT EXISTS sync_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            chat_session_id UUID NOT NULL REFERENCES sync_chat_sessions(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL,
            message TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for chat tables
        CREATE INDEX IF NOT EXISTS idx_sync_chat_sessions_track_id ON sync_chat_sessions(track_id);
        CREATE INDEX IF NOT EXISTS idx_sync_chat_sessions_user_id ON sync_chat_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_sync_messages_session_id ON sync_messages(chat_session_id);
        CREATE INDEX IF NOT EXISTS idx_sync_messages_created_at ON sync_messages(created_at);
      `
    })

    if (syncTableError) {
      console.error('Error creating sync tables:', syncTableError)
      
      // Fallback: Try creating tables one by one without exec_sql
      const { error: fallbackError } = await supabase
        .from('sync_finalizations')
        .select('id')
        .limit(1)

      if (fallbackError && fallbackError.code === '42P01') {
        // Table doesn't exist, try alternative method
        return NextResponse.json({
          success: false,
          error: 'Database setup requires manual intervention',
          message: 'Please run the SQL script in scripts/create-sync-tables.sql in your Supabase dashboard',
          fallbackError: syncTableError
        })
      }
    }

    // Test if tables were created successfully
    const { error: testError } = await supabase
      .from('sync_finalizations')
      .select('id')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to verify table creation',
        details: testError
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Sync finalization database tables created successfully!',
      tables: ['sync_finalizations', 'sync_chat_sessions', 'sync_messages']
    })

  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to setup database tables',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if tables exist
    const { error: syncError } = await supabase
      .from('sync_finalizations')
      .select('id')
      .limit(1)

    const { error: chatError } = await supabase
      .from('sync_chat_sessions')
      .select('id')
      .limit(1)

    const { error: messagesError } = await supabase
      .from('sync_messages')
      .select('id')
      .limit(1)

    return NextResponse.json({
      sync_finalizations: !syncError,
      sync_chat_sessions: !chatError,
      sync_messages: !messagesError,
      ready: !syncError && !chatError && !messagesError
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check database status', details: error.message },
      { status: 500 }
    )
  }
}