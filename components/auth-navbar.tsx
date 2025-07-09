"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { supabase } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export function AuthNavbar() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Session error:", error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setUser(session?.user || null)
          setLoading(false)
        }
      } catch (error) {
        console.error("Auth error:", error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      if (mounted) {
        setUser(session?.user || null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      } else {
        setUser(null)
        router.push("/")
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/episodes", label: "Episodes" },
    { href: "/podcast", label: "Podcast" },
    { href: "/placements", label: "Placements" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/store", label: "Store" },
    { href: "/contact", label: "Contact" },
  ]

  const userNavItems = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/submit", label: "Submit Music" },
        { href: "/profile", label: "Profile" },
      ]
    : []

  const allNavItems = [...navItems, ...userNavItems]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Man Behind The Music</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{user.user_metadata?.full_name || user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {allNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="border-t pt-4 mt-4">
                  {loading ? (
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  ) : user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {/* User icon is removed to avoid redeclaration */}
                        <span>{user.user_metadata?.full_name || user.email}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full bg-transparent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="w-full">
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
