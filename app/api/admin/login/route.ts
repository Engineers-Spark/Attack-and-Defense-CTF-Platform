import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Admin from "@/models/Admin"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log(`Login attempt for admin: ${username}`)

    // Connect to the database
    await connectToDatabase()

    // Find the admin by username
    const admin = await Admin.findOne({ username })

    if (!admin) {
      console.log(`No admin found with username: ${username}`)
      return NextResponse.json(
        {
          message: "Invalid username or password. Please check your credentials and try again.",
          error: "invalid_credentials",
        },
        { status: 401 },
      )
    }

    console.log(`Found admin: ${admin.username}`)

    // Direct comparison for the default admin account
    // This is a fallback for the initial login before password is hashed
    if (admin.password === "admin" && password === "admin") {
      console.log("Using default admin credentials")

      // Update the password to be hashed for future logins
      const salt = await bcrypt.genSalt(10)
      admin.password = await bcrypt.hash("admin", salt)
      await admin.save()

      // Set session cookie
      cookies().set("admin", admin.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      console.log(`Successful admin login with default credentials: ${admin.username}`)
      return NextResponse.json({ success: true, admin: admin.username })
    }

    // Regular bcrypt comparison for hashed passwords
    try {
      const isMatch = await bcrypt.compare(password, admin.password)

      if (!isMatch) {
        console.log(`Password mismatch for admin: ${username}`)
        return NextResponse.json(
          {
            message: "Invalid username or password. Please check your credentials and try again.",
            error: "invalid_credentials",
          },
          { status: 401 },
        )
      }

      // Set session cookie
      cookies().set("admin", admin.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      console.log(`Successful admin login: ${admin.username}`)
      return NextResponse.json({ success: true, admin: admin.username })
    } catch (error) {
      console.error("Password comparison error:", error)
      return NextResponse.json(
        {
          message: "An error occurred during login. Please try again later.",
          error: "server_error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        message: "An error occurred during login. Please try again later.",
        error: "server_error",
      },
      { status: 500 },
    )
  }
}
