import { NextResponse } from "next/server"

export const SESSION_COOKIE_NAME = "kinghouse_admin_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

// Production-ready Admin credentials with environment variable support
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "info@kinghousemanagement.com",
  password: process.env.ADMIN_PASSWORD || "KingHouse2026!Admin",
  name: process.env.ADMIN_NAME || "KingHouse Principal Admin",
  role: "admin" as const,
}

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.AUTH_SECRET_KEY ||
  "kinghouse-hospitality-production-secret-key-2026-secure-jwt-hmac-token"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin"
  createdAt?: number
}

export interface SessionPayload {
  user: AdminUser
  exp: number
  iat: number
}

// Convert string to Uint8Array for Web Crypto
function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    enc.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function base64UrlEncode(str: string): string {
  const base64 = btoa(str)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  return atob(base64)
}

/**
 * Constant time string comparison to prevent timing attacks
 */
function constantTimeStringCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Sign an admin session payload into a tamper-proof HMAC-SHA256 token
 */
export async function signAdminSessionToken(user: AdminUser): Promise<string> {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" })
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    user,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  }

  const encodedHeader = base64UrlEncode(header)
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const dataToSign = `${encodedHeader}.${encodedPayload}`

  const key = await getCryptoKey()
  const enc = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign))

  // Convert buffer to binary string then base64url
  const signatureBytes = new Uint8Array(signatureBuffer)
  let binaryStr = ""
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binaryStr += String.fromCharCode(signatureBytes[i])
  }
  const encodedSignature = base64UrlEncode(binaryStr)

  return `${dataToSign}.${encodedSignature}`
}

/**
 * Verify HMAC-SHA256 session token and check expiration
 */
export async function verifyAdminSessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null

  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const dataToVerify = `${encodedHeader}.${encodedPayload}`

  try {
    const key = await getCryptoKey()
    const enc = new TextEncoder()

    // Decode signature
    const signatureBinary = base64UrlDecode(encodedSignature)
    const signatureBytes = new Uint8Array(signatureBinary.length)
    for (let i = 0; i < signatureBinary.length; i++) {
      signatureBytes[i] = signatureBinary.charCodeAt(i)
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      enc.encode(dataToVerify)
    )

    if (!isValid) return null

    const payloadJson = base64UrlDecode(encodedPayload)
    const payload: SessionPayload = JSON.parse(payloadJson)

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Verify email & password against configured Admin credentials using timing-safe comparison
 */
export function verifyAdminCredentials(email: string, password: string): AdminUser | null {
  const normalizedInputEmail = email.trim().toLowerCase()
  const expectedEmail = ADMIN_CREDENTIALS.email.toLowerCase()

  const isEmailMatch = constantTimeStringCompare(normalizedInputEmail, expectedEmail)
  const isPasswordMatch = constantTimeStringCompare(password, ADMIN_CREDENTIALS.password)

  if (isEmailMatch && isPasswordMatch) {
    return {
      id: "admin-kinghouse-01",
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    }
  }

  return null
}

/**
 * Apply session cookie to an outgoing NextResponse
 */
export async function setAdminSessionCookie(response: NextResponse, user: AdminUser): Promise<NextResponse> {
  const token = await signAdminSessionToken(user)
  const isProduction = process.env.NODE_ENV === "production"

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })

  return response
}

/**
 * Clear session cookie on logout
 */
export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
