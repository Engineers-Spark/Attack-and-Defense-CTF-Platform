import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the route is dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Get the team cookie
    const team = request.cookies.get("team")?.value

    if (!team) {
      // Redirect to login if no team cookie is found
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Check if the route is admin but NOT admin/login
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    // Get the admin cookie
    const admin = request.cookies.get("admin")?.value

    if (!admin) {
      // Redirect to admin login if no admin cookie is found
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

// Specify the paths that should invoke the middleware
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
