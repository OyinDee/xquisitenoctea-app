import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Handle admin routes
  if (path.startsWith('/admin')) {
    // Skip the login page
    if (path === '/admin/login') {
      return NextResponse.next()
    }

    // Check for auth token
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      console.log("No auth token found, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify token
    const { success, payload } = await verifyToken(token)

    if (!success) {
      console.log("Invalid token, redirecting to login")
      // Clear the invalid token
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.set("auth_token", "", { maxAge: 0 })
      return response
    }

    // Add user info to headers for use in admin pages
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.id)
    requestHeaders.set("x-user-role", payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For non-admin routes, continue with normal processing
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
