import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isLoginRoute = pathname === "/login"

  let isAuthenticated = false
  if (sessionCookie) {
    const payload = await verifyAdminSessionToken(sessionCookie)
    if (payload?.user?.role === "admin") {
      isAuthenticated = true
    }
  }

  // Helper to add security headers to any outgoing response
  const applySecurityHeaders = (response: NextResponse) => {
    response.headers.set("X-DNS-Prefetch-Control", "on")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("X-Frame-Options", "SAMEORIGIN")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), browsing-topics=()"
    )

    // Strictly protect administrative routes from search engine indexing
    if (isDashboardRoute || isLoginRoute) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet")
    }

    return response
  }

  // 1. Protect /dashboard routes: unauthenticated users redirected to /login
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    const callbackUrl = `${pathname}${search}`
    loginUrl.searchParams.set("callbackUrl", callbackUrl)
    return applySecurityHeaders(NextResponse.redirect(loginUrl))
  }

  // 2. Redirect authenticated users away from /login to /dashboard
  if (isLoginRoute && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url)
    return applySecurityHeaders(NextResponse.redirect(dashboardUrl))
  }

  const response = NextResponse.next()
  return applySecurityHeaders(response)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
}
