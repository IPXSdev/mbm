"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Copy, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function SetupPage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Supabase Setup</h1>
        <p className="text-xl text-muted-foreground">Follow these steps to enable authentication</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Create Supabase Project */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              Create Supabase Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>
                Go to{" "}
                <Link
                  href="https://supabase.com"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  supabase.com <ExternalLink className="h-3 w-3" />
                </Link>{" "}
                and sign in (or create an account)
              </li>
              <li>Click the green "New Project" button</li>
              <li>Choose your organization (or create one)</li>
              <li>
                Fill in project details:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Name: "man-behind-the-music" (or any name you prefer)</li>
                  <li>Database Password: Create a strong password and save it!</li>
                  <li>Region: Choose closest to your location</li>
                </ul>
              </li>
              <li>Click "Create new project"</li>
              <li>
                <strong>Wait 2-3 minutes</strong> for the project to be created (you'll see a progress screen)
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 2: Get API Keys */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              Get Your API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>Once your project is ready, you'll be on the project dashboard</li>
              <li>
                In the left sidebar, click the <strong>Settings</strong> icon (gear icon) at the bottom
              </li>
              <li>
                Click <strong>API</strong> in the settings menu
              </li>
              <li>
                You'll see two important values:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>
                    <strong>Project URL</strong> - looks like: https://abcdefghijk.supabase.co
                  </li>
                  <li>
                    <strong>anon public key</strong> - a long string starting with "eyJ..."
                  </li>
                </ul>
              </li>
              <li>
                <strong>Keep this page open!</strong> You'll need these values in the next step
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 3: Create Environment File */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <div className="w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              Create .env.local File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                This file stores your secret keys safely. It must be in your project's root folder (same level as
                package.json).
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-medium">In VS Code:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Right-click in the file explorer (left sidebar)</li>
                <li>Select "New File"</li>
                <li>
                  Type exactly: <code className="bg-muted px-1 rounded">.env.local</code> (don't forget the dot!)
                </li>
                <li>Press Enter</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Add Environment Variables */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <div className="w-8 h-8 bg-orange-700 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              Add Your Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy this template into your <code className="bg-muted px-1 rounded">.env.local</code> file:
            </p>

            <div className="relative">
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="text-gray-500"># Supabase Configuration</div>
                <div>SUPABASE_URL=https://your-project-id.supabase.co</div>
                <div>SUPABASE_ANON_KEY=your_anon_key_here</div>
                <div>SUPABASE_SERVICE_KEY=your_service_role_key_here</div>
                <div></div>
                <div className="text-gray-500"># Site Configuration</div>
                <div>NEXT_PUBLIC_SITE_URL=http://localhost:3000</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() =>
                  copyToClipboard(
                    `# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
                    1,
                  )
                }
              >
                {copiedStep === 1 ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Now replace the placeholder values:</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-red-50">
                  <div className="font-medium text-sm">Replace:</div>
                  <code className="text-red-600">https://your-project-id.supabase.co</code>
                  <div className="text-sm text-muted-foreground mt-1">
                    With your actual Project URL from Supabase Settings → API
                  </div>
                </div>

                <div className="p-3 border rounded-lg bg-red-50">
                  <div className="font-medium text-sm">Replace:</div>
                  <code className="text-red-600">your_anon_key_here</code>
                  <div className="text-sm text-muted-foreground mt-1">
                    With your anon public key from Supabase Settings → API
                  </div>
                </div>

                <div className="p-3 border rounded-lg bg-red-50">
                  <div className="font-medium text-sm">Replace:</div>
                  <code className="text-red-600">your_service_role_key_here</code>
                  <div className="text-sm text-muted-foreground mt-1">
                    With your service role key from Supabase Settings → API (scroll down to find it)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Restart Server */}
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <div className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              Restart Development Server
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Critical:</strong> You MUST restart your development server for environment variables to work!
              </AlertDescription>
            </Alert>

            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Save your .env.local file (Cmd+S or Ctrl+S)</li>
              <li>Go to your terminal where npm run dev is running</li>
              <li>
                Press <kbd className="bg-muted px-2 py-1 rounded">Ctrl+C</kbd> to stop the server
              </li>
              <li>
                Type: <code className="bg-muted px-1 rounded">npm run dev</code> and press Enter
              </li>
              <li>Wait for "Ready" message</li>
              <li>Refresh your browser page</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 6: Test */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              Test Your Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">After restarting, you should see:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>✅ "Supabase client initialized successfully" in browser console</li>
              <li>No more "environment variables not found" warnings</li>
              <li>Login page should work (even if you don't have an account yet)</li>
            </ul>

            <div className="flex gap-2">
              <Button asChild>
                <Link href="/login">Test Login Page</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Still Having Issues?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>Common Problems:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>File named wrong - must be exactly ".env.local" (with the dot)</li>
                <li>File in wrong location - must be in project root, same level as package.json</li>
                <li>Forgot to restart server - environment variables only load on startup</li>
                <li>Extra spaces in the file - make sure no spaces around the = sign</li>
                <li>Wrong keys copied - double-check you copied the right values from Supabase</li>
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Check your browser console (F12)</strong> for detailed error messages and confirmation that
                Supabase is working.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
