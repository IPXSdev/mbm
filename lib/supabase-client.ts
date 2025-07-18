import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Present" : "Missing")
  console.error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "Present" : "Missing",
  )
}

declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient: ReturnType<typeof createBrowserClient> | undefined
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error("Supabase environment variables not set")
    return {} as any
  }

  if (typeof window !== "undefined") {
    if (!globalThis.__supabaseClient) {
      globalThis.__supabaseClient = createBrowserClient(url, key)
    }
    return globalThis.__supabaseClient
  }

  if (!globalThis.__supabaseClient) {
    globalThis.__supabaseClient = createBrowserClient(url, key)
  }
  return globalThis.__supabaseClient
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
