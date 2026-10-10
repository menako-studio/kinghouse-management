import { describe, it, expect } from "vitest"
import { CURATED_VILLAS } from "@/lib/data"
import { SUPPORTED_CURRENCIES } from "@/lib/context/localization-context"
import { GUEST_COMPENDIUMS, UPSELL_SERVICES } from "@/lib/guest-guide/data"
import { calculateUpsellOrder, generateUpsellWhatsAppUrl } from "@/lib/guest-guide/calculations"
import { SUBMARKET_BENCHMARKS } from "@/lib/pricing/engine"
import { generatePricingCsv } from "@/lib/pricing/export"
import { PricingRuleConfig, DailyPriceRecommendation } from "@/lib/pricing/types"
import {
  calculateReservationPayout,
  generateOwnerStatement,
  calculateADR,
  calculateRevPAR,
} from "@/lib/erp/calculations"
import { Reservation, ExpenseRecord } from "@/lib/erp/types"
import { ReservationSchema, ExpenseSchema } from "@/lib/validations"

describe("End-to-End User Testing Simulation: Discerning Guest Persona", () => {
  it("allows guest to filter and select luxury properties across 4 Jabodetabek submarkets", () => {
    // 1. Guest lands on catalog and searches across regions
    const submarkets = ["jagakarsa", "tangerang", "palmerah", "cikarang"]
    submarkets.forEach((area) => {
      const match = CURATED_VILLAS.find((v) => v.areaSlug === area)
      expect(match).toBeDefined()
      expect(match?.price.idr).toBeGreaterThan(0)
    })

    // 2. Large family / gathering search: needs capacity for 10+ guests
    const largeGatheringVilla = CURATED_VILLAS.find((v) => {
      return v.stayConfigurations?.some((config) => config.maxGuests >= 10)
    })
    expect(largeGatheringVilla).toBeDefined()
    expect(largeGatheringVilla?.slug).toBe("versatile-house-jagakarsa")
    
    // Validate maximum configuration accommodates up to 12 guests (6 bedrooms)
    const maxConfig = largeGatheringVilla?.stayConfigurations?.find((c) => c.bedrooms === 6)
    expect(maxConfig?.maxGuests).toBe(12)
    expect(maxConfig?.weekdayPriceIdr).toBe(4700000)
  })

  it("proves direct booking financial benefit (0% commission markup vs OTA 14% fee)", () => {
    const property = CURATED_VILLAS.find((v) => v.slug === "versatile-house-jagakarsa")!
    const baseRateIdr = property.price.idr // Rp 1,900,000 / night
    const nights = 3

    // Direct booking pricing
    const directTotalAccommodation = baseRateIdr * nights
    const cleaningFee = property.price.cleaningFeeIdr
    const directTotal = directTotalAccommodation + cleaningFee

    // Typical OTA pricing with 14% guest service fee
    const otaServiceFee = Math.round(directTotalAccommodation * 0.14)
    const otaTotal = directTotalAccommodation + cleaningFee + otaServiceFee

    // Guest saves exact OTA markup
    const guestSavings = otaTotal - directTotal
    expect(guestSavings).toBe(otaServiceFee)
    expect(guestSavings).toBeGreaterThan(700000) // Savings > Rp 700k
    expect(directTotal).toBeLessThan(otaTotal)
  })

  it("handles multi-currency conversion seamlessly for international guests (USD, EUR, SGD, AUD, JPY)", () => {
    const baseIdr = 1900000
    const currencyCodes = ["USD", "EUR", "SGD", "AUD", "JPY"]

    currencyCodes.forEach((code) => {
      const curr = SUPPORTED_CURRENCIES.find((c) => c.code === code)
      expect(curr).toBeDefined()
      const converted = Math.round(baseIdr * curr!.rateFromIdr)
      expect(converted).toBeGreaterThan(0)
      
      // Reasonable bounds sanity checks
      if (code === "USD") {
        expect(converted).toBeGreaterThan(80)
        expect(converted).toBeLessThan(200)
      }
      if (code === "SGD") {
        expect(converted).toBeGreaterThan(120)
        expect(converted).toBeLessThan(250)
      }
      if (code === "JPY") {
        expect(converted).toBeGreaterThan(15000)
        expect(converted).toBeLessThan(35000)
      }
    })
  })

  it("provides digital compendium access: instant WiFi copy, strict house rules, and upsell concierge flow", () => {
    const skyHouse = GUEST_COMPENDIUMS["sky-house-tangerang"]
    expect(skyHouse).toBeDefined()

    // 1. One-click WiFi retrieval
    expect(skyHouse.wifi.networkName).toBe("KINGSKYHOUSE22")
    expect(skyHouse.wifi.password).toBe("120210120069#")

    // 2. Clear house rules for high-value asset protection
    expect(skyHouse.houseRules.some((r) => r.includes("NO SMOKING"))).toBe(true)
    expect(skyHouse.houseRules.some((r) => r.includes("NOISE POLLUTION"))).toBe(true)

    // 3. Concierge upsell: booking late checkout + luggage storage
    const upsellRequest = [
      { serviceId: "late-checkout-2pm", quantity: 1 },
      { serviceId: "extra-bed-hotel", quantity: 1 },
    ]
    const order = calculateUpsellOrder(upsellRequest)
    expect(order.totalAmountIdr).toBe(300000)

    const waLink = generateUpsellWhatsAppUrl(
      "6282123933218",
      "Sky House Tangerang",
      "Mr. Jonathan",
      order,
      "Please prepare for 14:00 checkout."
    )
    expect(waLink).toContain("https://wa.me/6282123933218")
    expect(waLink).toContain(encodeURIComponent("Sky House Tangerang"))
  })
})

describe("End-to-End User Testing Simulation: Property Owner / Investor Persona", () => {
  it("simulates yield & revenue performance using verified Jabodetabek benchmarks", () => {
    const benchmark = SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"]
    expect(benchmark).toBeDefined()

    // Kinghouse managed occupancy exceeds unmanaged competitors
    expect(benchmark.kinghouseOccupancyPercent).toBeGreaterThan(benchmark.marketOccupancyPercent)

    // Annual revenue projection calculation
    const baseAdr = benchmark.avgCompetitorAdrIdr
    const dynamicAdr = Math.round(baseAdr * 1.18) // dynamic pricing uplift
    const annualDays = 365

    const unmanagedGross = Math.round(annualDays * (benchmark.marketOccupancyPercent / 100) * baseAdr)
    const kinghouseGross = Math.round(annualDays * (benchmark.kinghouseOccupancyPercent / 100) * dynamicAdr)

    expect(kinghouseGross).toBeGreaterThan(unmanagedGross)
    const upliftPercent = ((kinghouseGross - unmanagedGross) / unmanagedGross) * 100
    expect(upliftPercent).toBeGreaterThan(25) // At least 25% revenue uplift
  })

  it("compares 15% Standard vs 20% Premium management tiers accurately", () => {
    const grossAccommodation = 50000000 // Rp 50M monthly accommodation revenue
    const cleaningTotal = 5000000       // Rp 5M cleaning revenue passed through

    // Standard Tier (15% fee)
    const stdResult = calculateReservationPayout(grossAccommodation + cleaningTotal, cleaningTotal, "standard")
    expect(stdResult.managementFeePercent).toBe(15)
    expect(stdResult.managementFeeIdr).toBe(Math.round(grossAccommodation * 0.15))
    expect(stdResult.netOwnerPayoutIdr).toBe(grossAccommodation - Math.round(grossAccommodation * 0.15))

    // Premium Tier (20% fee)
    const premResult = calculateReservationPayout(grossAccommodation + cleaningTotal, cleaningTotal, "premium")
    expect(premResult.managementFeePercent).toBe(20)
    expect(premResult.managementFeeIdr).toBe(Math.round(grossAccommodation * 0.20))
    expect(premResult.netOwnerPayoutIdr).toBe(grossAccommodation - Math.round(grossAccommodation * 0.20))

    // Premium fee should be exactly 5% higher than Standard fee
    expect(premResult.managementFeeIdr - stdResult.managementFeeIdr).toBe(Math.round(grossAccommodation * 0.05))
  })

  it("generates an itemized monthly Owner Statement with expense deduction and key KPI metrics", () => {
    const reservations: Reservation[] = [
      {
        id: "RES-AUG-01",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House",
        guestName: "Hartono",
        channel: "Airbnb",
        checkIn: "2026-08-01",
        checkOut: "2026-08-05",
        nights: 4,
        guests: 6,
        grossPayoutIdr: 10000000,
        cleaningFeeIdr: 400000,
        feeTier: "standard",
        managementFeePercent: 15,
        managementFeeIdr: 1440000,
        netOwnerPayoutIdr: 8160000,
        status: "Completed",
        notes: "Family stay",
        createdAt: "2026-07-20T00:00:00Z",
      },
      {
        id: "RES-AUG-02",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House",
        guestName: "Amanda",
        channel: "Direct WhatsApp",
        checkIn: "2026-08-10",
        checkOut: "2026-08-16",
        nights: 6,
        guests: 8,
        grossPayoutIdr: 15000000,
        cleaningFeeIdr: 500000,
        feeTier: "standard",
        managementFeePercent: 15,
        managementFeeIdr: 2175000,
        netOwnerPayoutIdr: 12325000,
        status: "Completed",
        notes: "Direct booking",
        createdAt: "2026-08-01T00:00:00Z",
      },
    ]

    const expenses: ExpenseRecord[] = [
      {
        id: "EXP-01",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House",
        category: "Maintenance & Repairs",
        description: "AC Deep Cleaning & Freon Servicing (4 Units)",
        amountIdr: 750000,
        date: "2026-08-06",
        recordedBy: "Budi Santoso",
        vendorName: "Sejuk Jaya HVAC",
      },
      {
        id: "EXP-02",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House",
        category: "Guest Amenities",
        description: "Restock luxury amenities, bath robes & artisan soaps",
        amountIdr: 450000,
        date: "2026-08-09",
        recordedBy: "Budi Santoso",
        vendorName: "Botanical Hospitality Supplies",
      },
    ]

    const statement = generateOwnerStatement(
      "villa-1",
      "Versatile House",
      "Jagakarsa, Jakarta Selatan",
      "Bpk. Bambang",
      "Agustus 2026",
      reservations,
      expenses,
      "standard",
      31
    )

    // Validate calculations
    expect(statement.reservationsCount).toBe(2)
    expect(statement.totalNightsBooked).toBe(10)
    expect(statement.grossRevenueIdr).toBe(25000000)
    expect(statement.totalCleaningFeeIdr).toBe(900000)
    expect(statement.totalExpensesIdr).toBe(1200000)
    expect(statement.occupancyRatePercent).toBe(32.3)
    
    // Net Remittance = (Gross - Cleaning - Mgmt Fee) - Expenses
    // Accommodation = 25,000,000 - 900,000 = 24,100,000
    // Mgmt Fee = 1,440,000 + 2,175,000 = 3,615,000
    // Net Remittance = 25,000,000 - 900,000 - 3,615,000 - 1,200,000 = 19,285,000
    expect(statement.netRemittanceToOwnerIdr).toBe(19285000)

    // Verify Hospitality KPI calculations
    const adr = calculateADR(statement.grossRevenueIdr, statement.totalNightsBooked)
    expect(adr).toBe(2500000)

    const revPar = calculateRevPAR(statement.grossRevenueIdr, 31)
    expect(revPar).toBe(Math.round(25000000 / 31))
  })
})

describe("End-to-End User Testing Simulation: Hotelier & CMS Operator Persona", () => {
  it("enforces strict schema validation for manual reservation input in CMS ERP", () => {
    // Valid reservation payload
    const validPayload = {
      propertyId: "villa-1",
      propertyName: "Versatile House",
      guestName: "Dewi Lestari",
      guestEmail: "dewi.lestari@example.com",
      guestPhone: "+6281298765432",
      channel: "Direct WhatsApp" as const,
      checkIn: "2026-09-01",
      checkOut: "2026-09-04",
      nights: 3,
      guests: 4,
      grossPayoutIdr: 5700000,
      cleaningFeeIdr: 350000,
      feeTier: "standard" as const,
      status: "Confirmed" as const,
      notes: "VIP guest corporate retreat",
    }

    const parseResult = ReservationSchema.safeParse(validPayload)
    expect(parseResult.success).toBe(true)

    // Invalid payload: check-in date is after check-out date
    const invalidDates = {
      ...validPayload,
      checkIn: "2026-09-10",
      checkOut: "2026-09-05",
    }
    const invalidResult = ReservationSchema.safeParse(invalidDates)
    expect(invalidResult.success).toBe(false)
  })

  it("validates operating expense logging with security restrictions on receipt URLs", () => {
    // Valid expense entry with safe HTTPS receipt
    const validExpense = {
      propertyId: "villa-2",
      propertyName: "Sky House BSD",
      category: "PLN & Utilities" as const,
      description: "Fiber Internet 300 Mbps monthly subscription",
      amountIdr: 650000,
      date: "2026-09-01",
      recordedBy: "Budi Santoso",
      vendorName: "Biznet Networks",
      receiptUrl: "https://storage.kinghouse.co.id/receipts/inv-tel-9981.pdf",
    }
    expect(ExpenseSchema.safeParse(validExpense).success).toBe(true)

    // XSS injection attempt in receiptUrl
    const xssExpense = {
      ...validExpense,
      receiptUrl: "javascript:alert(document.cookie)",
    }
    expect(ExpenseSchema.safeParse(xssExpense).success).toBe(false)
  })

  it("runs dynamic pricing calculation and generates editorial-clean CSV without AI design slop", () => {
    const property = CURATED_VILLAS[0]
    const basePrice = property.price.idr

    const rules: PricingRuleConfig = {
      propertySlug: property.slug,
      basePriceIdr: basePrice,
      minPriceIdr: 1500000,
      maxPriceIdr: 4500000,
      weekendSurgePercent: 25,
      holidaySurgePercent: 45,
      lastMinuteDiscountPercent: 10,
      farOutPremiumPercent: 15,
      strategy: "balanced",
    }

    // Simulate 7-day recommendations
    const dates = [
      { date: "2026-08-10", day: "Senin", dayShort: "Sen", num: 10, isWeekend: false, isHoliday: false },
      { date: "2026-08-11", day: "Selasa", dayShort: "Sel", num: 11, isWeekend: false, isHoliday: false },
      { date: "2026-08-12", day: "Rabu", dayShort: "Rab", num: 12, isWeekend: false, isHoliday: false },
      { date: "2026-08-13", day: "Kamis", dayShort: "Kam", num: 13, isWeekend: false, isHoliday: false },
      { date: "2026-08-14", day: "Jumat", dayShort: "Jum", num: 14, isWeekend: true, isHoliday: false },
      { date: "2026-08-15", day: "Sabtu", dayShort: "Sab", num: 15, isWeekend: true, isHoliday: false },
      { date: "2026-08-17", day: "Senin", dayShort: "Sen", num: 17, isWeekend: false, isHoliday: true, holidayName: "Hari Kemerdekaan RI" },
    ]

    const recommendations: DailyPriceRecommendation[] = dates.map((d) => {
      let price = basePrice
      const notes = ["Tarif Dasar"]

      if (d.isWeekend) {
        price = Math.round(price * 1.25)
        notes.push("Weekend Surge")
      }
      if (d.isHoliday) {
        price = Math.round(price * 1.45)
        notes.push("Hari Libur Nasional")
      }

      return {
        date: d.date,
        dayOfWeek: d.day,
        dayOfWeekShort: d.dayShort,
        dayNumber: d.num,
        basePriceIdr: basePrice,
        recommendedPriceIdr: price,
        demandScore: d.isHoliday ? 95 : d.isWeekend ? 80 : 50,
        demandLevel: d.isHoliday ? "Peak Surge" : d.isWeekend ? "High" : "Moderate",
        isBooked: d.date === "2026-08-15", // Booked on Saturday
        bookingChannel: d.date === "2026-08-15" ? "Airbnb" : undefined,
        isHoliday: d.isHoliday,
        holidayName: d.holidayName,
        multipliers: {
          dayOfWeekFactor: d.isWeekend ? 1.25 : 1.0,
          seasonalityFactor: 1.0,
          holidayFactor: d.isHoliday ? 1.45 : 1.0,
          leadTimeFactor: 1.0,
          pacingFactor: 1.0,
          rawRecommendedPriceIdr: price,
          clampedRecommendedPriceIdr: price,
        },
        notes,
      }
    })

    // Generate CSV export for OTA integration
    const csvContent = generatePricingCsv(property.name, property.slug, rules, recommendations)

    // Strict verifications:
    // 1. Headers exist and are properly structured
    expect(csvContent).toContain("Tanggal (YYYY-MM-DD),Hari,Nama Properti,Tarif Rekomendasi (IDR)")
    
    // 2. CRITICAL: AI Translation bug check ("Terpesan" must be used, NEVER "Terpesona")
    expect(csvContent).toContain("Terpesan")
    expect(csvContent).not.toContain("Terpesona")
    
    // 3. Holiday is properly listed and quoted
    expect(csvContent).toContain('"Hari Kemerdekaan RI"')

    // 4. Booking channel is correctly attributed for booked date
    expect(csvContent).toContain("2026-08-15,Sabtu")
    expect(csvContent).toContain("Airbnb")
  })
})
