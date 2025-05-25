import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Admin from "@/models/Admin"

// This route will create the admin with proper password hashing
export async function POST() {
  try {
    // Connect to database
    await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" })

    if (existingAdmin) {
      // Update the existing admin to ensure password is hashed
      existingAdmin.password = "admin" // This will trigger the pre-save hook to hash it
      await existingAdmin.save()

      return NextResponse.json({
        success: true,
        message: "Admin account updated with hashed password",
      })
    } else {
      // Create new admin
      const admin = new Admin({
        username: "admin",
        password: "admin", // This will be hashed by the pre-save hook
      })

      await admin.save()

      return NextResponse.json({
        success: true,
        message: "Admin account created with hashed password",
      })
    }
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin account",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
