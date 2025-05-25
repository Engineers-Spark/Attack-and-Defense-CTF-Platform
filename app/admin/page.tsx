"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Users, Flag, MessageSquare, Trophy, Clock, Sliders } from "lucide-react"
import { useRouter } from "next/navigation"

type DashboardStats = {
  teamCount: number
  flagCount: number
  messageCount: number
  totalScore: number
  passivePointsStatus: {
    running: boolean
    pointsAwarded: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    teamCount: 0,
    flagCount: 0,
    messageCount: 0,
    totalScore: 0,
    passivePointsStatus: {
      running: false,
      pointsAwarded: 0,
    },
  })
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Fetch teams
        const teamsResponse = await fetch("/api/admin/teams")
        const teamsData = await teamsResponse.json()

        // Fetch flags
        const flagsResponse = await fetch("/api/admin/flags")
        const flagsData = await flagsResponse.json()

        // Fetch chat messages
        const chatResponse = await fetch("/api/admin/chat")
        const chatData = await chatResponse.json()

        // Fetch passive points status
        const passivePointsResponse = await fetch("/api/admin/passive-points")
        const passivePointsData = await passivePointsResponse.json()

        // Calculate total score
        const totalScore = teamsData.success
          ? teamsData.teams.reduce((sum: number, team: any) => sum + team.score, 0)
          : 0

        setStats({
          teamCount: teamsData.success ? teamsData.teams.length : 0,
          flagCount: flagsData.success ? flagsData.flags.length : 0,
          messageCount: chatData.success ? chatData.count : 0,
          totalScore,
          passivePointsStatus: {
            running: passivePointsData.success ? passivePointsData.status.running : false,
            pointsAwarded: passivePointsData.success ? passivePointsData.status.pointsAwarded : 0,
          },
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-400">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of the Attack and Defense CTF Platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-400 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? <span className="text-gray-500">...</span> : stats.teamCount}
                </div>
                <p className="text-gray-400 text-sm mt-1">Registered teams</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-400 flex items-center">
                  <Flag className="mr-2 h-5 w-5" /> Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? <span className="text-gray-500">...</span> : stats.flagCount}
                </div>
                <p className="text-gray-400 text-sm mt-1">Total flags in system</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-yellow-400 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" /> Total Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? <span className="text-gray-500">...</span> : stats.totalScore}
                </div>
                <p className="text-gray-400 text-sm mt-1">Points across all teams</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-400 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" /> Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? <span className="text-gray-500">...</span> : stats.messageCount}
                </div>
                <p className="text-gray-400 text-sm mt-1">Chat messages sent</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-green-400 flex items-center">
                  <Clock className="mr-2 h-5 w-5" /> Passive Points System
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Status of the automatic points awarding system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-300">Status</div>
                    <div
                      className={`font-semibold ${stats.passivePointsStatus.running ? "text-green-400" : "text-red-400"}`}
                    >
                      {stats.passivePointsStatus.running ? "Running" : "Stopped"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-300">Points Awarded</div>
                    <div className="font-semibold text-yellow-400">
                      {loading ? "..." : stats.passivePointsStatus.pointsAwarded}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-300 mb-2">System Info</div>
                    <p className="text-sm text-gray-400">
                      The passive points system awards points at regular intervals to teams for each unsubmitted flag
                      they own.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" /> Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-400">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="/admin/teams" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <h3 className="font-semibold text-blue-400 mb-1">Manage Teams</h3>
                    <p className="text-sm text-gray-400">Add, edit, or remove teams</p>
                  </a>

                  <a href="/admin/flags" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <h3 className="font-semibold text-green-400 mb-1">Manage Flags</h3>
                    <p className="text-sm text-gray-400">Create and assign flags</p>
                  </a>

                  <a
                    href="/admin/passive-points"
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-semibold text-yellow-400 mb-1">Passive Points</h3>
                    <p className="text-sm text-gray-400">Control the points system</p>
                  </a>

                  <a href="/admin/config" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <h3 className="font-semibold text-purple-400 mb-1 flex items-center">
                      <Sliders className="mr-1 h-4 w-4" /> Configuration
                    </h3>
                    <p className="text-sm text-gray-400">Manage scoring and timing</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
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
