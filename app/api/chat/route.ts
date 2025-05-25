import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import ChatMessage from "@/models/ChatMessage"

// Get chat messages
export async function GET() {
  try {
    // Check if user is authenticated
    const teamCookie = cookies().get("team")
    if (!teamCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get the last 50 messages, sorted by creation time
    const messages = await ChatMessage.find({}).sort({ createdAt: -1 }).limit(50).lean()

    // Return messages in chronological order (oldest first)
    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error("Chat fetch error:", error)
    return NextResponse.json({ message: "An error occurred fetching chat messages" }, { status: 500 })
  }
}

// Post a new chat message
export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const teamCookie = cookies().get("team")
    if (!teamCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const teamName = teamCookie.value
    const { nickname, message } = await request.json()

    // Validate input
    if (!nickname || !message) {
      return NextResponse.json({ message: "Nickname and message are required", success: false }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json(
        { message: "Message is too long (maximum 500 characters)", success: false },
        { status: 400 },
      )
    }

    if (nickname.length > 30) {
      return NextResponse.json(
        { message: "Nickname is too long (maximum 30 characters)", success: false },
        { status: 400 },
      )
    }

    // Connect to database
    await connectToDatabase()

    // Create and save the message
    const chatMessage = new ChatMessage({
      nickname,
      message,
      teamName,
    })

    await chatMessage.save()

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      chatMessage,
    })
  } catch (error) {
    console.error("Chat post error:", error)
    return NextResponse.json({ message: "An error occurred posting the message", success: false }, { status: 500 })
  }
}
