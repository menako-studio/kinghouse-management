import { NextRequest, NextResponse } from "next/server"
import { syncPropertyIcal, syncAllConfiguredProperties } from "@/lib/ical/sync"
import { CURATED_VILLAS } from "@/lib/data"
import { ChannelType } from "@/lib/erp/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { propertySlug, icalUrl, channel, action } = body

    // Batch sync all configured properties (from Vercel Cron or CMS Sync All button)
    if (action === "sync-all" || (!propertySlug && !icalUrl)) {
      const batchResult = await syncAllConfiguredProperties()
      return NextResponse.json({
        success: true,
        message: `Sinkronisasi selesai. Total ${batchResult.totalImported} jadwal berhasil diperbarui.`,
        totalImported: batchResult.totalImported,
        details: batchResult.results,
      })
    }

    if (!propertySlug || !icalUrl) {
      return NextResponse.json(
        { error: "Property slug and icalUrl are required." },
        { status: 400 }
      )
    }

    const syncResult = await syncPropertyIcal(
      propertySlug,
      icalUrl,
      (channel as ChannelType) || "Airbnb"
    )

    if (!syncResult.success) {
      return NextResponse.json(
        { error: syncResult.error || "Gagal sinkronisasi feed iCal." },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${syncResult.importedCount} reservasi dari kalender eksternal.`,
      importedCount: syncResult.importedCount,
      reservations: syncResult.reservations,
    })
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses sinkronisasi kalender OTA." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  // Allow GET /api/erp/ical-sync?action=sync-all for Vercel Cron
  if (action === "sync-all") {
    const batchResult = await syncAllConfiguredProperties()
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalImported: batchResult.totalImported,
      details: batchResult.results,
    })
  }

  return NextResponse.json({
    status: "online",
    activeFeeds: CURATED_VILLAS.map((v) => ({
      propertySlug: v.slug,
      propertyName: v.name,
      outboundIcalUrl: `/api/ical/${v.slug}`,
      airbnbListingId: v.airbnbUrl.split("/rooms/")[1] || null,
      hasAirbnbIcalConfigured: !!v.airbnbIcalUrl,
      hasAgodaIcalConfigured: !!v.agodaIcalUrl,
    })),
  })
}
