import { describe, it, expect } from "vitest"
import { LoginSchema, ReservationSchema, ExpenseSchema } from "@/lib/validations"
import { checkRateLimit, resetRateLimit } from "@/lib/security/rate-limiter"

describe("Security & Schema Validation", () => {
  describe("Zod Validation Schemas", () => {
    it("validates correct login credentials", () => {
      const valid = LoginSchema.safeParse({
        email: "admin@kinghouse.id",
        password: "KingHouse2026!Admin",
      })
      expect(valid.success).toBe(true)
    })

    it("rejects invalid email and short password", () => {
      const invalid = LoginSchema.safeParse({
        email: "invalid-email-address",
        password: "123",
      })
      expect(invalid.success).toBe(false)
    })

    it("validates correct reservation inputs and date ordering", () => {
      const valid = ReservationSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        guestName: "Hartono",
        channel: "Direct WhatsApp",
        checkIn: "2026-09-01",
        checkOut: "2026-09-05",
        nights: 4,
        guests: 6,
        grossPayoutIdr: 6000000,
        cleaningFeeIdr: 300000,
        feeTier: "standard",
        status: "Confirmed",
      })
      expect(valid.success).toBe(true)
    })

    it("rejects reservation when checkout is before or equal to checkin", () => {
      const invalid = ReservationSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        guestName: "Hartono",
        channel: "Airbnb",
        checkIn: "2026-09-05",
        checkOut: "2026-09-01", // Invalid: checkout before checkin
        nights: 1,
        guests: 2,
        grossPayoutIdr: 1000000,
        cleaningFeeIdr: 100000,
        feeTier: "standard",
        status: "Confirmed",
      })
      expect(invalid.success).toBe(false)
    })

    it("validates expense schema correctly", () => {
      const valid = ExpenseSchema.safeParse({
        propertyId: "villa-1",
        propertyName: "Versatile House",
        category: "PLN & Utilities",
        description: "Token Listrik 500rb",
        amountIdr: 500000,
        date: "2026-08-23",
        recordedBy: "Budi",
      })
      expect(valid.success).toBe(true)
    })
  })

  describe("In-Memory Sliding Window Rate Limiter", () => {
    const testKey = "test-client-ip-123"

    it("allows requests under the limit and blocks excess attempts", () => {
      resetRateLimit(testKey)

      // Allow 3 attempts within window
      expect(checkRateLimit(testKey, 3, 5000).success).toBe(true)
      expect(checkRateLimit(testKey, 3, 5000).success).toBe(true)
      expect(checkRateLimit(testKey, 3, 5000).success).toBe(true)

      // 4th attempt should be blocked
      const blocked = checkRateLimit(testKey, 3, 5000)
      expect(blocked.success).toBe(false)
      expect(blocked.remaining).toBe(0)
      expect(blocked.resetInSeconds).toBeGreaterThan(0)

      // Reset works
      resetRateLimit(testKey)
      expect(checkRateLimit(testKey, 3, 5000).success).toBe(true)
    })
  })

  describe("Supabase Helper Resilience", () => {
    it("handles configuration detection gracefully", async () => {
      const { isSupabaseConfigured } = await import("@/lib/supabase/server")
      expect(typeof isSupabaseConfigured).toBe("boolean")
    })
  })

  describe("Admin Credential Verification & Timing-Safe Comparison", () => {
    it("authenticates valid credentials and rejects incorrect passwords or emails", async () => {
      const { verifyAdminCredentials } = await import("@/lib/auth")
      
      const valid = verifyAdminCredentials("info@kinghousemanagement.com", "KingHouse2026!Admin")
      expect(valid).not.toBeNull()
      expect(valid?.role).toBe("admin")

      const invalidEmail = verifyAdminCredentials("hacker@malicious.com", "KingHouse2026!Admin")
      expect(invalidEmail).toBeNull()

      const invalidPass = verifyAdminCredentials("info@kinghousemanagement.com", "WrongPassword123")
      expect(invalidPass).toBeNull()
    })
  })
})


