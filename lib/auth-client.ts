import { createClient } from "@supabase/supabase-js"

// Mock client for development when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    getUser: async () => ({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: { message: "Supabase not configured. Please add environment variables." },
    }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: { message: "Supabase not configured. Please add environment variables." },
    }),
    signOut: async () => ({
      error: null,
    }),
    resetPasswordForEmail: async () => ({
      data: null,
      error: { message: "Supabase not configured. Please add environment variables." },
    }),
    onAuthStateChange: (callback: any) => {
      if (callback) {
        setTimeout(() => callback("SIGNED_OUT", null), 0)
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    },
  },
  from: (table: string) => ({
    select: (columns?: string) => Promise.resolve({ data: [], error: null }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    upsert: (data: any) => Promise.resolve({ data: null, error: null }),
  }),
})

let supabaseClient: any = null
let isInitialized = false

function initializeSupabaseClient() {
  if (isInitialized) {
    return supabaseClient
  }

  // Only initialize on client side
  if (typeof window !== "undefined") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("🔍 Checking environment variables...")
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing")

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("⚠️ Supabase environment variables not found.")
      console.log("📝 To fix this:")
      console.log("1. Create a .env.local file in your project root")
      console.log("2. Add your Supabase credentials")
      console.log("3. Restart the development server")
      console.log("4. Visit /setup for detailed instructions")

      supabaseClient = createMockClient()
    } else {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce",
          },
        })
        console.log("✅ Supabase client initialized successfully")
        console.log("🔗 Connected to:", supabaseUrl)
      } catch (error) {
        console.error("❌ Failed to initialize Supabase client:", error)
        supabaseClient = createMockClient()
      }
    }
  } else {
    // Server-side: always use mock client for now
    supabaseClient = createMockClient()
  }

  isInitialized = true
  return supabaseClient
}

// Export the client with lazy initialization
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = initializeSupabaseClient()
    return client[prop]
  },
})

export default supabase
