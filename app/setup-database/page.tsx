"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DatabaseSetupPage() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [adminStatus, setAdminStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("2668harris@gmail.com")

  const setupDatabase = async () => {
    setSetupStatus("loading")
    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
      })
      const result = await response.json()
      
      if (result.success) {
        setSetupStatus("success")
        setMessage("Database tables created successfully!")
      } else {
        setSetupStatus("error")
        setMessage(result.message || "Failed to setup database")
      }
    } catch (error) {
      setSetupStatus("error")
      setMessage("Error setting up database")
    }
  }

  const setUserAsAdmin = async () => {
    setAdminStatus("loading")
    try {
      const response = await fetch("/api/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()
      
      if (result.success) {
        setAdminStatus("success")
        setMessage("User set as admin successfully! You can now access the admin portal.")
      } else {
        setAdminStatus("error")
        setMessage(result.error || "Failed to set user as admin")
      }
    } catch (error) {
      setAdminStatus("error")
      setMessage("Error setting user as admin")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-6">Database Setup</h1>
      
      {message && (
        <Alert className={`mb-6 ${setupStatus === "error" || adminStatus === "error" ? "bg-red-500/20 border-red-500/50" : "bg-green-500/20 border-green-500/50"}`}>
          <AlertDescription className="text-white">{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Step 1: Create Database Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This will create the profiles and submissions tables with proper Row Level Security policies.
            </p>
            <Button 
              onClick={setupDatabase} 
              disabled={setupStatus === "loading"}
              className="w-full"
            >
              {setupStatus === "loading" ? "Setting up..." : "Setup Database"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Step 2: Set User as Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email to make admin:</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button 
                onClick={setUserAsAdmin} 
                disabled={adminStatus === "loading" || !email}
                className="w-full"
              >
                {adminStatus === "loading" ? "Setting admin..." : "Make Admin"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {setupStatus === "success" && adminStatus === "success" && (
          <Card className="bg-green-500/20 border-green-500/50">
            <CardContent className="pt-6">
              <p className="text-white text-center">
                🎉 Setup complete! You can now access the{" "}
                <a href="/admin" className="text-blue-400 hover:underline">
                  Admin Portal
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-white font-semibold mb-2">Manual Setup (if needed):</h3>
        <p className="text-gray-300 text-sm">
          If the automatic setup fails, go to your Supabase SQL Editor and run the contents of{" "}
          <code className="bg-gray-700 px-1 rounded">scripts/create-tables-v3.sql</code>
        </p>
      </div>
    </div>
  )
}
