import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthConfigured, verifyAdminCredentials, setAdminSessionCookie } from "@/lib/auth"
import { LoginSchema } from "@/lib/validations"
import { checkRateLimit, resetRateLimit } from "@/lib/security/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthConfigured()) {
      console.error("[auth] ADMIN_PASSWORD (>=12 chars) and AUTH_SECRET (>=32 chars) must be set; admin login is disabled.")
      return NextResponse.json(
        { error: "Login admin belum dikonfigurasi di server." },
        { status: 503 }
      )
    }

    // 1. Extract client IP or fallback for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000) // Max 5 attempts per 60s

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${rateLimit.resetInSeconds} detik.`,
          retryAfter: rateLimit.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetInSeconds.toString(),
          },
        }
      )
    }

    // 2. Validate input schema with Zod
    const body = await request.json().catch(() => ({}))
    const parseResult = LoginSchema.safeParse(body)

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Data login tidak valid."
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { email, password } = parseResult.data

    // 3. Verify credentials
    const adminUser = verifyAdminCredentials(email, password)

    if (!adminUser) {
      return NextResponse.json(
        {
          error: `Email atau password salah. Sisa percobaan: ${rateLimit.remaining}`,
          remainingAttempts: rateLimit.remaining,
        },
        { status: 401 }
      )
    }

    // 4. Reset rate limit counter on successful login
    resetRateLimit(`login:${ip}`)

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
      message: "Autentikasi admin berhasil.",
    })

    await setAdminSessionCookie(response, adminUser)
    return response
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada sistem autentikasi." },
      { status: 500 }
    )
  }
}
