import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This endpoint makes the current user an admin
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: "Email is required"
      }, { status: 400 })
    }

    // Use admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log("Setting user as admin:", email)

    // First, try to get the user by email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (getUserError) {
      console.error("Error getting users:", getUserError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to get users"
      }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found"
      }, { status: 404 })
    }

    // Update or create the user's profile
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || email.split('@')[0],
        role: 'master_admin'
      })

    if (upsertError) {
      console.error("Error upserting profile:", upsertError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to update user profile"
      }, { status: 500 })
    }

    console.log("User successfully set as admin!")

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now a master admin!`
    })

  } catch (error) {
    console.error("Set admin error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
