import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifyAdminSessionToken, AdminUser } from "@/lib/auth"

/**
 * Server-side helper to retrieve and verify current session in Server Components / Route Handlers
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) return null

    const payload = await verifyAdminSessionToken(sessionCookie.value)
    return payload?.user || null
  } catch {
    return null
  }
}

/**
 * Route handler helper to verify admin session from Request cookies or Authorization Bearer header
 */
export async function verifyAdminRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    // 1. Check HttpOnly session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (sessionCookie) {
      const payload = await verifyAdminSessionToken(sessionCookie)
      if (payload?.user?.role === "admin") return payload.user
    }

    // 2. Check Authorization Bearer header
    const authHeader = request.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim()
      const payload = await verifyAdminSessionToken(token)
      if (payload?.user?.role === "admin") return payload.user
    }

    return null
  } catch {
    return null
  }
}

