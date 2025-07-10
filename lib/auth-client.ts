import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Present" : "Missing")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing")
}

export const supabase = createClient()

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.includes(".supabase.co"))
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlFormat: supabaseUrl?.includes(".supabase.co"),
    keyFormat: supabaseAnonKey?.startsWith("eyJ"),
    configured: isSupabaseConfigured(),
  }
}