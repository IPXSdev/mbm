"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Menu, UserIcon, LogOut, Settings, Shield, Users, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Profile {
  id: string
  email: string
  full_name?: string
  role: "user" | "admin" | "master_admin"
}

// Use the same client configuration as db.ts to avoid multiple instances
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseClient: any = null
if (typeof window !== 'undefined' && !supabaseClient) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export default function AuthNavbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!supabaseClient) return

    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser()
        
        if (!mounted) return
        
        setUser(user)

        if (user) {
          try {
            const { data: profileData } = await supabaseClient.from("profiles").select("*").eq("id", user.id).single()
            if (mounted) {
              setProfile(profileData)
            }
          } catch (profileError) {
            console.warn("Could not fetch profile:", profileError)
            // Continue without profile data
          }
        }

        if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Set a timeout to ensure loading state doesn't persist too long
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth loading timeout - forcing loaded state")
        setLoading(false)
      }
    }, 3000)

    getUser()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return
      
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const { data: profileData } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()
          if (mounted) {
            setProfile(profileData)
          }
        } catch (profileError) {
          console.warn("Could not fetch profile:", profileError)
          // Continue without profile data
        }
      } else {
        if (mounted) {
          setProfile(null)
        }
      }

      if (mounted) {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setLoading(true)
      
      // Clear local state immediately
      setUser(null)
      setProfile(null)
      
      // Sign out from Supabase
      const { error } = await supabaseClient.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error("Error signing out:", error)
      }
      
      // Clear any localStorage/sessionStorage related to auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
        
        // Force a hard reload to clear all state
        window.location.href = "/"
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "master_admin" || (user?.email?.toLowerCase() === "2668harris@gmail.com")
  const isMasterAdmin = profile?.role === "master_admin" || (user?.email?.toLowerCase() === "2668harris@gmail.com")

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/podcast", label: "Podcast" },
    { href: "/placements", label: "Placements" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  // Show loading only initially while checking auth state
  if (loading) {
    return (
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Man Behind The Music
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-yellow-400 transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="text-sm">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Man Behind The Music
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-yellow-400 transition-colors">
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/submit">
                <Button variant="ghost" className="text-white hover:text-yellow-400">
                  Submit Music
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-yellow-400">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="text-white hover:text-yellow-400" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-yellow-400">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="ghost" className="text-white hover:text-yellow-400">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white">
                <Menu className="h-6 w-6" />
                <VisuallyHidden>Open menu</VisuallyHidden>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white border-gray-800">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-lg hover:text-yellow-400 transition-colors">
                    {item.label}
                  </Link>
                ))}

                {user ? (
                  <>
                    <div className="border-t border-gray-800 pt-4">
                      <p className="text-sm text-gray-400 mb-4">{profile?.full_name || user.email}</p>
                      <div className="flex flex-col space-y-2">
                        <Link href="/submit">
                          <Button
                            variant="ghost"
                            className="w-full text-white hover:text-yellow-400"
                          >
                            Submit Music
                          </Button>
                        </Link>
                        <Link href="/profile">
                          <Button variant="ghost" className="w-full justify-start text-white hover:text-yellow-400">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full justify-start text-white hover:text-yellow-400">
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>

                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-800 pt-2 mt-2">
                              <p className="text-xs text-gray-400 mb-2">Admin</p>
                              <Link href="/admin-portal">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-white hover:text-yellow-400"
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Admin Dashboard
                                </Button>
                              </Link>
                              <Link href="/admin-portal/submissions">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-white hover:text-yellow-400"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Review Submissions
                                </Button>
                              </Link>
                              {isMasterAdmin && (
                                <Link href="/admin-portal/users">
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-white hover:text-yellow-400"
                                  >
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Users
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:text-yellow-400"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full text-white hover:text-yellow-400">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        variant="ghost"
                        className="w-full text-white hover:text-yellow-400"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

// Named export for compatibility
export { AuthNavbar }
