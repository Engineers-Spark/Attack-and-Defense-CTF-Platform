"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Flag, Award, Clock, RefreshCw } from "lucide-react"

type ConfigType = {
  SELF_FLAG_POINTS: number
  ATTACK_POINTS: number
  DEFENSE_PENALTY: number
  PASSIVE_POINTS_VALUE: number
  PASSIVE_POINTS_INTERVAL: number
  MAX_SUBMISSIONS_PER_MINUTE: number
  RATE_LIMIT_WINDOW: number
}

export default function RulesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [config, setConfig] = useState<ConfigType>({
    SELF_FLAG_POINTS: 10,
    ATTACK_POINTS: 200,
    DEFENSE_PENALTY: 50,
    PASSIVE_POINTS_VALUE: 1,
    PASSIVE_POINTS_INTERVAL: 1200000,
    MAX_SUBMISSIONS_PER_MINUTE: 10,
    RATE_LIMIT_WINDOW: 60000,
  })
  const [configLoading, setConfigLoading] = useState(true)

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

  useEffect(() => {
    // Fetch current configuration
    const fetchConfig = async () => {
      try {
        setConfigLoading(true)
        const response = await fetch("/api/config")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setConfig(data.config)
          }
        }
      } catch (error) {
        console.error("Failed to fetch config:", error)
      } finally {
        setConfigLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleBackClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  const refreshConfig = async () => {
    setConfigLoading(true)
    try {
      const response = await fetch("/api/config")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error("Failed to refresh config:", error)
    } finally {
      setConfigLoading(false)
    }
  }

  const formatInterval = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center text-yellow-400">Attack And Defense CTF Platform</h1>
          <Button
            onClick={refreshConfig}
            disabled={configLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${configLoading ? "animate-spin" : ""}`} />
            Refresh Rules
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            className="bg-slate-600 hover:bg-slate-700 text-white mb-8"
            onClick={handleBackClick}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isLoading ? "Loading..." : isAuthenticated ? "Back to Dashboard" : "Back to Home"}
          </Button>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-400">Official Competition Rules</CardTitle>
              <CardDescription className="text-gray-400">
                Please read and understand all rules before participating
                {configLoading && <span className="ml-2">(Loading current values...)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-400">
                  <Flag className="mr-2 h-5 w-5" /> Flag Submission Rules
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Each team has their own set of unique flags (hashes).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>
                      When you submit your own flag, you gain{" "}
                      <strong className="text-green-400">
                        {configLoading ? "..." : config.SELF_FLAG_POINTS} points
                      </strong>
                      .
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>
                      When you submit another team's flag, you gain{" "}
                      <strong className="text-green-400">{configLoading ? "..." : config.ATTACK_POINTS} points</strong>,
                      and the team that owns the flag loses{" "}
                      <strong className="text-red-400">{configLoading ? "..." : config.DEFENSE_PENALTY} points</strong>.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Each team can submit a specific flag only once.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Different teams can submit the same flag.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>
                      Rate limit: Maximum{" "}
                      <strong className="text-yellow-400">
                        {configLoading ? "..." : config.MAX_SUBMISSIONS_PER_MINUTE} flag submissions per{" "}
                        {configLoading ? "..." : formatInterval(config.RATE_LIMIT_WINDOW)}
                      </strong>
                      .
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-400">
                  <Clock className="mr-2 h-5 w-5" /> Passive Points
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>
                      Teams earn{" "}
                      <strong className="text-green-400">
                        {configLoading ? "..." : config.PASSIVE_POINTS_VALUE} point
                        {config.PASSIVE_POINTS_VALUE !== 1 ? "s" : ""} every{" "}
                        {configLoading ? "..." : formatInterval(config.PASSIVE_POINTS_INTERVAL)}
                      </strong>{" "}
                      for each flag they own that has not been submitted by any other team.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>This rewards teams for successfully defending their flags.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-400">
                  <Shield className="mr-2 h-5 w-5" /> Defense Strategy
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Protect your flags from being discovered by other teams.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement security measures to prevent unauthorized access to your systems.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Monitor your systems for suspicious activities.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-400">
                  <Award className="mr-2 h-5 w-5" /> Scoring and Winning
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>The team with the highest score at the end of the competition wins.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Scores are updated in real-time and can be viewed on the scoreboard.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>In case of a tie, the team that reached the score first wins.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Current Competition Settings</h3>
                {configLoading ? (
                  <div className="flex items-center text-gray-400">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Loading current settings...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="text-green-400 font-semibold">Own Flag Submission</div>
                      <div className="text-gray-300">+{config.SELF_FLAG_POINTS} points</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="text-blue-400 font-semibold">Successful Attack</div>
                      <div className="text-gray-300">+{config.ATTACK_POINTS} points</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="text-red-400 font-semibold">Defense Penalty</div>
                      <div className="text-gray-300">-{config.DEFENSE_PENALTY} points</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="text-yellow-400 font-semibold">Passive Points</div>
                      <div className="text-gray-300">
                        +{config.PASSIVE_POINTS_VALUE} every {formatInterval(config.PASSIVE_POINTS_INTERVAL)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Important Notes</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>The competition administrators have the final say in all disputes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Any form of cheating or rule violation will result in disqualification.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Competition settings may be updated by administrators during the event.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Have fun and learn from the experience!</span>
                  </li>
                </ul>
              </div>
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
