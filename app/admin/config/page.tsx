"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import {
  Settings,
  Save,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Clock,
  Shield,
  Zap,
} from "lucide-react"

type ConfigType = {
  SELF_FLAG_POINTS: number
  ATTACK_POINTS: number
  DEFENSE_PENALTY: number
  PASSIVE_POINTS_VALUE: number
  PASSIVE_POINTS_INTERVAL: number
  MAX_SUBMISSIONS_PER_MINUTE: number
  RATE_LIMIT_WINDOW: number
}

export default function AdminConfigPage() {
  const [config, setConfig] = useState<ConfigType>({
    SELF_FLAG_POINTS: 10,
    ATTACK_POINTS: 200,
    DEFENSE_PENALTY: 50,
    PASSIVE_POINTS_VALUE: 1,
    PASSIVE_POINTS_INTERVAL: 1200000,
    MAX_SUBMISSIONS_PER_MINUTE: 10,
    RATE_LIMIT_WINDOW: 60000,
  })
  const [originalConfig, setOriginalConfig] = useState<ConfigType>({ ...config })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [alert, setAlert] = useState<{
    show: boolean
    type: "error" | "success" | "warning" | "info"
    title: string
    message: string
  }>({
    show: false,
    type: "error",
    title: "",
    message: "",
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth")
        if (!response.ok) {
          router.push("/admin/login")
        }
      } catch (error) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/config")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setConfig(data.config)
        setOriginalConfig(data.config)
        setHasChanges(false)
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to fetch configuration",
        })
      }
    } catch (error) {
      console.error("Error fetching configuration:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch configuration. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    // Check if there are changes
    const changed = JSON.stringify(config) !== JSON.stringify(originalConfig)
    setHasChanges(changed)
  }, [config, originalConfig])

  const handleInputChange = (field: keyof ConfigType, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setConfig((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setOriginalConfig({ ...config })
        setHasChanges(false)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: data.intervalRestarted
            ? "Configuration saved and passive points system restarted with new interval!"
            : "Configuration saved successfully!",
        })
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.errors ? data.errors.join(", ") : data.message || "Failed to save configuration",
        })
      }
    } catch (error) {
      console.error("Error saving configuration:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while saving configuration.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all configuration to default values? This action cannot be undone.")) {
      return
    }

    try {
      setResetting(true)
      const response = await fetch("/api/admin/config", {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setConfig(data.config)
        setOriginalConfig(data.config)
        setHasChanges(false)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: data.intervalRestarted
            ? "Configuration reset to defaults and passive points system restarted!"
            : "Configuration reset to defaults successfully!",
        })
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to reset configuration",
        })
      }
    } catch (error) {
      console.error("Error resetting configuration:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while resetting configuration.",
      })
    } finally {
      setResetting(false)
    }
  }

  const handleDiscard = () => {
    setConfig({ ...originalConfig })
    setHasChanges(false)
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const formatInterval = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-400">Competition Configuration</h1>
            <p className="text-gray-400 mt-1">Manage scoring, timing, and rate limiting settings</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">Loading configuration...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <div className="flex items-center text-yellow-400">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm">You have unsaved changes</span>
                    </div>
                  )}
                  {!hasChanges && !loading && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Configuration is up to date</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {hasChanges && (
                    <Button onClick={handleDiscard} className="bg-gray-600 hover:bg-gray-700 text-white">
                      Discard Changes
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReset} disabled={resetting} className="bg-red-600 hover:bg-red-700 text-white">
                    {resetting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset to Defaults
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Scoring Configuration */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400 flex items-center">
                    <Trophy className="mr-2 h-5 w-5" /> Scoring Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure point values for different actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="selfFlagPoints" className="text-gray-300">
                        Self Flag Points
                      </Label>
                      <Input
                        id="selfFlagPoints"
                        type="number"
                        min="0"
                        max="1000"
                        value={config.SELF_FLAG_POINTS}
                        onChange={(e) => handleInputChange("SELF_FLAG_POINTS", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">Points awarded for submitting your own flag</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attackPoints" className="text-gray-300">
                        Attack Points
                      </Label>
                      <Input
                        id="attackPoints"
                        type="number"
                        min="0"
                        max="10000"
                        value={config.ATTACK_POINTS}
                        onChange={(e) => handleInputChange("ATTACK_POINTS", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">Points gained when attacking another team's flag</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defensePenalty" className="text-gray-300">
                        Defense Penalty
                      </Label>
                      <Input
                        id="defensePenalty"
                        type="number"
                        min="0"
                        max="1000"
                        value={config.DEFENSE_PENALTY}
                        onChange={(e) => handleInputChange("DEFENSE_PENALTY", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">Points deducted when your flag is captured</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passivePointsValue" className="text-gray-300">
                        Passive Points Value
                      </Label>
                      <Input
                        id="passivePointsValue"
                        type="number"
                        min="0"
                        max="100"
                        value={config.PASSIVE_POINTS_VALUE}
                        onChange={(e) => handleInputChange("PASSIVE_POINTS_VALUE", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">Points awarded per flag during passive calculation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timing Configuration */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Timing Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-400">Configure timing intervals and windows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passivePointsInterval" className="text-gray-300">
                        Passive Points Interval (ms)
                      </Label>
                      <Input
                        id="passivePointsInterval"
                        type="number"
                        min="60000"
                        max="3600000"
                        step="60000"
                        value={config.PASSIVE_POINTS_INTERVAL}
                        onChange={(e) => handleInputChange("PASSIVE_POINTS_INTERVAL", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">
                        Current: {formatInterval(config.PASSIVE_POINTS_INTERVAL)} (1-60 minutes)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rateLimitWindow" className="text-gray-300">
                        Rate Limit Window (ms)
                      </Label>
                      <Input
                        id="rateLimitWindow"
                        type="number"
                        min="10000"
                        max="300000"
                        step="1000"
                        value={config.RATE_LIMIT_WINDOW}
                        onChange={(e) => handleInputChange("RATE_LIMIT_WINDOW", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">
                        Current: {formatInterval(config.RATE_LIMIT_WINDOW)} (10s-5m)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rate Limiting Configuration */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400 flex items-center">
                    <Shield className="mr-2 h-5 w-5" /> Rate Limiting Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure submission rate limits to prevent abuse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxSubmissions" className="text-gray-300">
                        Max Submissions Per Window
                      </Label>
                      <Input
                        id="maxSubmissions"
                        type="number"
                        min="1"
                        max="100"
                        value={config.MAX_SUBMISSIONS_PER_MINUTE}
                        onChange={(e) => handleInputChange("MAX_SUBMISSIONS_PER_MINUTE", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">Maximum flag submissions per rate limit window</p>
                    </div>

                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-300 mb-2">Current Rate Limit</div>
                      <div className="text-lg font-semibold text-yellow-400">
                        {config.MAX_SUBMISSIONS_PER_MINUTE} submissions per {formatInterval(config.RATE_LIMIT_WINDOW)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Preview */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400 flex items-center">
                    <Settings className="mr-2 h-5 w-5" /> Configuration Summary
                  </CardTitle>
                  <CardDescription className="text-gray-400">Preview of current configuration values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400">Own Flag</div>
                      <div className="text-lg font-semibold text-green-400">+{config.SELF_FLAG_POINTS} pts</div>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400">Attack Success</div>
                      <div className="text-lg font-semibold text-blue-400">+{config.ATTACK_POINTS} pts</div>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400">Defense Failure</div>
                      <div className="text-lg font-semibold text-red-400">-{config.DEFENSE_PENALTY} pts</div>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400">Passive Points</div>
                      <div className="text-lg font-semibold text-yellow-400">
                        +{config.PASSIVE_POINTS_VALUE} pts/{formatInterval(config.PASSIVE_POINTS_INTERVAL)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400">Rate Limit</div>
                      <div className="text-lg font-semibold text-orange-400">
                        {config.MAX_SUBMISSIONS_PER_MINUTE}/{formatInterval(config.RATE_LIMIT_WINDOW)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-400 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Changes take effect immediately for new submissions</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Passive points interval changes will restart the passive points system if it's running
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Rate limiting changes apply to new submission attempts</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Configuration is stored in memory and will reset to environment defaults on server restart
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <footer className="bg-gray-800 py-4 border-t border-gray-700">
          <div className="container mx-auto px-4 text-center text-gray-400">
            &copy; {new Date().getFullYear()} Attack and Defense CTF Platform - Admin Panel
          </div>
        </footer>
      </div>
    </div>
  )
}
