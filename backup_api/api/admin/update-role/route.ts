import { type NextRequest, NextResponse } from "next/server"
import { updateUserRole, getCurrentUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if current user is master admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "master_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    await updateUserRole(userId, role)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
