import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">How we collect, use, and protect your information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy Details</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: January 2024</p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, submit music, or
            contact us for support.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, process transactions, and
            communicate with you.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent, except as described in this policy.
          </p>

          <h2>4. Music Submissions</h2>
          <p>
            When you submit music to our platform, we may share it with industry professionals, A&Rs, and music
            supervisors for evaluation and placement opportunities.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our platform and analyze
            usage patterns.
          </p>

          <h2>7. Third-Party Services</h2>
          <p>
            Our platform may integrate with third-party services. This privacy policy does not apply to the practices of
            companies we do not own or control.
          </p>

          <h2>8. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. You may also opt out of certain
            communications from us.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect personal information from
            children under 13.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting
            the new policy on this page.
          </p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@manbehindthemusic.com</p>
        </CardContent>
      </Card>
    </div>
  )
}
