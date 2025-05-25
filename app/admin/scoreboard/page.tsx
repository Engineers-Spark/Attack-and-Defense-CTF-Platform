"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Trophy, RefreshCw, Medal, Award, Crown } from "lucide-react"

type TeamScore = {
  team: string
  score: number
  rank: number
}

export default function AdminScoreboardPage() {
  const [scores, setScores] = useState<TeamScore[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
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

  const getRowClass = (rank: number) => {
    if (rank === 1) return "bg-yellow-900/20 border-yellow-500"
    if (rank === 2) return "bg-gray-500/10 border-gray-400"
    if (rank === 3) return "bg-amber-800/10 border-amber-700"
    return "border-gray-700"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-400">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Competition Scoreboard</h1>
              <p className="text-gray-400 mt-1">Real-time competition standings</p>
            </div>
            <Button
              onClick={fetchScores}
              disabled={loading}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

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
                  <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
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
                        <th className="px-4 py-3 text-gray-300 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {scores.map((team) => (
                        <tr key={team.team} className={`border-l-4 ${getRowClass(team.rank)}`}>
                          <td className="px-4 py-4 font-medium">
                            <div className="flex items-center">
                              {getRankIcon(team.rank)}
                              <span className="ml-2">
                                {team.rank === 1 && <span className="text-yellow-400 font-bold">1st</span>}
                                {team.rank === 2 && <span className="text-gray-300 font-bold">2nd</span>}
                                {team.rank === 3 && <span className="text-amber-600 font-bold">3rd</span>}
                                {team.rank > 3 && <span className="text-gray-400">{team.rank}th</span>}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium">{team.team}</td>
                          <td className="px-4 py-4 font-bold text-right">
                            {team.score >= 0 ? (
                              <span className="text-green-400">{team.score}</span>
                            ) : (
                              <span className="text-red-400">{team.score}</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {team.rank === 1 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                                🏆 Leading
                              </span>
                            )}
                            {team.rank === 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700/30 text-gray-300">
                                🥈 2nd Place
                              </span>
                            )}
                            {team.rank === 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-600">
                                🥉 3rd Place
                              </span>
                            )}
                            {team.rank > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800/30 text-gray-400">
                                Competing
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Scores Available</h3>
                  <p className="text-gray-500">No teams have been created yet or no scores have been recorded.</p>
                </div>
              )}

              {scores.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{scores.length}</div>
                    <div className="text-sm text-gray-400">Teams Competing</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{Math.max(...scores.map((s) => s.score))}</div>
                    <div className="text-sm text-gray-400">Highest Score</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {scores.reduce((sum, team) => sum + team.score, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                </div>
              )}
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
