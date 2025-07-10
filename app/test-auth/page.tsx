"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/auth-client"

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>("Testing...")
  const [details, setDetails] = useState<string>("")

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus("🔄 Testing Supabase connection...")

      // Check environment variables
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      let details = `Environment Variables:\n`
      details += `- NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? "✅ Set" : "❌ Missing"}\n`
      details += `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasKey ? "✅ Set" : "❌ Missing"}\n\n`

      if (hasUrl) {
        details += `URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n\n`
      }

      // Test connection
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus("❌ Connection Failed")
        details += `Error: ${error.message}\n\n`

        if (error.message.includes("Invalid API key")) {
          details += `🚨 API Key Issue:\n`
          details += `1. Check if your Supabase project is paused\n`
          details += `2. Verify your API key in Supabase dashboard\n`
          details += `3. Make sure you're using the 'anon' key\n`
        }
      } else {
        setStatus("✅ Connection Successful")
        details += `Session: ${data.session ? "Active" : "None"}\n`
      }

      setDetails(details)
    } catch (err: any) {
      setStatus("❌ Test Failed")
      setDetails(`Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-lg font-medium">{status}</div>

            <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap overflow-auto">{details}</pre>

            <Button onClick={testConnection} className="w-full">
              Test Again
            </Button>

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Next Steps:</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>If environment variables are missing, check your .env.local file</li>
                <li>If you see "Invalid API key", check your Supabase project status</li>
                <li>Make sure your Supabase project is not paused</li>
                <li>Verify your API keys in the Supabase dashboard</li>
              </ol>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-semibold text-red-800 mb-2">🚨 Common Issue: Project Paused</p>
              <p className="text-xs text-red-700 mb-2">
                Supabase free tier projects automatically pause after 1 week of inactivity.
              </p>
              <div className="mt-3 p-2 bg-red-100 rounded text-xs">
                <p>
                  <strong>To fix this:</strong>
                </p>
                <p>
                  1. Go to{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    supabase.com/dashboard
                  </a>
                </p>
                <p>2. Find your project: izeozsebupuihhitwwql</p>
                <p>3. If you see a "Resume" button, click it</p>
                <p>4. Wait for the project to become active again</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
