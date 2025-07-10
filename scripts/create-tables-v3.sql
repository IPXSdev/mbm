-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table (if it doesn't exist)
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'master_admin')
        )
    );

CREATE POLICY "Master admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'master_admin'
        )
    );

CREATE POLICY "Anyone can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Submissions policies
CREATE POLICY "Users can view their own submissions" ON public.submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" ON public.submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON public.submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'master_admin')
        )
    );

CREATE POLICY "Admins can update all submissions" ON public.submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'master_admin')
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_submissions ON public.submissions;
CREATE TRIGGER handle_updated_at_submissions
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample data for demo
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@manbehindthemusic.com', 'Master Admin', 'master_admin')
ON CONFLICT (email) DO UPDATE SET role = 'master_admin';

-- Insert sample submissions for demo
INSERT INTO public.submissions (id, user_id, title, artist, email, genre, status, priority, rating, admin_notes) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Sample Track 1', 'Demo Artist', 'demo@example.com', 'Hip-Hop', 'pending', 'high', 4, 'Great potential for sync placement'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Sample Track 2', 'Another Artist', 'artist@example.com', 'R&B', 'approved', 'medium', 5, 'Perfect for romantic scenes'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Sample Track 3', 'Indie Artist', 'indie@example.com', 'Pop', 'under_review', 'low', 3, 'Needs some mixing work')
ON CONFLICT (id) DO NOTHING;
