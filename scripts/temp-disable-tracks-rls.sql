-- Temporarily disable RLS on tracks table to test sync finalization
-- Run this in your Supabase SQL editor

-- Disable RLS on tracks table temporarily for testing
ALTER TABLE tracks DISABLE ROW LEVEL SECURITY;

-- We'll re-enable it later once sync finalization is working
