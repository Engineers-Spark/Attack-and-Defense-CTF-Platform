import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import ChatMessage from "@/models/ChatMessage"

// Get all chat messages
export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get all chat messages, sorted by creation time
    const messages = await ChatMessage.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error("Chat logs fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred fetching chat logs",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Delete a chat message
export async function DELETE(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ message: "Message ID is required", success: false }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Delete the message
    const result = await ChatMessage.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ message: "Message not found", success: false }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Chat message deleted successfully",
    })
  } catch (error) {
    console.error("Delete chat message error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred deleting the chat message",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
