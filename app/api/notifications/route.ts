import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Store active connections
const clients = new Map<string, ReadableStreamController<Uint8Array>>()

// Function to send notification to a specific team
export function sendNotificationToTeam(team: string, data: any) {
  const controller = clients.get(team)
  if (controller) {
    const message = `data: ${JSON.stringify(data)}\n\n`
    controller.enqueue(new TextEncoder().encode(message))
  }
}

export async function GET() {
  // Check if user is authenticated
  const teamCookie = cookies().get("team")
  if (!teamCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  const teamName = teamCookie.value

  // Create a new stream
  const stream = new ReadableStream({
    start(controller) {
      clients.set(teamName, controller)
    },
    cancel() {
      clients.delete(teamName)
    },
  })

  // Return the stream as SSE
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
