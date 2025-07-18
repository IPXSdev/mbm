import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Present" : "Missing")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing")
}

let supabase: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error("Supabase environment variables not set")
    return {} as any
  }
  if (!supabase) {
    supabase = createBrowserClient(url, key)
  }
  return supabase
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
