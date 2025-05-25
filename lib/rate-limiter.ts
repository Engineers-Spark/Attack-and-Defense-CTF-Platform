import { getCurrentConfig } from "./config"

// Simple in-memory rate limiter

// Store submission attempts by team
// Format: { teamName: { attempts: number, resetTime: Date } }
const submissionAttempts = new Map<string, { attempts: number; resetTime: Date }>()

/**
 * Check if a team has exceeded their rate limit for flag submissions
 * @param teamName The name of the team
 * @returns Object with isLimited flag and remaining attempts
 */
export function checkRateLimit(teamName: string): { isLimited: boolean; remaining: number; resetIn: number } {
  const config = getCurrentConfig()
  const now = new Date()
  const teamAttempts = submissionAttempts.get(teamName)

  // If no record exists or the reset time has passed, create a new record
  if (!teamAttempts || now > teamAttempts.resetTime) {
    submissionAttempts.set(teamName, {
      attempts: 1, // Count this attempt
      resetTime: new Date(now.getTime() + config.RATE_LIMIT_WINDOW),
    })
    return { isLimited: false, remaining: config.MAX_SUBMISSIONS_PER_MINUTE - 1, resetIn: config.RATE_LIMIT_WINDOW }
  }

  // Check if the team has exceeded the limit
  if (teamAttempts.attempts >= config.MAX_SUBMISSIONS_PER_MINUTE) {
    const resetIn = teamAttempts.resetTime.getTime() - now.getTime()
    return { isLimited: true, remaining: 0, resetIn }
  }

  // Increment the attempt counter
  teamAttempts.attempts += 1
  const remaining = config.MAX_SUBMISSIONS_PER_MINUTE - teamAttempts.attempts
  const resetIn = teamAttempts.resetTime.getTime() - now.getTime()

  return { isLimited: false, remaining, resetIn }
}

/**
 * Format milliseconds into a human-readable time string
 * @param ms Milliseconds
 * @returns Formatted time string (e.g., "45 seconds")
 */
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000)
  return `${seconds} second${seconds !== 1 ? "s" : ""}`
}
