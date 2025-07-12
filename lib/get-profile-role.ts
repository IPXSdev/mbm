import { createClient } from "@/lib/supabase-client"

export async function getProfileRole(userId: string, email: string): Promise<"user" | "admin" | "master_admin" | null> {
  const supabase = createClient()
  // Check by user id
  const { data: profile } = await supabase.from("profiles").select("role, email").eq("id", userId).single()
  if (profile?.role === "admin" || profile?.role === "master_admin") return profile.role
  // Fallback: check by email for hardcoded master admin (case-insensitive)
  if (email?.toLowerCase() === "2668harris@gmail.com") return "master_admin"
  return profile?.role || null
}
