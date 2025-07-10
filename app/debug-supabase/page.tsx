"use client"

import { useState, useEffect } from "react"

export default function DebugSupabasePage() {
  const [mounted, setMounted] = useState(false)
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setMounted(true)

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvVars({
      url: supabaseUrl,
      key: supabaseKey,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlValid: supabaseUrl?.includes(".supabase.co") && !supabaseUrl.includes("placeholder"),
      keyValid: supabaseKey?.startsWith("eyJ") && !supabaseKey.includes("placeholder"),
    })

    console.log("Environment check:", {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      urlValid: supabaseUrl?.includes(".supabase.co") && !supabaseUrl.includes("placeholder"),
      keyValid: supabaseKey?.startsWith("eyJ") && !supabaseKey.includes("placeholder"),
    })
  }, [])

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1f2937",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid #ffffff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto",
            }}
          ></div>
          <p style={{ color: "#ffffff" }}>Loading debug information...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "16px", backgroundColor: "#1f2937" }}>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "24px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color: "#111827" }}>
            Supabase Configuration Debug
          </h1>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>
              Environment Variables Status
            </h3>

            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: envVars.urlValid ? "#dcfce7" : "#fee2e2",
                    color: envVars.urlValid ? "#166534" : "#991b1b",
                    fontWeight: "600",
                  }}
                >
                  {envVars.url || "NOT SET"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY:
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: envVars.keyValid ? "#dcfce7" : "#fee2e2",
                    color: envVars.keyValid ? "#166534" : "#991b1b",
                    fontWeight: "600",
                  }}
                >
                  {envVars.key ? "***hidden***" : "NOT SET"}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#dbeafe",
                border: "1px solid #93c5fd",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              <h4 style={{ fontWeight: "500", marginBottom: "8px", color: "#1e40af" }}>Configuration Status</h4>
              <div style={{ fontSize: "14px", color: "#1e40af" }}>
                <p style={{ marginBottom: "4px" }}>URL Present: {envVars.hasUrl ? "✅ Yes" : "❌ No"}</p>
                <p style={{ marginBottom: "4px" }}>API Key Present: {envVars.hasKey ? "✅ Yes" : "❌ No"}</p>
                <p style={{ marginBottom: "4px" }}>URL Valid: {envVars.urlValid ? "✅ Yes" : "❌ No (placeholder)"}</p>
                <p>Key Valid: {envVars.keyValid ? "✅ Yes" : "❌ No (placeholder)"}</p>
              </div>
            </div>

            {envVars.urlValid && envVars.keyValid ? (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ fontWeight: "500", marginBottom: "8px", color: "#166534" }}>🎉 Configuration Complete!</h4>
                <p style={{ fontSize: "14px", color: "#166534" }}>
                  Your Supabase configuration is working correctly. You can now use authentication features.
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fcd34d",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ fontWeight: "500", marginBottom: "8px", color: "#92400e" }}>Next Steps:</h4>
                <ol
                  style={{
                    paddingLeft: "20px",
                    fontSize: "14px",
                    color: "#92400e",
                    lineHeight: "1.5",
                  }}
                >
                  <li style={{ marginBottom: "4px" }}>
                    Go to{" "}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      style={{ textDecoration: "underline", color: "#2563eb" }}
                      rel="noreferrer"
                    >
                      supabase.com/dashboard
                    </a>
                  </li>
                  <li style={{ marginBottom: "4px" }}>Sign in to your account</li>
                  <li style={{ marginBottom: "4px" }}>Create a new project or find your existing one</li>
                  <li style={{ marginBottom: "4px" }}>Go to Settings → API</li>
                  <li style={{ marginBottom: "4px" }}>Copy the Project URL and anon public key</li>
                  <li style={{ marginBottom: "4px" }}>Update your .env.local file with the real values</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
