"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, RefreshCw } from "lucide-react"
import { AlertDialog } from "@/components/alert-dialog"

interface ChatMessage {
  _id: string
  nickname: string
  message: string
  teamName: string
  createdAt: string
}

export function TeamChat({ teamName }: { teamName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nickname, setNickname] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages()

    // Set up polling for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/chat")

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      setAlert({
        show: true,
        type: "warning",
        title: "Nickname Required",
        message: "Please enter a nickname to send a message.",
      })
      return
    }

    if (!message.trim()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, message }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send message")
      }

      // Clear message input but keep nickname
      setMessage("")

      // Fetch latest messages
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Message Failed",
        message: error.message || "Failed to send message. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-purple-400">Team Chat</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMessages}
            disabled={refreshing}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>

        <div className="bg-gray-700 rounded-lg border border-gray-600 flex-1 mb-3 overflow-y-auto max-h-[300px]">
          <div className="p-3 space-y-3">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 rounded-lg ${
                    msg.teamName === teamName
                      ? "bg-blue-900/30 border border-blue-800/50 ml-6"
                      : "bg-gray-800/50 border border-gray-700 mr-6"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`font-semibold text-sm ${
                        msg.teamName === teamName ? "text-blue-400" : "text-green-400"
                      }`}
                    >
                      {msg.nickname} {msg.teamName === teamName ? "(You)" : `(${msg.teamName})`}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1 break-words">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No messages yet. Be the first to send one!</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="w-1/3">
              <Label htmlFor="nickname" className="sr-only">
                Nickname
              </Label>
              <Input
                id="nickname"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={30}
              />
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                id="message"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white flex-1"
                maxLength={500}
              />
              <Button type="submit" disabled={loading || !message.trim()} className="bg-purple-600 hover:bg-purple-700">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-400">Enter a nickname and message to chat with other teams</div>
        </form>
      </div>
    </>
  )
}
