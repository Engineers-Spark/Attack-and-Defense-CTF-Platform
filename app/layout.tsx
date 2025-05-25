import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "A & D CTF Platform",
  description: "Attack And Defense CTF Platform - Comprehensive CTF competition management system",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
