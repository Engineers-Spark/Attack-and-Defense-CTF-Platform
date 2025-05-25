"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import { Users, Plus, Trash2, Edit, RefreshCw, Search, Flag, Trophy } from "lucide-react"

type Team = {
  _id: string
  name: string
  username: string
  score: number
  flags: string[]
  createdAt: string
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    score: 0,
    flagsCount: 5,
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

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/teams")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTeams(data.teams)
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch teams. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "score" || name === "flagsCount" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          flagsCount: formData.flagsCount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Team created successfully!",
        })
        setFormData({
          name: "",
          username: "",
          password: "",
          score: 0,
          flagsCount: 5,
        })
        setShowAddForm(false)
        fetchTeams()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to create team.",
        })
      }
    } catch (error) {
      console.error("Error creating team:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while creating the team.",
      })
    }
  }

  const handleEditTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTeam) return

    try {
      const response = await fetch(`/api/admin/teams/${editingTeam._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          score: formData.score,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Team updated successfully!",
        })
        setEditingTeam(null)
        setFormData({
          name: "",
          username: "",
          password: "",
          score: 0,
          flagsCount: 5,
        })
        fetchTeams()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to update team.",
        })
      }
    } catch (error) {
      console.error("Error updating team:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while updating the team.",
      })
    }
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/teams/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Team deleted successfully!",
        })
        fetchTeams()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to delete team.",
        })
      }
    } catch (error) {
      console.error("Error deleting team:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while deleting the team.",
      })
    }
  }

  const startEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      username: team.username,
      password: "", // Don't populate password for security
      score: team.score,
      flagsCount: team.flags.length,
    })
    setShowAddForm(false)
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingTeam(null)
    setFormData({
      name: "",
      username: "",
      password: "",
      score: 0,
      flagsCount: 5,
    })
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Team Management</h1>
              <p className="text-gray-400 mt-1">Add, edit, and remove teams</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowAddForm(!showAddForm)
                  setEditingTeam(null)
                  setFormData({
                    name: "",
                    username: "",
                    password: "",
                    score: 0,
                    flagsCount: 5,
                  })
                }}
                className={showAddForm ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
              >
                {showAddForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Team
                  </>
                )}
              </Button>
              <Button
                onClick={fetchTeams}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {(showAddForm || editingTeam) && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">{editingTeam ? "Edit Team" : "Add New Team"}</CardTitle>
                <CardDescription className="text-gray-400">
                  {editingTeam ? "Update team information" : "Create a new team for the competition"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingTeam ? handleEditTeam : handleAddTeam} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Team Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter team name"
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter login username"
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={editingTeam ? "Leave blank to keep current password" : "Enter password"}
                        required={!editingTeam}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    {editingTeam ? (
                      <div className="space-y-2">
                        <Label htmlFor="score" className="text-gray-300">
                          Score
                        </Label>
                        <Input
                          id="score"
                          name="score"
                          type="number"
                          value={formData.score}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="flagsCount" className="text-gray-300">
                          Number of Flags
                        </Label>
                        <Input
                          id="flagsCount"
                          name="flagsCount"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.flagsCount}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelForm}
                      className="border-gray-700 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingTeam ? "Update Team" : "Create Team"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search teams by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">Loading teams...</p>
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Team Name</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Username</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-center">
                      <Trophy className="h-4 w-4 inline mr-1" /> Score
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-center">
                      <Flag className="h-4 w-4 inline mr-1" /> Flags
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTeams.map((team) => (
                    <tr key={team._id} className="bg-gray-800 hover:bg-gray-700">
                      <td className="px-4 py-3 font-medium">{team.name}</td>
                      <td className="px-4 py-3 text-gray-300">{team.username}</td>
                      <td className="px-4 py-3 text-center font-bold">
                        <span className={team.score >= 0 ? "text-green-400" : "text-red-400"}>{team.score}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">{team.flags.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => startEdit(team)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-gray-600"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            onClick={() => handleDeleteTeam(team._id)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-gray-600"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <Users className="h-12 w-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No Teams Found</h3>
              <p className="text-gray-500">
                {searchTerm ? "No teams match your search criteria." : "There are no teams in the system yet."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="mt-4 border-gray-700 text-gray-300"
                >
                  Clear Search
                </Button>
              )}
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
