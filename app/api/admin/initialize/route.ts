import { NextResponse } from "next/server"
import { generateUUID } from "@/lib/uuid-generator"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"
import Flag from "@/models/Flag"
import ChatMessage from "@/models/ChatMessage"
import { cookies } from "next/headers"

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

export async function POST(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { teams, flagsPerTeam = 5 } = body

    // Validate teams data
    if (!teams || !Array.isArray(teams) || teams.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid teams data. Expected an array of team objects." },
        { status: 400 },
      )
    }

    // Connect to the database
    await connectToDatabase()

    // First, clear any existing data
    await Team.deleteMany({})
    await Flag.deleteMany({})
    await ChatMessage.deleteMany({}) // Clear all chat messages

    // Create teams with the provided data
    const createdTeams = []

    for (const teamData of teams) {
      // Validate team data
      if (!teamData.name || !teamData.username || !teamData.password) {
        return NextResponse.json(
          {
            success: false,
            message: "Each team must have a name, username, and password.",
          },
          { status: 400 },
        )
      }

      // Generate flags for this team if not provided
      const flags = teamData.flags || generateFlags(flagsPerTeam)

      // Create the team
      const team = await Team.create({
        name: teamData.name,
        username: teamData.username,
        password: teamData.password,
        score: 0,
        flags,
      })

      createdTeams.push({
        name: team.name,
        username: team.username,
      })

      // Create flag documents
      const flagDocs = flags.map((flag) => ({
        value: flag,
        owner: team.name,
        submissions: [], // Initialize with empty submissions array
      }))

      await Flag.insertMany(flagDocs)
    }

    return NextResponse.json({
      success: true,
      message: "Competition initialized successfully",
      teams: createdTeams,
    })
  } catch (error) {
    console.error("Initialization error:", error)
    return NextResponse.json({ message: "An error occurred during initialization", success: false }, { status: 500 })
  }
}
