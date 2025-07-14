import { type NextRequest, NextResponse } from "next/server"
import { deleteUser, getCurrentUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if current user is master admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "master_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
