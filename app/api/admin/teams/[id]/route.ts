import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Team from "@/models/Team"
import Flag from "@/models/Flag"

// Get a specific team
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const id = params.id

    // Connect to database
    await connectToDatabase()

    // Get the team
    const team = await Team.findById(id)

    if (!team) {
      return NextResponse.json({ message: "Team not found", success: false }, { status: 404 })
    }

    // Get the team's flags
    const flags = await Flag.find({ owner: team.name })

    return NextResponse.json({
      success: true,
      team: {
        id: team._id,
        name: team.name,
        username: team.username,
        score: team.score,
        flags: team.flags,
      },
      flagDetails: flags,
    })
  } catch (error) {
    console.error("Get team error:", error)
    return NextResponse.json({ message: "An error occurred fetching the team", success: false }, { status: 500 })
  }
}

// Update a team
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const id = params.id
    const { name, username, password, score } = await request.json()

    // Connect to database
    await connectToDatabase()

    // Find the team
    const team = await Team.findById(id)

    if (!team) {
      return NextResponse.json({ message: "Team not found", success: false }, { status: 404 })
    }

    // Update team fields if provided
    if (name !== undefined) team.name = name
    if (username !== undefined) team.username = username
    if (password !== undefined && password !== "") team.password = password
    if (score !== undefined) team.score = score

    await team.save()

    // If name was changed, update flag ownership
    if (name !== undefined && name !== team.name) {
      await Flag.updateMany({ owner: team.name }, { owner: name })
    }

    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      team: {
        id: team._id,
        name: team.name,
        username: team.username,
        score: team.score,
      },
    })
  } catch (error) {
    console.error("Update team error:", error)
    return NextResponse.json({ message: "An error occurred updating the team", success: false }, { status: 500 })
  }
}

// Delete a team
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const id = params.id

    // Connect to database
    await connectToDatabase()

    // Find the team
    const team = await Team.findById(id)

    if (!team) {
      return NextResponse.json({ message: "Team not found", success: false }, { status: 404 })
    }

    // Delete the team's flags
    await Flag.deleteMany({ owner: team.name })

    // Delete the team
    await Team.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Team and associated flags deleted successfully",
    })
  } catch (error) {
    console.error("Delete team error:", error)
    return NextResponse.json({ message: "An error occurred deleting the team", success: false }, { status: 500 })
  }
}
