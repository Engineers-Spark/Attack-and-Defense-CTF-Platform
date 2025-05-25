import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  startPassivePoints,
  stopPassivePoints,
  getPassivePointsStatus,
  updatePassivePointsSchedule,
} from "@/lib/passive-points"

// Get passive points status
export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const status = getPassivePointsStatus()

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("Error getting passive points status:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get passive points status",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Start passive points
export async function POST(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { scheduledStart, scheduledEnd } = body

    const result = startPassivePoints(scheduledStart, scheduledEnd)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error starting passive points mechanism:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to start passive points mechanism",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Stop passive points
export async function DELETE() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const result = stopPassivePoints()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error stopping passive points mechanism:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to stop passive points mechanism",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Update schedule
export async function PUT(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { scheduledStart, scheduledEnd } = body

    const result = updatePassivePointsSchedule(scheduledStart, scheduledEnd)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating passive points schedule:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update passive points schedule",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
