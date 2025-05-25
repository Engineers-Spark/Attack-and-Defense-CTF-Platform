"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Flag, Clock, MessageSquare, Settings, LogOut, Home, Menu, X, Trophy, Sliders } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/teams", label: "Teams", icon: Users },
    { href: "/admin/flags", label: "Flags", icon: Flag },
    { href: "/admin/scoreboard", label: "Scoreboard", icon: Trophy },
    { href: "/admin/passive-points", label: "Passive Points", icon: Clock },
    { href: "/admin/config", label: "Configuration", icon: Sliders },
    { href: "/admin/chat", label: "Chat Logs", icon: MessageSquare },
    { href: "/admin/initialize", label: "Initialize", icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gray-800 border-gray-700 text-purple-400"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="bg-gray-900/80 backdrop-blur-sm absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />
        <nav className="relative w-64 max-w-xs h-full bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-purple-400">Admin Panel</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === item.href
                      ? "bg-gray-700 text-purple-400"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <nav className="bg-gray-800 border-r border-gray-700 flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-purple-400">Admin Panel</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === item.href
                      ? "bg-gray-700 text-purple-400"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
