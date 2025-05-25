"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ArrowLeft, RefreshCw } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"
import { StatsGraph } from "@/components/stats-graph"
import { useRouter } from "next/navigation"

type TeamScore = {
  team: string
  score: number
  rank: number
}

type PassivePointsStatus = {
  running: boolean
  nextRun: string | null
  lastRun: string | null
  pointsAwarded: number
  startedAt: string | null
}

export default function ScoreboardPage() {
  const [scores, setScores] = useState<TeamScore[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [passivePointsStatus, setPassivePointsStatus] = useState<PassivePointsStatus>({
    running: false,
    nextRun: null,
    lastRun: null,
    pointsAwarded: 0,
    startedAt: null,
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth")
        const data = await response.json()
        setIsAuthenticated(response.ok && data.authenticated)
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchScores = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/scoreboard")
      const data = await response.json()

      if (response.ok) {
        // Sort by score (highest first) and add rank
        const sortedScores = data.scores
          .sort((a: TeamScore, b: TeamScore) => b.score - a.score)
          .map((team: TeamScore, index: number) => ({
            ...team,
            rank: index + 1,
          }))

        setScores(sortedScores)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch scoreboard", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchScores, 30000)

    return () => clearInterval(intervalId)
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

  const getRowClass = (rank: number) => {
    if (rank === 1) return "bg-yellow-900/20 border-yellow-500"
    if (rank === 2) return "bg-gray-500/10 border-gray-400"
    if (rank === 3) return "bg-amber-800/10 border-amber-700"
    return "border-gray-700"
  }

  const handleBackClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-blue-400">Attack And Defense CTF Platform</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              className="bg-slate-600 hover:bg-slate-700 text-white"
              onClick={handleBackClick}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isLoading ? "Loading..." : isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Button>

            <div className="flex items-center gap-4">
              <CountdownTimer
                running={passivePointsStatus.running}
                nextRun={passivePointsStatus.nextRun}
                className="mr-2"
              />

              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={fetchScores} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""} text-white`} />
                Refresh Scores
              </Button>
            </div>
          </div>

          {/* Stats Graph */}
          <StatsGraph />

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-400" /> Live Scoreboard
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                {lastUpdated ? <>Last updated: {lastUpdated.toLocaleTimeString()}</> : <>Loading scores...</>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && scores.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading scoreboard...</p>
                </div>
              ) : scores.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-gray-300 font-semibold">Rank</th>
                        <th className="px-4 py-3 text-gray-300 font-semibold">Team</th>
                        <th className="px-4 py-3 text-gray-300 font-semibold text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {scores.map((team) => (
                        <tr key={team.team} className={`border-l-4 ${getRowClass(team.rank)}`}>
                          <td className="px-4 py-4 font-medium">
                            {team.rank === 1 && <span className="text-yellow-400 font-bold">🏆 1st</span>}
                            {team.rank === 2 && <span className="text-gray-300 font-bold">🥈 2nd</span>}
                            {team.rank === 3 && <span className="text-amber-600 font-bold">🥉 3rd</span>}
                            {team.rank > 3 && <span className="text-gray-400">{team.rank}th</span>}
                          </td>
                          <td className="px-4 py-4 font-medium">{team.team}</td>
                          <td className="px-4 py-4 font-bold text-right">
                            {team.score >= 0 ? (
                              <span className="text-green-400">{team.score}</span>
                            ) : (
                              <span className="text-red-400">{team.score}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No scores available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
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
