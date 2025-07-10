import { type NextRequest, NextResponse } from "next/server"
import { createUserWithRole, getCurrentUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if current user is master admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "master_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { email, password, fullName, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const userId = await createUserWithRole(email, password, fullName, role)

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
