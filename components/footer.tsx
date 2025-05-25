import { Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Created by</span>
            <Link
              href="https://github.com/Alter-M0X"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="font-medium">Alter-N0X</span>
            </Link>
          </div>
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Attack And Defense CTF Platform</p>
        </div>
      </div>
    </footer>
  )
}
