"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AlertDialog } from "@/components/alert-dialog"
import { MessageSquare, Trash2, RefreshCw, Search, AlertTriangle, User } from "lucide-react"

type ChatMessage = {
  _id: string
  nickname: string
  message: string
  teamName: string
  createdAt: string
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/chat")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch chat messages. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/admin/chat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Success",
          message: "Message deleted successfully!",
        })
        fetchMessages()
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          message: data.message || "Failed to delete message.",
        })
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred while deleting the message.",
      })
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.teamName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <AdminSidebar />

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Chat Logs</h1>
              <p className="text-gray-400 mt-1">View and moderate team chat messages</p>
            </div>
            <Button
              onClick={fetchMessages}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search messages by content, nickname, or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Chat Messages
              </CardTitle>
              <CardDescription className="text-gray-400">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-4" />
                  <p className="text-gray-400">Loading messages...</p>
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div key={message._id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-blue-400 mr-2" />
                          <div>
                            <span className="font-semibold text-blue-400">{message.nickname}</span>
                            <span className="text-gray-400 ml-2">({message.teamName})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
                          <Button
                            onClick={() => handleDeleteMessage(message._id)}
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-gray-600"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-200 break-words">{message.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Messages Found</h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No messages match your search criteria."
                      : "There are no chat messages in the system yet."}
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
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" /> Moderation Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Remove any messages containing offensive, inappropriate, or harmful content.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Delete messages that reveal solutions or provide unfair advantages.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Monitor for any attempts to coordinate cheating between teams.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Ensure the chat remains a positive and fair environment for all participants.</span>
                </li>
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
