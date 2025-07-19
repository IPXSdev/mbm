"use server"

import { supabase } from "@/lib/supabase-client"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  console.log("SignUp attempt for:", email)

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (authError) {
    console.error("Auth error:", authError)
    return { error: authError.message }
  }

  console.log("SignUp successful:", authData.user?.email)

  // Create profile - but don't fail if it already exists
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      email,
      full_name: name,
      role: "user",
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't return error - continue with signup
    }
  }

  // If user needs email confirmation, return success message
  if (authData.user && !authData.session) {
    return {
      success: true,
      message: "Please check your email to verify your account before signing in.",
    }
  }

  // If user is immediately signed in, redirect to dashboard
  if (authData.session) {
    revalidatePath("/")
    redirect("/dashboard")
  }

  return { success: true, message: "Account created successfully!" }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("SignIn attempt for:", email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error)
    return { error: error.message }
  }

  console.log("SignIn successful:", data.user?.email)

  revalidatePath("/")
  redirect("/dashboard")
}

export async function signOut() {
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}