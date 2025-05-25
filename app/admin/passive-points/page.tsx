"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import { Clock, Play, Square, RefreshCw, AlertTriangle, CheckCircle, Calendar, Settings } from "lucide-react"

type PassivePointsStatus = {
  running: boolean
  lastRun: string | null
  nextRun: string | null
  pointsAwarded: number
  startedAt: string | null
  scheduledStart: string | null
  scheduledEnd: string | null
  interval: number
  withinSchedule: boolean
}

export default function AdminPassivePointsPage() {
  const [status, setStatus] = useState<PassivePointsStatus>({
    running: false,
    lastRun: null,
    nextRun: null,
    pointsAwarded: 0,
    startedAt: null,
    scheduledStart: null,
    scheduledEnd: null,
    interval: 1200000, // 20 minutes in milliseconds
    withinSchedule: true,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  })
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

  const fetchStatus = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/passive-points")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setStatus(data.status)

        // Update form with current schedule
        if (data.status.scheduledStart) {
          const startDate = new Date(data.status.scheduledStart)
          setScheduleForm((prev) => ({
            ...prev,
            startDate: startDate.toISOString().split("T")[0],
            startTime: startDate.toTimeString().slice(0, 5),
          }))
        }
        if (data.status.scheduledEnd) {
          const endDate = new Date(data.status.scheduledEnd)
          setScheduleForm((prev) => ({
            ...prev,
            endDate: endDate.toISOString().split("T")[0],
            endTime: endDate.toTimeString().slice(0, 5),
          }))
        }
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to fetch status",
        })
      }
    } catch (error) {
      console.error("Error fetching status:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch status. Please try again.",
      })
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    // Refresh status every 10 seconds
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const startPassivePoints = async () => {
    try {
      setLoading(true)

      let scheduledStart = null
      let scheduledEnd = null

      // Combine date and time if provided
      if (scheduleForm.startDate && scheduleForm.startTime) {
        scheduledStart = new Date(`${scheduleForm.startDate}T${scheduleForm.startTime}`).toISOString()
      }
      if (scheduleForm.endDate && scheduleForm.endTime) {
        scheduledEnd = new Date(`${scheduleForm.endDate}T${scheduleForm.endTime}`).toISOString()
      }

      const response = await fetch("/api/admin/passive-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledStart,
          scheduledEnd,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Passive points mechanism started",
        })
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to start passive points mechanism",
        })
      }
    } catch (error) {
      console.error("Error starting passive points:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const stopPassivePoints = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/passive-points", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Passive points mechanism stopped",
        })
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to stop passive points mechanism",
        })
      }
    } catch (error) {
      console.error("Error stopping passive points:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async () => {
    try {
      setLoading(true)

      let scheduledStart = null
      let scheduledEnd = null

      // Combine date and time if provided
      if (scheduleForm.startDate && scheduleForm.startTime) {
        scheduledStart = new Date(`${scheduleForm.startDate}T${scheduleForm.startTime}`).toISOString()
      }
      if (scheduleForm.endDate && scheduleForm.endTime) {
        scheduledEnd = new Date(`${scheduleForm.endDate}T${scheduleForm.endTime}`).toISOString()
      }

      const response = await fetch("/api/admin/passive-points", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledStart,
          scheduledEnd,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Schedule updated successfully",
        })
        setShowScheduleForm(false)
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to update schedule",
        })
      }
    } catch (error) {
      console.error("Error updating schedule:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  // Format interval for display
  const formatInterval = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds > 0 ? `${seconds} second${seconds !== 1 ? "s" : ""}` : ""}`
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const handleFormChange = (field: string, value: string) => {
    setScheduleForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-400">Passive Points Control</h1>
            <p className="text-gray-400 mt-1">Manage the automatic points awarding system with scheduling</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-400 flex items-center">
                  <Clock className="mr-2 h-6 w-6" /> Passive Points Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Current status of the automatic points system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Status</div>
                    <div className="flex items-center">
                      {status.running ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                          <span className="text-lg font-semibold text-green-400">Running</span>
                        </>
                      ) : (
                        <>
                          <Square className="h-5 w-5 text-red-400 mr-2" />
                          <span className="text-lg font-semibold text-red-400">Stopped</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Within Schedule</div>
                    <div className="flex items-center">
                      {status.withinSchedule ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                          <span className="text-lg font-semibold text-green-400">Yes</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                          <span className="text-lg font-semibold text-yellow-400">No</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Points Awarded</div>
                    <div className="text-lg font-semibold text-yellow-400">{status.pointsAwarded}</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Interval</div>
                    <div className="text-sm">{formatInterval(status.interval)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Last Run</div>
                    <div className="text-sm">{formatDate(status.lastRun)}</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Next Run</div>
                    <div className="text-sm">{formatDate(status.nextRun)}</div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      onClick={startPassivePoints}
                      disabled={status.running || loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="mr-2 h-4 w-4" /> Start
                    </Button>
                    <Button
                      onClick={stopPassivePoints}
                      disabled={!status.running || loading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Square className="mr-2 h-4 w-4" /> Stop
                    </Button>
                  </div>
                  <Button
                    onClick={fetchStatus}
                    disabled={refreshing}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400 flex items-center">
                  <Calendar className="mr-2 h-6 w-6" /> Schedule Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set start and end times for the passive points system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Scheduled Start</div>
                    <div className="text-sm">{formatDate(status.scheduledStart)}</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Scheduled End</div>
                    <div className="text-sm">{formatDate(status.scheduledEnd)}</div>
                  </div>
                </div>

                {showScheduleForm ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-gray-300">
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={scheduleForm.startDate}
                          onChange={(e) => handleFormChange("startDate", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-gray-300">
                          Start Time
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={scheduleForm.startTime}
                          onChange={(e) => handleFormChange("startTime", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-gray-300">
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={scheduleForm.endDate}
                          onChange={(e) => handleFormChange("endDate", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-gray-300">
                          End Time
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={scheduleForm.endTime}
                          onChange={(e) => handleFormChange("endTime", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setShowScheduleForm(false)}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button onClick={updateSchedule} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        <Settings className="mr-2 h-4 w-4" /> Update Schedule
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowScheduleForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="mr-2 h-4 w-4" /> Configure Schedule
                  </Button>
                )}

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                    <div className="text-sm text-yellow-400">Schedule Notes</div>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Leave start/end times empty for no time restrictions</li>
                    <li>• Points are only awarded within the scheduled time window</li>
                    <li>• The system will continue running but skip point awards outside the schedule</li>
                    <li>• You can update the schedule while the system is running</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" /> How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Awards 1 point every 20 minutes to teams for each unsubmitted flag they own</li>
                <li>• Only counts flags that no other team has submitted</li>
                <li>• Respects the configured start and end times</li>
                <li>• Encourages teams to protect their flags throughout the competition</li>
              </ul>
            </CardContent>
          </Card>
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
