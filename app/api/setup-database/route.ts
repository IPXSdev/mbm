import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This endpoint sets up the database tables and initial data
export async function POST() {
  try {
    // Use admin client for database setup
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log("Setting up database...")

    // Create profiles table directly
    const { error: createProfilesError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)

    // If profiles table doesn't exist, we'll get an error, so let's create it using a direct approach
    const setupSQL = `
      -- Create profiles table
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master_admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create submissions table
      CREATE TABLE IF NOT EXISTS public.submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        email TEXT NOT NULL,
        genre TEXT NOT NULL,
        file_url TEXT,
        file_name TEXT,
        file_size BIGINT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        admin_notes TEXT,
        reviewed_by TEXT,
        reviewed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        description TEXT,
        image_url TEXT
      );

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

      -- Create policies for profiles
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
          CREATE POLICY "Users can view their own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert profiles' AND tablename = 'profiles') THEN
          CREATE POLICY "Anyone can insert profiles" ON public.profiles
            FOR INSERT WITH CHECK (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all profiles' AND tablename = 'profiles') THEN
          CREATE POLICY "Admins can view all profiles" ON public.profiles
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'master_admin')
              )
            );
        END IF;
      END $$;

      -- Create policies for submissions  
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own submissions' AND tablename = 'submissions') THEN
          CREATE POLICY "Users can view their own submissions" ON public.submissions
            FOR SELECT USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own submissions' AND tablename = 'submissions') THEN
          CREATE POLICY "Users can insert their own submissions" ON public.submissions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all submissions' AND tablename = 'submissions') THEN
          CREATE POLICY "Admins can view all submissions" ON public.submissions
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'master_admin')
              )
            );
        END IF;
      END $$;

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
      CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);
    `

    // We'll try a different approach - using the REST API to execute SQL
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({
        sql: setupSQL
      })
    })

    if (!response.ok) {
      // If RPC doesn't work, let's try creating tables individually
      console.log("RPC failed, trying individual table creation...")
      
      // Try to create a test entry to see if tables exist
      try {
        await supabaseAdmin.from('submissions').select('id').limit(1)
        console.log("Submissions table already exists")
      } catch (error) {
        console.log("Creating tables manually...")
        // Tables don't exist, return instructions for manual setup
        return NextResponse.json({ 
          success: false, 
          message: "Please run the SQL setup manually",
          instructions: "Go to Supabase SQL Editor and paste the create-tables-v3.sql content",
          sql: setupSQL
        })
      }
    }

    console.log("Database setup completed!")

    return NextResponse.json({ 
      success: true, 
      message: "Database setup completed successfully!"
    })

  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Please run the SQL setup manually in Supabase Dashboard"
    }, { status: 500 })
  }
}
