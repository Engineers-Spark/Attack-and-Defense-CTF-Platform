import { NextResponse } from "next/server"
import { getCurrentConfig } from "@/lib/config"

// Get current configuration (public endpoint for rules page)
export async function GET() {
  try {
    const config = getCurrentConfig()

    return NextResponse.json({
      success: true,
      config,
    })
  } catch (error) {
    console.error("Error getting configuration:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get configuration",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
