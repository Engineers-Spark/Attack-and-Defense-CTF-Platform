"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Flag, AlertTriangle, Trophy } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"
import { FlagNotificationSystem } from "@/components/flag-notification"
import { AlertDialog } from "@/components/alert-dialog"
import { TeamChat } from "@/components/team-chat"

type SubmittedFlag = {
  value: string
  owner: string
}

type PassivePointsStatus = {
  running: boolean
  nextRun: string | null
  lastRun: string | null
  pointsAwarded: number
  startedAt: string | null
}

export default function DashboardPage() {
  const [team, setTeam] = useState<string | null>(null)
  const [score, setScore] = useState<number>(0)
  const [flag, setFlag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedFlags, setSubmittedFlags] = useState<SubmittedFlag[]>([])
  const [passivePointsStatus, setPassivePointsStatus] = useState<PassivePointsStatus>({
    running: false,
    nextRun: null,
    lastRun: null,
    pointsAwarded: 0,
    startedAt: null,
  })
  const [config, setConfig] = useState({
    SELF_FLAG_POINTS: 10,
    ATTACK_POINTS: 200,
    DEFENSE_PENALTY: 50,
    PASSIVE_POINTS_VALUE: 1,
    PASSIVE_POINTS_INTERVAL: 1200000,
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
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth")
        const data = await response.json()

        if (!response.ok) {
          router.push("/login")
          return
        }

        setTeam(data.team)
        setScore(data.score)
        setSubmittedFlags(data.submittedFlags || [])
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/config")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setConfig(data.config)
          }
        }
      } catch (error) {
        console.error("Failed to fetch config:", error)
      }
    }

    fetchConfig()
  }, [])

  useEffect(() => {
    const fetchPassivePointsStatus = async () => {
      try {
        const response = await fetch("/api/admin/passive-points")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setPassivePointsStatus(data.status)
          }
        }
      } catch (error) {
        console.error("Failed to fetch passive points status:", error)
      }
    }

    fetchPassivePointsStatus()

    // Refresh status every 30 seconds
    const interval = setInterval(fetchPassivePointsStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Flag Submitted Successfully",
          message: data.message,
        })

        // Update score
        setScore(data.newScore)
        setFlag("")

        // Update remaining attempts
        if (data.remaining !== undefined) {
          setRemainingAttempts(data.remaining)
        }

        // Refresh data to get updated submitted flags
        const authResponse = await fetch("/api/check-auth")
        const authData = await authResponse.json()
        setSubmittedFlags(authData.submittedFlags || [])
      } else {
        // Handle rate limit
        if (response.status === 429) {
          setAlert({
            show: true,
            type: "warning",
            title: "Rate Limit Exceeded",
            message: data.message,
          })
        } else {
          setAlert({
            show: true,
            type: "error",
            title: "Submission Failed",
            message: data.message,
          })
        }

        // Update remaining attempts
        if (data.remaining !== undefined) {
          setRemainingAttempts(data.remaining)
        }
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred during flag submission",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <FlagNotificationSystem />

      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <header className="bg-gray-800 py-4 border-b border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">Attack And Defense CTF Platform</h1>
          <div className="flex items-center space-x-4">
            <CountdownTimer running={passivePointsStatus.running} nextRun={passivePointsStatus.nextRun} />
            <div className="text-gray-300 ml-4">
              <span className="font-bold text-green-400">{team}</span> | Score:{" "}
              <span className="font-bold">{score}</span>
            </div>
            <Button size="sm" onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-green-400 flex items-center">
                  <Flag className="mr-2 h-5 w-5" /> Flag Submission
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Submit flags to gain points or attack other teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFlag} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flag" className="text-gray-300">
                      Flag
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="flag"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        placeholder="Enter flag (e.g., 123e4567-e89b-12d3-a456-426614174000)"
                        required
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                      />
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                    {remainingAttempts !== null && (
                      <p className="text-xs text-gray-400 mt-1">
                        Remaining submissions: {remainingAttempts} of 10 per minute
                      </p>
                    )}
                  </div>
                </form>

                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-400 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Submission Rules
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>
                      • Submit your own flag: <span className="text-green-400">+{config.SELF_FLAG_POINTS} points</span>
                    </li>
                    <li>
                      • Submit another team's flag:{" "}
                      <span className="text-green-400">+{config.ATTACK_POINTS} points</span> for you,{" "}
                      <span className="text-red-400">-{config.DEFENSE_PENALTY} points</span> for them
                    </li>
                    <li>• Each team can submit a specific flag only once</li>
                    <li>• Different teams can submit the same flag</li>
                    <li>
                      • Rate limit: <span className="text-yellow-400">10 submissions per minute</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" /> Submitted Flags
                </CardTitle>
                <CardDescription className="text-gray-400">Flags you have successfully submitted</CardDescription>
              </CardHeader>
              <CardContent>
                {submittedFlags.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submittedFlags.map((submittedFlag, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          submittedFlag.owner === team
                            ? "bg-green-900/20 border-green-700"
                            : "bg-blue-900/20 border-blue-700"
                        }`}
                      >
                        <div className="font-mono text-sm text-gray-300 break-all">{submittedFlag.value}</div>
                        <div className="mt-1 text-xs">
                          {submittedFlag.owner === team ? (
                            <span className="text-green-400">Your flag (+{config.SELF_FLAG_POINTS} points)</span>
                          ) : (
                            <span className="text-blue-400">
                              From {submittedFlag.owner} (+{config.ATTACK_POINTS} points)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">You haven't submitted any flags yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/scoreboard" className="w-full block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View Scoreboard</Button>
                </Link>
                <Link href="/rules" className="w-full block">
                  <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white">Competition Rules</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400 flex items-center">
                  <Shield className="mr-2 h-5 w-5" /> Team Communication
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Chat with other teams during the competition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamChat teamName={team} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-4 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Attack And Defense CTF Platform
        </div>
      </footer>
    </div>
  )
}
