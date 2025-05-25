import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Flag from "@/models/Flag"
import Team from "@/models/Team"

// Get a specific flag
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

    // Get the flag
    const flag = await Flag.findById(id)

    if (!flag) {
      return NextResponse.json({ message: "Flag not found", success: false }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      flag,
    })
  } catch (error) {
    console.error("Get flag error:", error)
    return NextResponse.json({ message: "An error occurred fetching the flag", success: false }, { status: 500 })
  }
}

// Update a flag
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const id = params.id
    const { value, owner } = await request.json()

    // Connect to database
    await connectToDatabase()

    // Find the flag
    const flag = await Flag.findById(id)

    if (!flag) {
      return NextResponse.json({ message: "Flag not found", success: false }, { status: 404 })
    }

    // If owner is changing, update team references
    if (owner && owner !== flag.owner) {
      // Remove flag from old owner's flags array
      await Team.updateOne({ name: flag.owner }, { $pull: { flags: flag.value } })

      // Check if new owner exists
      const newOwnerTeam = await Team.findOne({ name: owner })
      if (!newOwnerTeam) {
        return NextResponse.json({ message: "New owner team not found", success: false }, { status: 400 })
      }

      // Add flag to new owner's flags array
      newOwnerTeam.flags.push(flag.value)
      await newOwnerTeam.save()

      // Update flag owner
      flag.owner = owner
    }

    // Update flag value if provided
    if (value && value !== flag.value) {
      // Update old owner's flags array
      await Team.updateOne({ name: flag.owner }, { $pull: { flags: flag.value } })

      // Add new value to owner's flags array
      const ownerTeam = await Team.findOne({ name: flag.owner })
      ownerTeam.flags.push(value)
      await ownerTeam.save()

      // Update flag value
      flag.value = value
    }

    await flag.save()

    return NextResponse.json({
      success: true,
      message: "Flag updated successfully",
      flag,
    })
  } catch (error) {
    console.error("Update flag error:", error)
    return NextResponse.json({ message: "An error occurred updating the flag", success: false }, { status: 500 })
  }
}

// Delete a flag
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

    // Find the flag
    const flag = await Flag.findById(id)

    if (!flag) {
      return NextResponse.json({ message: "Flag not found", success: false }, { status: 404 })
    }

    // Remove flag from owner's flags array
    await Team.updateOne({ name: flag.owner }, { $pull: { flags: flag.value } })

    // Delete the flag
    await Flag.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Flag deleted successfully",
    })
  } catch (error) {
    console.error("Delete flag error:", error)
    return NextResponse.json({ message: "An error occurred deleting the flag", success: false }, { status: 500 })
  }
}
