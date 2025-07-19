import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error("Supabase environment variables not set")
    return null
  }
  return { url, key }
}

export async function createClient() {
  const cfg = getConfig()
  if (!cfg) {
    return {} as any
  }

  // Use await to get the cookie store for SSR
  const cookieStore = await cookies()

  return createServerClient(cfg.url, cfg.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.error("Error getting user:", error)
    return null
  }
  return data.user
}