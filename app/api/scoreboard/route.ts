import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase()

    // Get all teams
    const teams = await Team.find({}, "name score")

    // Format the data for the frontend
    const scores = teams.map((team) => ({
      team: team.name,
      score: team.score,
    }))

    return NextResponse.json({ scores })
  } catch (error) {
    console.error("Scoreboard error:", error)
    return NextResponse.json({ message: "An error occurred fetching the scoreboard" }, { status: 500 })
  }
}
