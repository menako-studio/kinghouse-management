import { NextRequest, NextResponse } from "next/server"
import { ReservationSchema } from "@/lib/validations"
import { calculateReservationPayout } from "@/lib/erp/calculations"
import { Reservation } from "@/lib/erp/types"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  getReservationsStore,
  upsertReservationsToStore,
  deleteReservationFromStore,
} from "@/lib/erp/store"
import { syncAllConfiguredProperties } from "@/lib/ical/sync"

// Map snake_case database row to TypeScript domain model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToReservation(row: any): Reservation {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertySlug: row.property_slug,
    propertyName: row.property_name,
    guestName: row.guest_name,
    guestPhone: row.guest_phone || undefined,
    guestEmail: row.guest_email || undefined,
    channel: row.channel,
    checkIn: typeof row.check_in === "string" ? row.check_in.split("T")[0] : row.check_in,
    checkOut: typeof row.check_out === "string" ? row.check_out.split("T")[0] : row.check_out,
    nights: Number(row.nights),
    guests: Number(row.guests),
    grossPayoutIdr: Number(row.gross_payout_idr),
    cleaningFeeIdr: Number(row.cleaning_fee_idr),
    feeTier: row.fee_tier,
    managementFeePercent: Number(row.management_fee_percent),
    managementFeeIdr: Number(row.management_fee_idr),
    netOwnerPayoutIdr: Number(row.net_owner_payout_idr),
    status: row.status,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get("propertyId")
  const channel = searchParams.get("channel")
  const forceSync = searchParams.get("sync") === "true"

  const supabase = getSupabaseServerClient()

  if (supabase) {
    try {
      let query = supabase.from("reservations").select("*").order("check_in", { ascending: false })

      if (propertyId) {
        query = query.or(`property_id.eq.${propertyId},property_slug.eq.${propertyId}`)
      }
      if (channel) {
        query = query.ilike("channel", channel)
      }

      const { data, error } = await query

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRowToReservation)
        upsertReservationsToStore(mapped)
        return NextResponse.json({
          success: true,
          source: "supabase",
          total: mapped.length,
          reservations: mapped,
        })
      }
    } catch (err) {
      console.warn("Supabase query error, falling back to local store:", err)
    }
  }

  // If local store is empty or forced sync requested, automatically pull actual Airbnb iCal feeds
  let storeReservations = getReservationsStore()
  if (storeReservations.length === 0 || forceSync) {
    try {
      await syncAllConfiguredProperties()
      storeReservations = getReservationsStore()
    } catch (err) {
      console.warn("Auto iCal sync error:", err)
    }
  }

  let filtered = [...storeReservations]
  if (propertyId) {
    filtered = filtered.filter((r) => r.propertyId === propertyId || r.propertySlug === propertyId)
  }
  if (channel) {
    filtered = filtered.filter((r) => r.channel.toLowerCase() === channel.toLowerCase())
  }

  return NextResponse.json({
    success: true,
    source: "actual-sync",
    total: filtered.length,
    reservations: filtered,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const parseResult = ReservationSchema.safeParse(body)

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Data reservasi tidak valid."
      return NextResponse.json({ error: firstError, issues: parseResult.error.issues }, { status: 400 })
    }

    const data = parseResult.data

    // Automatically compute net payout and commission breakdown
    const payoutCalculations = calculateReservationPayout(
      data.grossPayoutIdr,
      data.cleaningFeeIdr,
      data.feeTier
    )

    const newReservation: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: data.propertyId,
      propertySlug: data.propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      propertyName: data.propertyName,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestEmail: data.guestEmail,
      channel: data.channel,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights: data.nights,
      guests: data.guests,
      grossPayoutIdr: data.grossPayoutIdr,
      cleaningFeeIdr: data.cleaningFeeIdr,
      feeTier: data.feeTier,
      managementFeePercent: payoutCalculations.managementFeePercent,
      managementFeeIdr: payoutCalculations.managementFeeIdr,
      netOwnerPayoutIdr: payoutCalculations.netOwnerPayoutIdr,
      status: data.status,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    }

    const supabase = getSupabaseServerClient()

    if (supabase) {
      try {
        const { error } = await supabase.from("reservations").insert({
          id: newReservation.id,
          property_id: newReservation.propertyId,
          property_slug: newReservation.propertySlug,
          property_name: newReservation.propertyName,
          guest_name: newReservation.guestName,
          guest_phone: newReservation.guestPhone || null,
          guest_email: newReservation.guestEmail || null,
          channel: newReservation.channel,
          check_in: newReservation.checkIn,
          check_out: newReservation.checkOut,
          nights: newReservation.nights,
          guests: newReservation.guests,
          gross_payout_idr: newReservation.grossPayoutIdr,
          cleaning_fee_idr: newReservation.cleaningFeeIdr,
          fee_tier: newReservation.feeTier,
          management_fee_percent: newReservation.managementFeePercent,
          management_fee_idr: newReservation.managementFeeIdr,
          net_owner_payout_idr: newReservation.netOwnerPayoutIdr,
          status: newReservation.status,
          notes: newReservation.notes || null,
          created_at: newReservation.createdAt,
        })

        if (!error) {
          upsertReservationsToStore([newReservation])
          return NextResponse.json({
            success: true,
            source: "supabase",
            message: "Reservasi berhasil disimpan ke Supabase Database.",
            reservation: newReservation,
          }, { status: 201 })
        }
      } catch (err) {
        console.warn("Supabase insert error, falling back to local store:", err)
      }
    }

    upsertReservationsToStore([newReservation])

    return NextResponse.json({
      success: true,
      source: "actual-store",
      message: "Reservasi berhasil ditambahkan ke kalender ERP.",
      reservation: newReservation,
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses data reservasi." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID reservasi wajib diisi." }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (supabase) {
      try {
        await supabase.from("reservations").delete().eq("id", id)
      } catch (err) {
        console.warn("Supabase reservation delete error:", err)
      }
    }

    deleteReservationFromStore(id)

    return NextResponse.json({
      success: true,
      message: `Reservasi #${id} berhasil dihapus.`,
    })
  } catch {
    return NextResponse.json({ error: "Gagal menghapus reservasi." }, { status: 500 })
  }
}
