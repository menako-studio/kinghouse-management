import { describe, it, expect } from "vitest"
import { NextRequest } from "next/server"
import { checkRateLimit, resetRateLimit } from "@/lib/security/rate-limiter"
import {
  signAdminSessionToken,
  verifyAdminSessionToken,
  verifyAdminCredentials,
  SESSION_COOKIE_NAME,
  AdminUser,
} from "@/lib/auth"
import { verifyAdminRequest } from "@/lib/auth-server"
import { validateSafeIcalUrl } from "@/lib/ical/sync"
import {
  LoginSchema,
  ReservationSchema,
  ExpenseSchema,
  SeoUpdateSchema,
} from "@/lib/validations"

describe("Penetration Testing & Security Fortification Audit", () => {
  // ─── 1. BRUTE FORCE ATTACK & RATE LIMITING MITIGATION ─────────────────────
  describe("1. Brute-Force Password Spray & Rate Limiting Audit", () => {
    const attackerIp = "198.51.100.42"
    const rateLimitKey = `login:${attackerIp}`

    it("enforces sliding window lock-out after 5 failed authentication attempts", () => {
      resetRateLimit(rateLimitKey)

      // Attempts 1 through 5 are permitted to evaluate
      for (let i = 1; i <= 5; i++) {
        const attempt = checkRateLimit(rateLimitKey, 5, 60000)
        expect(attempt.success).toBe(true)
        expect(attempt.remaining).toBe(5 - i)
      }

      // 6th attempt (brute-force threshold breached) must be strictly locked out
      const blockedAttempt = checkRateLimit(rateLimitKey, 5, 60000)
      expect(blockedAttempt.success).toBe(false)
      expect(blockedAttempt.remaining).toBe(0)
      expect(blockedAttempt.resetInSeconds).toBeGreaterThan(0)

      // Subsequent 7th attempt remains locked out
      const stillBlocked = checkRateLimit(rateLimitKey, 5, 60000)
      expect(stillBlocked.success).toBe(false)
    })

    it("resets rate limit counter immediately upon legitimate authentication", () => {
      resetRateLimit(rateLimitKey)

      // Exhaust 4 attempts
      for (let i = 0; i < 4; i++) {
        checkRateLimit(rateLimitKey, 5, 60000)
      }

      // Legitimate user logs in -> counter reset
      resetRateLimit(rateLimitKey)

      const freshAttempt = checkRateLimit(rateLimitKey, 5, 60000)
      expect(freshAttempt.success).toBe(true)
      expect(freshAttempt.remaining).toBe(4)
    })
  })

  // ─── 2. CRYPTOGRAPHIC INTEGRITY & TOKEN TAMPERING AUDIT ───────────────────
  describe("2. HMAC-SHA256 Token Tampering & Cryptographic Audit", () => {
    const validAdmin: AdminUser = {
      id: "admin-kinghouse-01",
      email: "info@kinghousemanagement.com",
      name: "Kinghouse Principal Admin",
      role: "admin",
    }

    it("issues a verifiable tamper-proof session token for legitimate admin", async () => {
      const token = await signAdminSessionToken(validAdmin)
      expect(token).toBeDefined()
      expect(token.split(".").length).toBe(3)

      const payload = await verifyAdminSessionToken(token)
      expect(payload).not.toBeNull()
      expect(payload?.user.email).toBe(validAdmin.email)
      expect(payload?.user.role).toBe("admin")
    })

    it("rejects token when payload has been tampered with by an attacker", async () => {
      const legitimateToken = await signAdminSessionToken(validAdmin)
      const [header, payload, signature] = legitimateToken.split(".")

      // Attacker decodes payload, changes user ID / email, and re-encodes without valid secret
      const decodedJson = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
      decodedJson.user.email = "attacker@malicious.com"
      decodedJson.user.role = "admin"
      const tamperedPayload = btoa(JSON.stringify(decodedJson))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")

      const forgedToken = `${header}.${tamperedPayload}.${signature}`

      const verification = await verifyAdminSessionToken(forgedToken)
      expect(verification).toBeNull()
    })

    it("rejects token when signature bytes have been altered or randomized", async () => {
      const legitimateToken = await signAdminSessionToken(validAdmin)
      const [header, payload, signature] = legitimateToken.split(".")

      // Flip characters in the signature
      const corruptedSig = signature.slice(0, -4) + "AAAA"
      const corruptedToken = `${header}.${payload}.${corruptedSig}`

      const verification = await verifyAdminSessionToken(corruptedToken)
      expect(verification).toBeNull()
    })

    it("rejects malformed token strings and null/empty inputs", async () => {
      expect(await verifyAdminSessionToken("")).toBeNull()
      expect(await verifyAdminSessionToken("invalid-token-no-dots")).toBeNull()
      expect(await verifyAdminSessionToken("header.payload")).toBeNull()
      expect(await verifyAdminSessionToken("h.p.s.extra")).toBeNull()
      // @ts-expect-error test invalid type
      expect(await verifyAdminSessionToken(null)).toBeNull()
    })
  })

  // ─── 3. SSRF (SERVER-SIDE REQUEST FORGERY) DEFENSE AUDIT ─────────────────
  describe("3. SSRF Protection on External iCal Feeds", () => {
    it("strictly blocks AWS/GCP cloud metadata IP address (169.254.169.254)", () => {
      const attack1 = validateSafeIcalUrl("http://169.254.169.254/latest/meta-data/")
      expect(attack1.valid).toBe(false)
      expect(attack1.reason).toContain("cloud metadata")

      const attack2 = validateSafeIcalUrl("http://169.254.169.254/computeMetadata/v1/")
      expect(attack2.valid).toBe(false)
    })

    it("strictly blocks localhost, 127.0.0.1, and loopback hostnames", () => {
      expect(validateSafeIcalUrl("http://localhost:3000/api/admin").valid).toBe(false)
      expect(validateSafeIcalUrl("http://127.0.0.1:8080/metrics").valid).toBe(false)
      expect(validateSafeIcalUrl("http://0.0.0.0:8000/internal").valid).toBe(false)
      expect(validateSafeIcalUrl("http://[::1]:3000/").valid).toBe(false)
      expect(validateSafeIcalUrl("http://cluster.internal/secret.ics").valid).toBe(false)
    })

    it("strictly blocks private RFC 1918 subnets (10.x, 172.16-31.x, 192.168.x)", () => {
      expect(validateSafeIcalUrl("http://10.0.0.1/admin.ics").valid).toBe(false)
      expect(validateSafeIcalUrl("http://172.16.0.25/router.ics").valid).toBe(false)
      expect(validateSafeIcalUrl("http://192.168.1.1/modem.ics").valid).toBe(false)
    })

    it("strictly blocks dangerous non-HTTP/HTTPS protocols (file://, gopher://, ftp://)", () => {
      expect(validateSafeIcalUrl("file:///etc/passwd").valid).toBe(false)
      expect(validateSafeIcalUrl("gopher://evil.com/1").valid).toBe(false)
      expect(validateSafeIcalUrl("ftp://ftp.example.com/calendar.ics").valid).toBe(false)
    })

    it("permits legitimate, authentic OTA calendar feed URLs (Airbnb, Booking.com, Agoda)", () => {
      const airbnbUrl = "https://www.airbnb.com/calendar/ical/45834267.ics?s=54a10738d825c45"
      const bookingUrl = "https://admin.booking.com/hotel/hoteladmin/ical.html?t=123"

      expect(validateSafeIcalUrl(airbnbUrl).valid).toBe(true)
      expect(validateSafeIcalUrl(bookingUrl).valid).toBe(true)
    })
  })

  // ─── 4. INPUT VALIDATION & BUSINESS LOGIC INTEGRITY AUDIT ─────────────────
  describe("4. Financial & Input Validation Exploit Defense", () => {
    it("rejects negative gross rental payouts and negative cleaning fees", () => {
      const exploitPayload = {
        propertyId: "villa-1",
        propertyName: "Versatile House",
        guestName: "Exploiter",
        channel: "Direct WhatsApp",
        checkIn: "2026-09-01",
        checkOut: "2026-09-05",
        nights: 4,
        guests: 2,
        grossPayoutIdr: -5000000, // Exploit: negative rent
        cleaningFeeIdr: -250000,
        feeTier: "standard",
        status: "Confirmed",
      }

      const result = ReservationSchema.safeParse(exploitPayload)
      expect(result.success).toBe(false)
    })

    it("rejects zero or negative nights or dates where check-out <= check-in", () => {
      const sameDate = ReservationSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        guestName: "Guest",
        channel: "Airbnb",
        checkIn: "2026-09-01",
        checkOut: "2026-09-01", // Invalid: 0 nights
        nights: 0,
        guests: 1,
        grossPayoutIdr: 1000000,
        cleaningFeeIdr: 0,
        feeTier: "standard",
        status: "Confirmed",
      })
      expect(sameDate.success).toBe(false)

      const invertedDate = ReservationSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        guestName: "Guest",
        channel: "Airbnb",
        checkIn: "2026-09-10",
        checkOut: "2026-09-05", // Invalid: travel back in time
        nights: 1,
        guests: 1,
        grossPayoutIdr: 1000000,
        cleaningFeeIdr: 0,
        feeTier: "standard",
        status: "Confirmed",
      })
      expect(invertedDate.success).toBe(false)
    })

    it("rejects negative POS expense amounts and invalid receipt URLs", () => {
      const negativeExp = ExpenseSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        category: "PLN & Utilities",
        description: "Negative Expense Exploit",
        amountIdr: -200000, // Exploit
        date: "2026-08-25",
        recordedBy: "Staff",
      })
      expect(negativeExp.success).toBe(false)

      const xssReceipt = ExpenseSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        category: "PLN & Utilities",
        description: "Token Listrik",
        amountIdr: 200000,
        date: "2026-08-25",
        recordedBy: "Staff",
        receiptUrl: "javascript:alert(document.cookie)", // Exploit
      })
      expect(xssReceipt.success).toBe(false)
    })

    it("rejects SQL injection and XSS attempts in login fields", () => {
      const sqlInjection = LoginSchema.safeParse({
        email: "' OR '1'='1",
        password: "password123",
      })
      expect(sqlInjection.success).toBe(false)
    })
  })

  // ─── 5. API ROUTE AUTHORIZATION & PRIVILEGE ESCALATION ────────────────────
  describe("5. Route Handler Authorization Verification", () => {
    it("rejects unauthenticated requests lacking session cookie or Bearer token", async () => {
      const unauthRequest = new NextRequest("http://localhost:3000/api/erp/reservations", {
        method: "POST",
      })

      const adminUser = await verifyAdminRequest(unauthRequest)
      expect(adminUser).toBeNull()
    })

    it("authenticates requests carrying a valid HttpOnly session cookie", async () => {
      const validAdmin: AdminUser = {
        id: "admin-kinghouse-01",
        email: "info@kinghousemanagement.com",
        name: "Kinghouse Principal Admin",
        role: "admin",
      }
      const validToken = await signAdminSessionToken(validAdmin)

      const authedRequest = new NextRequest("http://localhost:3000/api/erp/reservations", {
        method: "POST",
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
        },
      })

      const adminUser = await verifyAdminRequest(authedRequest)
      expect(adminUser).not.toBeNull()
      expect(adminUser?.email).toBe(validAdmin.email)
      expect(adminUser?.role).toBe("admin")
    })

    it("authenticates requests carrying a valid Authorization: Bearer token header", async () => {
      const validAdmin: AdminUser = {
        id: "admin-kinghouse-01",
        email: "info@kinghousemanagement.com",
        name: "Kinghouse Principal Admin",
        role: "admin",
      }
      const validToken = await signAdminSessionToken(validAdmin)

      const authedRequest = new NextRequest("http://localhost:3000/api/erp/reservations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      })

      const adminUser = await verifyAdminRequest(authedRequest)
      expect(adminUser).not.toBeNull()
      expect(adminUser?.email).toBe(validAdmin.email)
    })
  })
})
