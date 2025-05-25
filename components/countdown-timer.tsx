"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  running: boolean
  nextRun: string | null
  className?: string
}

export function CountdownTimer({ running, nextRun, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    if (!running || !nextRun) {
      setTimeLeft(null)
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date()
      const target = new Date(nextRun)
      const diff = target.getTime() - now.getTime()

      if (diff <= 0) {
        // Time has passed, wait for the next update
        setTimeLeft({ minutes: 0, seconds: 0 })
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ minutes, seconds })
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [running, nextRun])

  if (!running) {
    return (
      <div className={`flex items-center text-gray-400 ${className}`}>
        <Clock className="mr-2 h-4 w-4" />
        <span>Passive Points: Stopped</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <Clock className="h-4 w-4 text-green-400" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      </div>
      <span className="text-green-400">
        Next Points:{" "}
        {timeLeft ? (
          <>
            {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </>
        ) : (
          "Loading..."
        )}
      </span>
    </div>
  )
}
