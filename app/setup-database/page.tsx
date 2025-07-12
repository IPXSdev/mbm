"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DatabaseSetupPage() {
  const sqlScript = `-- Create profiles table
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
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- Create policies for submissions
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("SQL script copied to clipboard!")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Database Setup Instructions</h1>
      
      <div className="space-y-6">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Step 1: Run SQL Script in Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="text-gray-300 space-y-2">
              <li>1. Go to your <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-400 hover:underline">Supabase Dashboard</a></li>
              <li>2. Navigate to SQL Editor (in the left sidebar)</li>
              <li>3. Copy the SQL script below and paste it into the editor</li>
              <li>4. Click "Run" to execute the script</li>
            </ol>
            
            <div className="bg-gray-900 p-4 rounded-lg relative">
              <Button 
                onClick={() => copyToClipboard(sqlScript)}
                className="absolute top-2 right-2 z-10"
                size="sm"
              >
                Copy SQL
              </Button>
              <pre className="text-sm text-gray-300 overflow-auto max-h-96">
                <code>{sqlScript}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Step 2: Set Yourself as Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              After running the SQL script above, run this command to make yourself an admin:
            </p>
            
            <div className="bg-gray-900 p-4 rounded-lg relative">
              <Button 
                onClick={() => copyToClipboard("UPDATE public.profiles SET role = 'master_admin' WHERE email = '2668harris@gmail.com';")}
                className="absolute top-2 right-2 z-10"
                size="sm"
              >
                Copy SQL
              </Button>
              <pre className="text-sm text-gray-300">
                <code>UPDATE public.profiles SET role = 'master_admin' WHERE email = '2668harris@gmail.com';</code>
              </pre>
            </div>
            
            <p className="text-gray-400 text-sm">
              Replace '2668harris@gmail.com' with your actual email address if different.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/20 border-green-500/50">
          <CardContent className="pt-6">
            <p className="text-white text-center">
              🎉 After completing both steps, you can access the{" "}
              <a href="/admin" className="text-blue-400 hover:underline">
                Admin Portal
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
