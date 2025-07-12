"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"
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

export default function AuthNavbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "master_admin"
  const isMasterAdmin = profile?.role === "master_admin"

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/podcast", label: "Podcast" },
    { href: "/placements", label: "Placements" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  if (loading) {
    return (
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Man Behind The Music
          </Link>
          <div>Loading...</div>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/submissions" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          Review Submissions
                        </Link>
                      </DropdownMenuItem>
                      {isMasterAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users" className="cursor-pointer">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Users
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                              <Link href="/admin">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-white hover:text-yellow-400"
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Admin Dashboard
                                </Button>
                              </Link>
                              <Link href="/admin/submissions">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-white hover:text-yellow-400"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Review Submissions
                                </Button>
                              </Link>
                              {isMasterAdmin && (
                                <Link href="/admin/users">
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
