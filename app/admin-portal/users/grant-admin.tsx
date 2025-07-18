"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"

export default function GrantAdminForm() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [mode, setMode] = useState<"grant" | "revoke">("grant")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    
    // Find user by email
    const { data: profile, error } = await supabase.from("profiles").select("id, email, name, role").eq("email", email).single()
    if (error || !profile) {
      setStatus("User not found. Make sure they have signed up.")
      setLoading(false)
      return
    }

    // Check current role and determine action
    if (mode === "grant") {
      if (profile.role === "admin" || profile.role === "master_admin") {
        setStatus(`${email} already has admin privileges.`)
        setLoading(false)
        return
      }
      // Update role to admin
      const { error: updateError } = await supabase.from("profiles").update({ role: "admin", name: fullName }).eq("id", profile.id)
      if (updateError) {
        setStatus("Failed to grant admin access: " + updateError.message)
      } else {
        setStatus(`✅ Granted admin access to ${email}`)
      }
    } else {
      // Revoke mode
      if (profile.role === "user") {
        setStatus(`${email} is already a regular user.`)
        setLoading(false)
        return
      }
      if (profile.role === "master_admin") {
        setStatus("Cannot revoke master admin privileges.")
        setLoading(false)
        return
      }
      // Update role to user
      const { error: updateError } = await supabase.from("profiles").update({ role: "user" }).eq("id", profile.id)
      if (updateError) {
        setStatus("Failed to revoke admin access: " + updateError.message)
      } else {
        setStatus(`🔒 Revoked admin access from ${email}`)
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleRoleChange} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg bg-black text-white">
      <h2 className="text-xl font-bold mb-2">Admin Privileges</h2>
      
      {/* Toggle for Grant/Revoke */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
        <button
          type="button"
          onClick={() => setMode("grant")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 ${
            mode === "grant"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🔓 Grant Access
        </button>
        <button
          type="button"
          onClick={() => setMode("revoke")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 ${
            mode === "revoke"
              ? "bg-red-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🔒 Revoke Access
        </button>
      </div>

      <div>
        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required={mode === "grant"}
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
        {loading 
          ? (mode === "grant" ? "Granting..." : "Revoking...") 
          : (mode === "grant" ? "Grant Admin Access" : "Revoke Admin Access")
        }
      </Button>
      {status && <div className="mt-2 text-sm text-yellow-400">{status}</div>}
    </form>
  )
}
