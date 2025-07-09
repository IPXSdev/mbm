import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">Legal terms and conditions for using our platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: January 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using The Man Behind The Music platform, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>

          <h2>2. Music Submission</h2>
          <p>
            By submitting music to our platform, you grant us the right to review, evaluate, and potentially feature
            your music in our content and recommend it for placement opportunities.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for restricting
            access to your computer.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            You retain all rights to your submitted music. We do not claim ownership of your content, but you grant us
            permission to use it for evaluation and placement purposes.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
            Service.
          </p>

          <h2>6. Subscription Services</h2>
          <p>
            Our platform offers subscription-based services. By subscribing, you agree to pay the applicable fees and
            comply with the subscription terms.
          </p>

          <h2>7. Prohibited Uses</h2>
          <p>
            You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You may
            not violate any local, state, national, or international law.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or
            liability, under our sole discretion, for any reason whatsoever.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via
            email or through our platform.
          </p>

          <h2>10. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at legal@manbehindthemusic.com</p>
        </CardContent>
      </Card>
    </div>
  )
}
