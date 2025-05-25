"use client"

import * as React from "react"
import { AlertCircle, XCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface AlertDialogProps {
  type: "error" | "success" | "warning" | "info"
  title: string
  message: string
  onClose: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

export function AlertDialog({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}: AlertDialogProps) {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseTime, onClose])

  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle className="h-6 w-6 text-red-400" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />
      case "info":
        return <AlertCircle className="h-6 w-6 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "error":
        return "bg-red-900/80 border-red-700"
      case "success":
        return "bg-green-900/80 border-green-700"
      case "warning":
        return "bg-yellow-900/80 border-yellow-700"
      case "info":
        return "bg-blue-900/80 border-blue-700"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border ${getBackgroundColor()} animate-slideIn`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-200 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
