"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, X } from "lucide-react"

interface FlagNotification {
  id: string
  message: string
  team: string
  timestamp: Date
}

export function FlagNotificationSystem() {
  const [notifications, setNotifications] = useState<FlagNotification[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Set up event source for server-sent events
    const eventSource = new EventSource("/api/notifications")

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "flag-submission" && data.flagOwner) {
          const newNotification: FlagNotification = {
            id: Date.now().toString(),
            message: `${data.team} has submitted one of your flags!`,
            team: data.team,
            timestamp: new Date(),
          }

          setNotifications((prev) => [...prev, newNotification])

          // Play sound
          if (audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.error("Error playing notification sound:", err)
            })
          }

          // Auto-remove after 10 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
          }, 10000)
        }
      } catch (error) {
        console.error("Error parsing notification:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error)
      eventSource.close()

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        const newEventSource = new EventSource("/api/notifications")
        eventSource.onmessage = eventSource.onmessage
        eventSource.onerror = eventSource.onerror
      }, 5000)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) {
    return <audio ref={audioRef} src="/sounds/alert.mp3" preload="auto" />
  }

  return (
    <>
      <audio ref={audioRef} src="/sounds/alert.mp3" preload="auto" />
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-red-900 border border-red-700 text-white p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-red-400">{notification.team}</div>
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-300 mt-1">{notification.timestamp.toLocaleTimeString()}</p>
            </div>
            <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
