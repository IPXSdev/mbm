import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API route called")

    if (!supabaseAdmin) {
      console.error("Supabase credentials missing")
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      )
    }
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const userId = formData.get("userId") as string

    if (!file || !bucket || !userId) {
      return NextResponse.json(
        { error: "Missing file, bucket, or userId" },
        { status: 400 }
      )
    }

    console.log("Uploading file:", file.name, "to bucket:", bucket, "for user:", userId)

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json(
        { error: "Upload failed", details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Upload returned no data" },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName)

    console.log("Upload successful:", publicUrl)
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName
    })

  } catch (error: any) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    )
  }
}
