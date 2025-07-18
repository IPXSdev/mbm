import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Get environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip middleware if Supabase credentials are not properly configured
  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.includes(".supabase.co")) {
    console.log("⚠️ Middleware: Supabase credentials not configured properly, skipping auth middleware")
    return response
  }

  // Skip middleware for certain paths
  const path = request.nextUrl.pathname
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") ||
    path === "/debug-supabase" ||
    path === "/test-simple" ||
    path === "/favicon.ico" ||
    path === "/dashboard" // SKIP DASHBOARD - let the page handle auth
  ) {
    console.log("Middleware: Skipping auth check for", path)
    return response
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    console.log(
      "Middleware: Auth check for",
      path,
      "- User:",
      !!user,
      "User ID:",
      user?.id?.slice(0, 8),
      "Error:",
      !!error,
    )

    // If user is signed in and trying to access login/signup, redirect to dashboard
    if (user && (path === "/login" || path === "/signup")) {
      console.log("Middleware: Redirecting authenticated user from", path, "to /dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // DO NOT redirect from dashboard - let the page handle it
    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error with Supabase, just continue without auth checks
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
