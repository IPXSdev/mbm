"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"

export default function GrantAdminForm() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    // Find user by email
    const { data: profile, error } = await supabase.from("profiles").select("id, email, full_name, role").eq("email", email).single()
    if (error || !profile) {
      setStatus("User not found. Make sure they have signed up.")
      setLoading(false)
      return
    }
    // Update role to admin
    const { error: updateError } = await supabase.from("profiles").update({ role: "admin", full_name: fullName }).eq("id", profile.id)
    if (updateError) {
      setStatus("Failed to grant admin access: " + updateError.message)
    } else {
      setStatus(`Granted admin access to ${email}`)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleGrant} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg bg-black text-white">
      <h2 className="text-xl font-bold mb-2">Grant Admin Access</h2>
      <div>
        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Email Address</label>
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
        {loading ? "Granting..." : "Grant Admin Access"}
      </Button>
      {status && <div className="mt-2 text-sm text-yellow-400">{status}</div>}
    </form>
  )
}
