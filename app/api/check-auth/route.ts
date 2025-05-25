import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"
import Flag from "@/models/Flag"

export async function GET() {
  try {
    // Check if user is authenticated
    const teamCookie = cookies().get("team")

    if (!teamCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const teamName = teamCookie.value

    // Connect to database
    await connectToDatabase()

    // Get team data
    const team = await Team.findOne({ name: teamName })

    if (!team) {
      cookies().delete("team")
      return NextResponse.json({ message: "Team not found" }, { status: 401 })
    }

    // Get submitted flags
    const submittedFlags = await Flag.find(
      {
        "submissions.team": teamName,
      },
      "value owner",
    )

    return NextResponse.json({
      authenticated: true,
      team: team.name,
      score: team.score,
      flags: team.flags,
      submittedFlags: submittedFlags.map((flag) => ({
        value: flag.value,
        owner: flag.owner,
      })),
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "An error occurred checking authentication" }, { status: 500 })
  }
}
