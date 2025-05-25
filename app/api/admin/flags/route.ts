import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Flag from "@/models/Flag"
import Team from "@/models/Team"
// Import the UUID generator
import { generateUUID } from "@/lib/uuid-generator"

// Get all flags
export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get all flags
    const flags = await Flag.find({}).sort({ owner: 1 })

    return NextResponse.json({ success: true, flags })
  } catch (error) {
    console.error("Get flags error:", error)
    return NextResponse.json({ message: "An error occurred fetching flags", success: false }, { status: 500 })
  }
}

// Create a new flag
export async function POST(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { owner, value } = await request.json()

    // Validate input
    if (!owner) {
      return NextResponse.json({ message: "Owner team name is required", success: false }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if owner team exists
    const team = await Team.findOne({ name: owner })
    if (!team) {
      return NextResponse.json({ message: "Owner team not found", success: false }, { status: 400 })
    }

    // Generate flag value if not provided
    const flagValue = value || generateUUID()

    // Create flag
    const flag = await Flag.create({
      value: flagValue,
      owner,
      submissions: [],
    })

    // Add flag to team's flags array
    team.flags.push(flagValue)
    await team.save()

    return NextResponse.json({
      success: true,
      message: "Flag created successfully",
      flag,
    })
  } catch (error) {
    console.error("Create flag error:", error)
    return NextResponse.json({ message: "An error occurred creating the flag", success: false }, { status: 500 })
  }
}
