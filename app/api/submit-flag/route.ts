import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"
import Flag from "@/models/Flag"
import { sendNotificationToTeam } from "../notifications/route"
import { checkRateLimit, formatTimeRemaining } from "@/lib/rate-limiter"
import { getCurrentConfig } from "@/lib/config"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const teamCookie = cookies().get("team")

    if (!teamCookie) {
      return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 })
    }

    const teamName = teamCookie.value
    const { flag } = await request.json()

    // Check rate limit
    const rateLimit = checkRateLimit(teamName)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        {
          message: `Rate limit exceeded. Please try again in ${formatTimeRemaining(rateLimit.resetIn)}.`,
          success: false,
          rateLimit: true,
          resetIn: rateLimit.resetIn,
        },
        { status: 429 },
      )
    }

    // Connect to database
    await connectToDatabase()

    // Find the flag
    const flagDoc = await Flag.findOne({ value: flag })

    if (!flagDoc) {
      return NextResponse.json(
        {
          message: "Invalid flag. The flag you submitted does not exist.",
          success: false,
          remaining: rateLimit.remaining,
        },
        { status: 400 },
      )
    }

    // Find the submitting team
    const submittingTeam = await Team.findOne({ name: teamName })

    if (!submittingTeam) {
      return NextResponse.json({ message: "Team not found", success: false }, { status: 400 })
    }

    // Check if this team has already submitted this flag
    const hasSubmitted = flagDoc.submissions.some((submission) => submission.team === teamName)

    if (hasSubmitted) {
      return NextResponse.json(
        {
          message: "Your team has already submitted this flag. Each team can only submit a specific flag once.",
          success: false,
          remaining: rateLimit.remaining,
        },
        { status: 400 },
      )
    }

    // Find the flag owner team
    const ownerTeam = await Team.findOne({ name: flagDoc.owner })

    // Get current configuration
    const config = getCurrentConfig()

    let message = ""
    const success = true

    // Update scores based on flag ownership using current configured values
    if (flagDoc.owner === teamName) {
      // Team submitted their own flag
      submittingTeam.score += config.SELF_FLAG_POINTS
      message = `You submitted your own flag! +${config.SELF_FLAG_POINTS} points`
    } else {
      // Team submitted another team's flag
      submittingTeam.score += config.ATTACK_POINTS
      ownerTeam.score -= config.DEFENSE_PENALTY
      await ownerTeam.save()
      message = `You submitted ${flagDoc.owner}'s flag! +${config.ATTACK_POINTS} points for you, -${config.DEFENSE_PENALTY} points for them`

      // Send notification to the flag owner
      sendNotificationToTeam(flagDoc.owner, {
        type: "flag-submission",
        team: teamName,
        flagOwner: flagDoc.owner,
        flagValue: flag,
        timestamp: new Date().toISOString(),
      })
    }

    // Add this team to the flag's submissions
    flagDoc.submissions.push({
      team: teamName,
      submittedAt: new Date(),
    })

    await flagDoc.save()

    // Save updated submitting team score
    await submittingTeam.save()

    return NextResponse.json({
      message,
      success,
      newScore: submittingTeam.score,
      remaining: rateLimit.remaining,
    })
  } catch (error) {
    console.error("Flag submission error:", error)
    return NextResponse.json({ message: "An error occurred during flag submission", success: false }, { status: 500 })
  }
}
