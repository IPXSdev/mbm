import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was an issue verifying your email. This could be because:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• The verification link has expired</li>
            <li>• The link has already been used</li>
            <li>• There was a network issue</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/login">Try Logging In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Create New Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
