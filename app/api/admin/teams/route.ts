import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"
import Flag from "@/models/Flag"
// Import the UUID generator
import { generateUUID } from "@/lib/uuid-generator"

// Helper function to generate random flags (hashes)
function generateFlags(count: number): string[] {
  const flags: string[] = []
  for (let i = 0; i < count; i++) {
    // Generate UUID v4 format flags
    const uuid = generateUUID()
    flags.push(uuid)
  }
  return flags
}

// Get all teams
export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get all teams
    const teams = await Team.find({}).sort({ name: 1 })

    return NextResponse.json({ success: true, teams })
  } catch (error) {
    console.error("Get teams error:", error)
    return NextResponse.json({ message: "An error occurred fetching teams", success: false }, { status: 500 })
  }
}

// Create a new team
export async function POST(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name, username, password, flagsCount = 5 } = await request.json()

    // Validate input
    if (!name || !username || !password) {
      return NextResponse.json(
        { message: "Name, username, and password are required", success: false },
        { status: 400 },
      )
    }

    // Connect to database
    await connectToDatabase()

    // Check if team with this name or username already exists
    const existingTeam = await Team.findOne({ $or: [{ name }, { username }] })
    if (existingTeam) {
      return NextResponse.json(
        { message: "A team with this name or username already exists", success: false },
        { status: 400 },
      )
    }

    // Generate flags
    const flags = generateFlags(flagsCount)

    // Create team
    const team = await Team.create({
      name,
      username,
      password,
      score: 0,
      flags,
    })

    // Create flag documents
    const flagDocs = flags.map((flag) => ({
      value: flag,
      owner: team.name,
      submissions: [], // Initialize with empty submissions array
    }))

    await Flag.insertMany(flagDocs)

    return NextResponse.json({
      success: true,
      message: "Team created successfully",
      team: {
        name: team.name,
        username: team.username,
        score: team.score,
        flags: team.flags,
      },
    })
  } catch (error) {
    console.error("Create team error:", error)
    return NextResponse.json({ message: "An error occurred creating the team", success: false }, { status: 500 })
  }
}
