import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCurrentConfig, updateConfig, resetConfigToDefaults, validateConfig } from "@/lib/config"
import { restartPassivePointsWithNewInterval } from "@/lib/passive-points"

// Get current configuration
export async function GET() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

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

// Update configuration
export async function PUT(request: Request) {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { config: newConfig } = body

    // Validate the new configuration
    const validation = validateConfig(newConfig)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid configuration",
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    // Check if passive points interval is being changed
    const currentConfig = getCurrentConfig()
    const intervalChanged =
      newConfig.PASSIVE_POINTS_INTERVAL && newConfig.PASSIVE_POINTS_INTERVAL !== currentConfig.PASSIVE_POINTS_INTERVAL

    // Update the configuration
    const updatedConfig = updateConfig(newConfig)

    // If passive points interval changed and the system is running, restart it
    if (intervalChanged) {
      const restarted = restartPassivePointsWithNewInterval()
      if (restarted) {
        console.log("Passive points system restarted with new interval")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Configuration updated successfully",
      config: updatedConfig,
      intervalRestarted: intervalChanged,
    })
  } catch (error) {
    console.error("Error updating configuration:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update configuration",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Reset configuration to defaults
export async function DELETE() {
  try {
    // Check if admin is authenticated
    const adminCookie = cookies().get("admin")
    if (!adminCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const config = resetConfigToDefaults()

    // Restart passive points with default interval if it's running
    const restarted = restartPassivePointsWithNewInterval()

    return NextResponse.json({
      success: true,
      message: "Configuration reset to defaults",
      config,
      intervalRestarted: restarted,
    })
  } catch (error) {
    console.error("Error resetting configuration:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset configuration",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
