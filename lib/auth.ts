import { NextResponse } from "next/server"

export const SESSION_COOKIE_NAME = "kinghouse_admin_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Admin credentials and the session-signing key come ONLY from environment
 * variables (Vercel → Settings → Environment Variables, or .env.local in
 * development). There are no fallback values: when a variable is missing or too
 * weak, login is refused and no session token can be signed or accepted, so a
 * misconfigured deploy fails closed instead of running on a published default.
 *
 *   ADMIN_PASSWORD  ≥ 12 characters
 *   AUTH_SECRET     ≥ 32 characters (generate: openssl rand -base64 48)
 *   ADMIN_EMAIL     optional, defaults to the public info@ mailbox
 *   ADMIN_NAME      optional display name
 */
const MIN_PASSWORD_LENGTH = 12
const MIN_SECRET_LENGTH = 32

function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET || process.env.AUTH_SECRET_KEY
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null
}

function getAdminCredentials() {
  const password = process.env.ADMIN_PASSWORD
  if (!password || password.length < MIN_PASSWORD_LENGTH) return null
  return {
    email: process.env.ADMIN_EMAIL || "info@kinghousemanagement.com",
    password,
    name: process.env.ADMIN_NAME || "Kinghouse Admin",
    role: "admin" as const,
  }
}

/** True when both ADMIN_PASSWORD and AUTH_SECRET are set and long enough. */
export function isAdminAuthConfigured(): boolean {
  return getAdminCredentials() !== null && getAuthSecret() !== null
}

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
  const secret = getAuthSecret()
  if (!secret) return Promise.reject(new Error("AUTH_SECRET is not configured"))
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
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
export function constantTimeStringCompare(a: string, b: string): boolean {
  // Walk the longer string and fold the length difference in, so neither the
  // content nor the length of the expected value leaks through timing.
  const length = Math.max(a.length, b.length)
  let result = a.length ^ b.length
  for (let i = 0; i < length; i++) {
    result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
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
  const credentials = getAdminCredentials()
  // Not configured (or no signing key): nobody can log in.
  if (!credentials || !getAuthSecret()) return null

  const isEmailMatch = constantTimeStringCompare(email.trim().toLowerCase(), credentials.email.toLowerCase())
  const isPasswordMatch = constantTimeStringCompare(password, credentials.password)

  if (isEmailMatch && isPasswordMatch) {
    return {
      id: "admin-kinghouse-01",
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
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
