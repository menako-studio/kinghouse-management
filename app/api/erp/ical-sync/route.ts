import { NextRequest, NextResponse } from "next/server"
import { syncPropertyIcal, syncAllConfiguredProperties } from "@/lib/ical/sync"
import { CURATED_VILLAS } from "@/lib/data"
import { ChannelType } from "@/lib/erp/types"
import { verifyAdminRequest, isCronRequest } from "@/lib/auth-server"

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request)

    if (!admin && !isCronRequest(request)) {
      return NextResponse.json({ error: "Akses ditolak: Diperlukan sesi admin Kinghouse atau CRON_SECRET." }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { propertySlug, icalUrl, channel, action } = body

    // Batch sync all configured properties (from Vercel Cron or CMS Sync All button)
    if (action === "sync-all" || (!propertySlug && !icalUrl)) {
      const batchResult = await syncAllConfiguredProperties()
      return NextResponse.json({
        success: batchResult.success,
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

  // Vercel Cron calls GET ?action=sync-all with `Authorization: Bearer $CRON_SECRET`.
  // Fails closed: without CRON_SECRET only a signed-in admin can trigger a sync
  // or read the feed configuration.
  if (!isCronRequest(request) && !(await verifyAdminRequest(request))) {
    if (!process.env.CRON_SECRET) {
      console.warn("[ical-sync] CRON_SECRET is not set: the daily Vercel Cron sync is rejected until it is.")
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (action === "sync-all") {
    const batchResult = await syncAllConfiguredProperties()
    return NextResponse.json({
      success: batchResult.success,
      timestamp: batchResult.syncedAt,
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
