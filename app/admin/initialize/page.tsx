"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import { RefreshCw, AlertTriangle, Play, Users, Flag } from "lucide-react"

export default function AdminInitializePage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [initData, setInitData] = useState<any>(null)
  const [teamsConfig, setTeamsConfig] = useState(`[
  { "name": "Team1", "username": "team1", "password": "password1" },
  { "name": "Team2", "username": "team2", "password": "password2" },
  { "name": "Team3", "username": "team3", "password": "password3" },
  { "name": "Team4", "username": "team4", "password": "password4" }
]`)
  const [flagsPerTeam, setFlagsPerTeam] = useState(5)
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

  const handleInitialize = async () => {
    if (
      !confirm(
        "WARNING: This will reset the entire competition, deleting all teams, flags, and chat messages. Are you sure you want to continue?",
      )
    ) {
      return
    }

    setIsInitializing(true)

    try {
      // Parse teams config
      let teams
      try {
        teams = JSON.parse(teamsConfig)
        if (!Array.isArray(teams)) {
          throw new Error("Teams configuration must be an array")
        }
      } catch (parseError) {
        setAlert({
          show: true,
          type: "error",
          title: "Invalid JSON",
          message: "The teams configuration is not valid JSON. Please check your syntax.",
        })
        setIsInitializing(false)
        return
      }

      const response = await fetch("/api/admin/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teams,
          flagsPerTeam,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsInitialized(true)
        setInitData(data)
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Competition initialized successfully!",
        })
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to initialize competition",
        })
      }
    } catch (error) {
      console.error("Initialization error:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred during initialization",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-400">Initialize Competition</h1>
            <p className="text-gray-400 mt-1">Reset and set up the competition with teams and flags</p>
          </div>

          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-red-400 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" /> Warning
              </CardTitle>
              <CardDescription className="text-gray-400">This will reset the entire competition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg mb-4">
                <p className="text-red-300">Initializing the competition will:</p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• Delete all existing teams</li>
                  <li>• Delete all existing flags</li>
                  <li>• Clear all chat messages</li>
                  <li>• Reset all scores to zero</li>
                </ul>
                <p className="mt-2 text-red-300 font-semibold">This action cannot be undone!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400 flex items-center">
                <Play className="mr-2 h-5 w-5" /> Competition Setup
              </CardTitle>
              <CardDescription className="text-gray-400">Configure teams and flags for the competition</CardDescription>
            </CardHeader>
            <CardContent>
              {!isInitialized ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamsConfig" className="text-gray-300">
                      Teams Configuration (JSON)
                    </Label>
                    <Textarea
                      id="teamsConfig"
                      value={teamsConfig}
                      onChange={(e) => setTeamsConfig(e.target.value)}
                      className="h-64 font-mono text-sm bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400">
                      Enter teams as a JSON array with name, username, and password for each team.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flagsPerTeam" className="text-gray-300">
                      Flags Per Team
                    </Label>
                    <Input
                      id="flagsPerTeam"
                      type="number"
                      min="1"
                      max="20"
                      value={flagsPerTeam}
                      onChange={(e) => setFlagsPerTeam(Number.parseInt(e.target.value) || 5)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400">Number of flags to generate for each team.</p>
                  </div>

                  <Button
                    onClick={handleInitialize}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isInitializing}
                  >
                    {isInitializing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      "Initialize Competition"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-green-400 flex items-center">
                      <Play className="mr-2 h-5 w-5" /> Competition Initialized!
                    </h3>
                    <p className="text-gray-300 mb-2">The competition has been set up successfully.</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-gray-300">Teams created: {initData?.teams?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Flag className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-gray-300">Flags per team: {flagsPerTeam}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">Team Credentials</h3>
                    <div className="overflow-auto max-h-64">
                      <table className="w-full text-left">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-3 py-2 text-gray-300 font-semibold">Team Name</th>
                            <th className="px-3 py-2 text-gray-300 font-semibold">Username</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {initData?.teams?.map((team: any, index: number) => (
                            <tr key={index} className="bg-gray-800 hover:bg-gray-700">
                              <td className="px-3 py-2 font-medium">{team.name}</td>
                              <td className="px-3 py-2 text-gray-300">{team.username}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setIsInitialized(false)
                      setInitData(null)
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Initialize Another Competition
                  </Button>
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
