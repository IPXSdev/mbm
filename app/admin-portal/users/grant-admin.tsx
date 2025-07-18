"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GrantAdmin() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Find the user by email
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

      if (userError || !user) {
        setMessage("User not found.")
        return
      }

      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)

      if (updateError) {
        setMessage("Failed to grant admin privileges.")
        return
      }

      setMessage("Admin privileges granted successfully.")
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleGrantAdmin} className="space-y-4">
      <Input
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Granting..." : "Grant Admin"}
      </Button>
      {message && <div className="text-sm mt-2">{message}</div>}
    </form>
  )
}