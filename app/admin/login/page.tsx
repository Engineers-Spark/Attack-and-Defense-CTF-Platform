"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog } from "@/components/alert-dialog"
import { Lock, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin")
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Login Failed",
          message: data.message || "Invalid credentials. Please try again.",
        })
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "An error occurred during login. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {alert.show && <AlertDialog type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />}

      <header className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-purple-400">Admin Control Panel</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-900/50 rounded-full">
                <ShieldAlert className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-purple-400 text-center">Admin Login</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-gray-400 text-sm">Restricted access for competition administrators only</p>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-gray-800 py-4 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Attack and Defense CTF Platform
        </div>
      </footer>
    </div>
  )
}
