import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Admin from "@/models/Admin"

export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")

    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const adminUsername = adminCookie.value

    // Connect to database
    await connectToDatabase()

    // Get admin data
    const admin = await Admin.findOne({ username: adminUsername })

    if (!admin) {
      cookies().delete("admin")
      return NextResponse.json({ message: "Admin not found" }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      admin: admin.username,
    })
  } catch (error) {
    console.error("Admin auth check error:", error)
    return NextResponse.json({ message: "An error occurred checking authentication" }, { status: 500 })
  }
}
