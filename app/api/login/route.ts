import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Connect to the database
    await connectToDatabase()

    // Find the team by username
    const team = await Team.findOne({ username })

    if (!team) {
      console.log(`No team found with username: ${username}`)
      return NextResponse.json(
        {
          message: "Invalid username or password. Please check your credentials and try again.",
          error: "invalid_credentials",
        },
        { status: 401 },
      )
    }

    // For plain text password comparison (since you used MongoDB shell)
    if (team.password !== password) {
      console.log(`Password mismatch for team: ${username}`)
      return NextResponse.json(
        {
          message: "Invalid username or password. Please check your credentials and try again.",
          error: "invalid_credentials",
        },
        { status: 401 },
      )
    }

    // Set session cookie
    cookies().set("team", team.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    console.log(`Successful login for team: ${team.name}`)
    return NextResponse.json({ success: true, team: team.name })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        message: "An error occurred during login. Please try again later.",
        error: "server_error",
      },
      { status: 500 },
    )
  }
}
