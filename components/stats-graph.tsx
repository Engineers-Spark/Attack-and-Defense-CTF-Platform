"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

type SubmissionStat = {
  team: string
  submitted: number
  owned: number
  captured: number
  uncaptured: number
  successRate: number
  defenseRate: number
}

export function StatsGraph() {
  const [stats, setStats] = useState<SubmissionStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/submission-stats")

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-400">Submission Statistics</CardTitle>
          <CardDescription className="text-gray-400">Loading submission data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-red-400">Submission Statistics</CardTitle>
          <CardDescription className="text-gray-400">Error loading statistics</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-400">{error}</CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-blue-400">Submission Statistics</CardTitle>
        <CardDescription className="text-gray-400">Flag submission and defense performance by team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="team" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar dataKey="submitted" name="Flags Submitted" fill="#3B82F6" />
              <Bar dataKey="uncaptured" name="Flags Defended" fill="#10B981" />
              <Bar dataKey="captured" name="Flags Lost" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Success Rate</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={`success-${stat.team}`} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{stat.team}:</span>
                  <span className="text-sm font-medium text-blue-400">{stat.successRate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Defense Rate</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={`defense-${stat.team}`} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{stat.team}:</span>
                  <span className="text-sm font-medium text-green-400">{stat.defenseRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
