"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, Play } from "lucide-react"

export default function SetupSyncTablesPage() {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [tableStatus, setTableStatus] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/setup-sync-tables")
      const data = await response.json()
      
      if (response.ok) {
        setTableStatus(data)
        if (data.ready) {
          setStatus("✅ All sync finalization tables are ready!")
        } else {
          setStatus("⚠️ Some tables are missing")
        }
      } else {
        setError(data.error || "Failed to check database status")
      }
    } catch (err: any) {
      setError("Failed to connect to database")
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    try {
      setLoading(true)
      setError("")
      setStatus("Creating database tables...")

      const response = await fetch("/api/setup-sync-tables", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus("✅ Database tables created successfully! The finalization form is now ready.")
        // Check status again to confirm
        setTimeout(checkDatabaseStatus, 1000)
      } else {
        setError(data.error || "Failed to create database tables")
        if (data.message) {
          setStatus(data.message)
        }
      }
    } catch (err: any) {
      setError("Failed to setup database: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Sync Finalization Database Setup
        </h1>
        <p className="text-blue-700">
          Set up the required database tables for the sync finalization system
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>
              Check if the sync finalization tables exist in your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkDatabaseStatus}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Check Database Status
            </Button>

            {tableStatus && (
              <div className="space-y-2">
                <h4 className="font-medium">Table Status:</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    {tableStatus.sync_finalizations ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>sync_finalizations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tableStatus.sync_chat_sessions ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>sync_chat_sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tableStatus.sync_messages ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>sync_messages</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Setup Database Tables
            </CardTitle>
            <CardDescription>
              Create the required tables for sync finalization functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={setupDatabase}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Create Database Tables
            </Button>

            {status && (
              <Alert>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Setup Instructions</CardTitle>
            <CardDescription>
              If the automatic setup doesn't work, follow these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>1.</strong> Go to your Supabase Dashboard</p>
              <p><strong>2.</strong> Navigate to SQL Editor</p>
              <p><strong>3.</strong> Copy and run the SQL script from:</p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                scripts/create-sync-tables.sql
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
