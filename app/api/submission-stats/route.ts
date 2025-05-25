import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Flag from "@/models/Flag"
import Team from "@/models/Team"

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase()

    // Get all teams
    const teams = await Team.find({}, "name")

    // Get all flags with submissions
    const flags = await Flag.find({})

    // Calculate stats
    const stats = teams.map((team) => {
      // Count flags submitted by this team
      const submittedCount = flags.reduce((count, flag) => {
        const hasSubmitted = flag.submissions.some((sub) => sub.team === team.name)
        return hasSubmitted ? count + 1 : count
      }, 0)

      // Count flags owned by this team
      const ownedCount = flags.filter((flag) => flag.owner === team.name).length

      // Count flags owned by this team that were captured by others
      const capturedCount = flags.reduce((count, flag) => {
        if (flag.owner === team.name && flag.submissions.some((sub) => sub.team !== team.name)) {
          return count + 1
        }
        return count
      }, 0)

      // Calculate success rate (submitted flags / total flags)
      const totalFlags = flags.length
      const successRate = totalFlags > 0 ? Math.round((submittedCount / totalFlags) * 100) : 0

      // Calculate defense rate (uncaptured flags / owned flags)
      const uncapturedCount = ownedCount - capturedCount
      const defenseRate = ownedCount > 0 ? Math.round((uncapturedCount / ownedCount) * 100) : 0

      return {
        team: team.name,
        submitted: submittedCount,
        owned: ownedCount,
        captured: capturedCount,
        uncaptured: uncapturedCount,
        successRate,
        defenseRate,
      }
    })

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Submission stats error:", error)
    return NextResponse.json({ message: "An error occurred fetching submission stats" }, { status: 500 })
  }
}
