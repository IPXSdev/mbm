import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

  const cookieStore = cookies()

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
  if (!supabase.auth) {
    return null
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Try to get profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.user_metadata?.name || "User",
    role: profile?.role || "user",
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "admin" && user.role !== "master_admin") {
    throw new Error("Admin access required")
  }
  return user
}
