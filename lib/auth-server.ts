import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifyAdminSessionToken, AdminUser, constantTimeStringCompare } from "@/lib/auth"

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

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

/**
 * CSRF guard for cookie-authenticated writes. Browsers always send `Origin` on
 * cross-site POST/PUT/DELETE, so a request whose Origin is not this site's host
 * is a forged one. Requests without Origin (server-to-server, curl with a
 * Bearer token) are not browser-driven and are allowed through.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return true
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    const originHost = new URL(origin).host
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host
    return originHost === host
  } catch {
    return false
  }
}

/**
 * Route handler helper to verify admin session from Request cookies or Authorization Bearer header
 */
export async function verifyAdminRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    // 1. Check HttpOnly session cookie (browser): writes must come from this site.
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (sessionCookie && isSameOriginRequest(request)) {
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

/**
 * True when the request carries `Authorization: Bearer <CRON_SECRET>` (Vercel
 * Cron). Fails closed: without a CRON_SECRET of at least 16 characters nothing
 * is accepted as the cron.
 */
export function isCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) return false
  const header = request.headers.get("authorization") || ""
  return constantTimeStringCompare(header, `Bearer ${secret}`)
}
