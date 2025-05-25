"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import { Plus, Trash2, Edit, RefreshCw, Search, Shield, CheckCircle } from "lucide-react"

// Import the UUID generator
import { generateUUID } from "@/lib/uuid-generator"

type FlagType = {
  _id: string
  value: string
  owner: string
  submissions: {
    team: string
    submittedAt: string
  }[]
  createdAt: string
}

type Team = {
  _id: string
  name: string
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FlagType[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FlagType | null>(null)
  const [formData, setFormData] = useState({
    value: "",
    owner: "",
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

  const fetchFlags = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/flags")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFlags(data.flags)
        }
      }
    } catch (error) {
      console.error("Error fetching flags:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch flags. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
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
    }
  }

  useEffect(() => {
    fetchFlags()
    fetchTeams()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      owner: value,
    })
  }

  const handleAddFlag = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/flags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: formData.value,
          owner: formData.owner,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Flag created successfully!",
        })
        setFormData({
          value: "",
          owner: "",
        })
        setShowAddForm(false)
        fetchFlags()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to create flag.",
        })
      }
    } catch (error) {
      console.error("Error creating flag:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while creating the flag.",
      })
    }
  }

  const handleEditFlag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFlag) return

    try {
      const response = await fetch(`/api/admin/flags/${editingFlag._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: formData.value,
          owner: formData.owner,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Flag updated successfully!",
        })
        setEditingFlag(null)
        setFormData({
          value: "",
          owner: "",
        })
        fetchFlags()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to update flag.",
        })
      }
    } catch (error) {
      console.error("Error updating flag:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while updating the flag.",
      })
    }
  }

  const handleDeleteFlag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flag? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/flags/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Flag deleted successfully!",
        })
        fetchFlags()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to delete flag.",
        })
      }
    } catch (error) {
      console.error("Error deleting flag:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while deleting the flag.",
      })
    }
  }

  const startEdit = (flag: FlagType) => {
    setEditingFlag(flag)
    setFormData({
      value: flag.value,
      owner: flag.owner,
    })
    setShowAddForm(false)
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingFlag(null)
    setFormData({
      value: "",
      owner: "",
    })
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const generateRandomFlag = () => {
    const uuid = generateUUID()
    setFormData({
      ...formData,
      value: uuid,
    })
  }

  const filteredFlags = flags.filter(
    (flag) =>
      flag.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flag.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Flag Management</h1>
              <p className="text-gray-400 mt-1">Create, edit, and remove flags</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowAddForm(!showAddForm)
                  setEditingFlag(null)
                  setFormData({
                    value: "",
                    owner: "",
                  })
                }}
                className={showAddForm ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
              >
                {showAddForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Flag
                  </>
                )}
              </Button>
              <Button
                onClick={fetchFlags}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {(showAddForm || editingFlag) && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">{editingFlag ? "Edit Flag" : "Add New Flag"}</CardTitle>
                <CardDescription className="text-gray-400">
                  {editingFlag ? "Update flag information" : "Create a new flag for a team"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingFlag ? handleEditFlag : handleAddFlag} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-gray-300">
                        Flag Value
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="value"
                          name="value"
                          value={formData.value}
                          onChange={handleInputChange}
                          placeholder="Enter flag value or generate random"
                          required
                          className="bg-gray-700 border-gray-600 text-white flex-1"
                        />
                        <Button
                          type="button"
                          onClick={generateRandomFlag}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner" className="text-gray-300">
                        Owner Team
                      </Label>
                      <Select value={formData.owner} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {teams.map((team) => (
                            <SelectItem key={team._id} value={team.name}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                      {editingFlag ? "Update Flag" : "Create Flag"}
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
                placeholder="Search flags by value or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">Loading flags...</p>
            </div>
          ) : filteredFlags.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Flag Value</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Owner</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-center">Submissions</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-center">Status</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredFlags.map((flag) => (
                    <tr key={flag._id} className="bg-gray-800 hover:bg-gray-700">
                      <td className="px-4 py-3 font-mono text-sm">{flag.value}</td>
                      <td className="px-4 py-3 text-gray-300">{flag.owner}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{flag.submissions.length}</td>
                      <td className="px-4 py-3 text-center">
                        {flag.submissions.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                            <CheckCircle className="mr-1 h-3 w-3" /> Captured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                            <Shield className="mr-1 h-3 w-3" /> Protected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => startEdit(flag)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-gray-600"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            onClick={() => handleDeleteFlag(flag._id)}
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
              <span className="h-12 w-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No Flags Found</h3>
              <p className="text-gray-500">
                {searchTerm ? "No flags match your search criteria." : "There are no flags in the system yet."}
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
