// Configuration values with defaults
export const CONFIG = {
  // Points for submitting your own flag
  SELF_FLAG_POINTS: Number.parseInt(process.env.SELF_FLAG_POINTS || "10"),

  // Points gained when attacking another team's flag
  ATTACK_POINTS: Number.parseInt(process.env.ATTACK_POINTS || "200"),

  // Points deducted from the flag owner when their flag is captured
  DEFENSE_PENALTY: Number.parseInt(process.env.DEFENSE_PENALTY || "50"),

  // Points awarded per flag during passive points calculation
  PASSIVE_POINTS_VALUE: Number.parseInt(process.env.PASSIVE_POINTS_VALUE || "1"),

  // Interval between passive points awards (in milliseconds)
  PASSIVE_POINTS_INTERVAL: Number.parseInt(process.env.PASSIVE_POINTS_INTERVAL || "1200000"), // 20 minutes

  // Rate limiting
  MAX_SUBMISSIONS_PER_MINUTE: Number.parseInt(process.env.MAX_SUBMISSIONS_PER_MINUTE || "10"),
  RATE_LIMIT_WINDOW: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "60000"), // 1 minute
}

// In-memory configuration store for runtime changes
let runtimeConfig = { ...CONFIG }

// Function to get current configuration (runtime or environment)
export function getCurrentConfig() {
  return { ...runtimeConfig }
}

// Function to update runtime configuration
export function updateConfig(newConfig: Partial<typeof CONFIG>) {
  runtimeConfig = { ...runtimeConfig, ...newConfig }
  console.log("Configuration updated:", runtimeConfig)
  return runtimeConfig
}

// Function to reset configuration to environment defaults
export function resetConfigToDefaults() {
  runtimeConfig = { ...CONFIG }
  console.log("Configuration reset to defaults:", runtimeConfig)
  return runtimeConfig
}

// Helper function to format interval for display
export function formatInterval(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds > 0 ? `${seconds} second${seconds !== 1 ? "s" : ""}` : ""}`
}

// Helper function to validate configuration values
export function validateConfig(config: Partial<typeof CONFIG>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (config.SELF_FLAG_POINTS !== undefined && (config.SELF_FLAG_POINTS < 0 || config.SELF_FLAG_POINTS > 1000)) {
    errors.push("Self flag points must be between 0 and 1000")
  }

  if (config.ATTACK_POINTS !== undefined && (config.ATTACK_POINTS < 0 || config.ATTACK_POINTS > 10000)) {
    errors.push("Attack points must be between 0 and 10000")
  }

  if (config.DEFENSE_PENALTY !== undefined && (config.DEFENSE_PENALTY < 0 || config.DEFENSE_PENALTY > 1000)) {
    errors.push("Defense penalty must be between 0 and 1000")
  }

  if (
    config.PASSIVE_POINTS_VALUE !== undefined &&
    (config.PASSIVE_POINTS_VALUE < 0 || config.PASSIVE_POINTS_VALUE > 100)
  ) {
    errors.push("Passive points value must be between 0 and 100")
  }

  if (
    config.PASSIVE_POINTS_INTERVAL !== undefined &&
    (config.PASSIVE_POINTS_INTERVAL < 60000 || config.PASSIVE_POINTS_INTERVAL > 3600000)
  ) {
    errors.push("Passive points interval must be between 1 minute and 1 hour")
  }

  if (
    config.MAX_SUBMISSIONS_PER_MINUTE !== undefined &&
    (config.MAX_SUBMISSIONS_PER_MINUTE < 1 || config.MAX_SUBMISSIONS_PER_MINUTE > 100)
  ) {
    errors.push("Max submissions per minute must be between 1 and 100")
  }

  if (
    config.RATE_LIMIT_WINDOW !== undefined &&
    (config.RATE_LIMIT_WINDOW < 10000 || config.RATE_LIMIT_WINDOW > 300000)
  ) {
    errors.push("Rate limit window must be between 10 seconds and 5 minutes")
  }

  return { valid: errors.length === 0, errors }
}
