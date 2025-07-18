import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase =
  typeof window !== "undefined"
    ? (window as any).supabase ||
      ((window as any).supabase = createBrowserClient(supabaseUrl, supabaseAnonKey))
    : createBrowserClient(supabaseUrl, supabaseAnonKey)