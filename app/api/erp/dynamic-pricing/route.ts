import { NextRequest, NextResponse } from "next/server"
import { generateDynamicPricing } from "@/lib/pricing/engine"
import { PricingStrategy } from "@/lib/pricing/types"
import {
  setPriceOverride,
  removePriceOverride,
  setPropertyRuleOverrides,
} from "@/lib/pricing/store"
import { getReservationsStore } from "@/lib/erp/store"
import { syncAllConfiguredProperties } from "@/lib/ical/sync"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertySlug = searchParams.get("propertySlug") || "versatile-house-jagakarsa"
    const strategy = (searchParams.get("strategy") || "balanced") as PricingStrategy
    const horizon = parseInt(searchParams.get("horizon") || "60", 10)
    const forceSync = searchParams.get("sync") === "true"

    // If reservations store is empty, proactively trigger actual Airbnb iCal sync
    const currentStore = getReservationsStore()
    if (currentStore.length === 0 || forceSync) {
      try {
        await syncAllConfiguredProperties()
      } catch (err) {
        console.warn("iCal sync notice during dynamic pricing:", err)
      }
    }

    const pricingData = await generateDynamicPricing(propertySlug, strategy, horizon)

    return NextResponse.json({
      success: true,
      data: pricingData,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate dynamic pricing"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, propertySlug, date, overridePriceIdr, reason, rules } = body

    if (!propertySlug) {
      return NextResponse.json({ success: false, error: "propertySlug is required" }, { status: 400 })
    }

    if (action === "override") {
      if (!date || typeof overridePriceIdr !== "number" || overridePriceIdr <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid date (YYYY-MM-DD) and positive overridePriceIdr required" },
          { status: 400 }
        )
      }

      setPriceOverride({
        propertySlug,
        date,
        overridePriceIdr: Math.round(overridePriceIdr),
        reason: reason || "Manual CMS Override",
        updatedAt: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: `Berhasil menetapkan override tarif Rp ${overridePriceIdr.toLocaleString("id-ID")} untuk tanggal ${date}`,
      })
    }

    if (action === "update-rules") {
      if (!rules || typeof rules !== "object") {
        return NextResponse.json({ success: false, error: "Invalid rules payload" }, { status: 400 })
      }

      setPropertyRuleOverrides(propertySlug, rules)

      return NextResponse.json({
        success: true,
        message: `Konfigurasi strategi tarif untuk ${propertySlug} berhasil diperbarui`,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action specified" }, { status: 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save pricing configuration"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertySlug, date } = body

    if (!propertySlug || !date) {
      return NextResponse.json(
        { success: false, error: "Both propertySlug and date are required" },
        { status: 400 }
      )
    }

    const removed = removePriceOverride(propertySlug, date)

    return NextResponse.json({
      success: true,
      removed,
      message: removed
        ? `Override tarif untuk tanggal ${date} berhasil dihapus. Kembali ke kalkulasi pintar.`
        : "Tidak ditemukan override untuk tanggal tersebut.",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete pricing override"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
