import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the admin cookie
    cookies().delete("admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
