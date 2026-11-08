import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  Users,
  Star,
  DollarSign,
  ArrowUpRight,
  Search,
  ExternalLink,
  Layers,
  AlertTriangle,
} from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChannelBadge } from "@/components/dashboard/channel-badge"
import { formatCurrency } from "@/lib/utils"
import { loadDashboardReservations, computeDashboardMetrics } from "@/lib/erp/dashboard-data"

export const dynamic = "force-dynamic"

export default async function DashboardOverviewPage() {
  const totalReviews = CURATED_VILLAS.reduce((acc, v) => acc + v.reviewsCount, 0)
  const villasWithRating = CURATED_VILLAS.filter((v) => v.rating > 0)
  const averageRating = (
    villasWithRating.reduce((acc, v) => acc + v.rating, 0) / (villasWithRating.length || 1)
  ).toFixed(2)

  // Retrieve actual reservations (Supabase → in-memory store → live Airbnb iCal pull)
  const dashboardData = await loadDashboardReservations()
  const { reservations, sync } = dashboardData
  const metrics = computeDashboardMetrics(reservations, CURATED_VILLAS.length)

  const displayRevenue = formatCurrency(metrics.grossRevenueIdr, "IDR")

  const feedErrors = sync?.results.filter((r) => r.error) ?? []
  const feedWarnings = sync?.results.filter((r) => r.warning) ?? []
  const airbnbFeeds = sync?.results.filter((r) => r.channel === "Airbnb") ?? []
  const airbnbHealthy = sync ? airbnbFeeds.some((r) => !r.error) : reservations.some((r) => r.channel === "Airbnb")
  const directBookings = reservations.filter((r) => r.channel === "Direct WhatsApp" || r.channel === "Walk-in").length
  const syncedAtLabel = sync
    ? new Date(sync.syncedAt).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null
  const showDiagnostics =
    reservations.length === 0 || feedErrors.length > 0 || feedWarnings.length > 0 || Boolean(dashboardData.supabaseError)

  return (
    <div className="space-y-10 animate-sana-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E8E4DC]">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] text-[10px] font-semibold tracking-wider text-[#222225]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#8C7F5F] uppercase">KINGHOUSE MANAGEMENT</span>
            <span className="text-[#D5CFC3]">&bull;</span>
            <span>PORTAL BISNIS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Ringkasan Bisnis &amp; Performa Properti
          </h1>
          <p className="text-sm text-[#6B6862] max-w-2xl font-light leading-relaxed">
            Selamat datang kembali. Pantau pendapatan, tingkat keterisian villa (okupansi), dan kalender booking tamu Anda secara otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center space-x-2 bg-[#222225] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#19191B] transition-all shadow-xs cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[#DFC58E]" />
            <span>Kelola Booking &amp; Kalender</span>
          </Link>
          <a
            href="https://www.airbnb.com/users/profile/1470743715397835749"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#D5CFC3] transition-all shadow-xs"
          >
            <span>Buka Profil Airbnb Host</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#6B6862]" />
          </a>
        </div>
      </div>

      {/* KPI Stats Grid - Derived 100% Dynamically from Actual Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pendapatan Terkonfirmasi"
          value={displayRevenue}
          change={`${metrics.confirmedCount} booking`}
          trend={metrics.confirmedCount > 0 ? "up" : "neutral"}
          period="estimasi bruto (tarif × malam)"
          icon={DollarSign}
          subtitle="Dari booking yang masuk"
        />
        <StatCard
          title="Tingkat Keterisian (Okupansi)"
          value={`${metrics.occupancyPercent}%`}
          change={`${metrics.windowNightsBooked} malam terisi`}
          trend={metrics.occupancyPercent > 50 ? "up" : "neutral"}
          period={`dari ${metrics.windowAvailableNights} malam tersedia`}
          icon={TrendingUp}
          subtitle="30 hari ke depan"
        />
        <StatCard
          title="Rating Kepuasan Tamu"
          value={`${averageRating} ★`}
          change={`${villasWithRating.length} listing`}
          trend="neutral"
          period={`${totalReviews} ulasan terverifikasi`}
          icon={Star}
          subtitle="Rata-rata rating Airbnb"
        />
        <StatCard
          title="Total Tamu Menginap"
          value={String(metrics.totalGuests)}
          change={`${metrics.upcomingCount} akan datang`}
          trend={metrics.upcomingCount > 0 ? "up" : "neutral"}
          period={`dari ${metrics.confirmedCount} reservasi`}
          icon={Users}
          subtitle={`${CURATED_VILLAS.length} Unit Aktif Jabodetabek`}
        />
      </div>

      {showDiagnostics && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <h3 className="text-sm font-semibold text-amber-900">
              {reservations.length === 0
                ? "Belum ada data reservasi yang berhasil dimuat"
                : "Sebagian sumber data bermasalah"}
            </h3>
          </div>
          <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-5">
            {!dashboardData.supabaseConfigured && (
              <li>
                Supabase belum dikonfigurasi (NEXT_PUBLIC_SUPABASE_URL &amp; SUPABASE_SERVICE_ROLE_KEY). Data hanya
                disimpan sementara di memori server.
              </li>
            )}
            {dashboardData.supabaseError && (
              <li>
                Supabase: {dashboardData.supabaseError}. Pastikan SUPABASE_SERVICE_ROLE_KEY sudah diisi di environment
                Vercel (kunci anon tidak punya akses ke tabel reservations).
              </li>
            )}
            {!sync && reservations.length === 0 && <li>Sinkronisasi iCal belum berjalan.</li>}
            {sync && sync.results.length === 0 && <li>Tidak ada URL iCal Airbnb/Agoda yang terkonfigurasi.</li>}
            {feedErrors.map((r, i) => (
              <li key={`err-${i}`}>
                <span className="font-semibold">{r.propertyName}</span> ({r.channel}): {r.error}
              </li>
            ))}
            {feedWarnings.map((r, i) => (
              <li key={`warn-${i}`}>
                <span className="font-semibold">{r.propertyName}</span>: {r.warning}
              </li>
            ))}
            {sync && feedErrors.length === 0 && reservations.length === 0 && (
              <li>Semua feed iCal berhasil dibaca, tetapi belum ada booking di kalender Airbnb.</li>
            )}
          </ul>
        </div>
      )}

      {/* Multi-Channel Distribution Section */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#B8934C]/[0.06] to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF8F5] pb-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#222225]">
                <Layers className="h-3.5 w-3.5 text-[#8C7F5F]" />
              </div>
              <h3 className="text-xl text-[#222225] font-semibold">
                Sinkronisasi Kalender Otomatis
              </h3>
            </div>
            <p className="text-xs text-[#6B6862] leading-relaxed">
              Kalender properti Anda terhubung otomatis dengan Airbnb dan reservasi langsung untuk mencegah booking ganda (double-booking).
            </p>
          </div>
          <span
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto uppercase tracking-wider border ${
              airbnbHealthy
                ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                : "text-red-800 bg-red-50 border-red-200"
            }`}
          >
            {airbnbHealthy ? "Sinkronisasi Otomatis Aktif" : "Sinkronisasi Bermasalah"}
            {syncedAtLabel ? ` · ${syncedAtLabel}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <ChannelBadge
            channel="airbnb"
            status={airbnbHealthy ? "connected" : "error"}
            syncTime={`${reservations.filter((r) => r.channel === "Airbnb" && r.status !== "Blocked").length} booking`}
          />
          <ChannelBadge channel="booking" status="available" syncTime="Siap Dihubungkan" />
          <ChannelBadge channel="agoda" status="available" syncTime="Siap Dihubungkan" />
          <ChannelBadge channel="direct" status="connected" syncTime={`${directBookings} booking`} />
        </div>
      </div>

      {/* Managed Properties Table */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
        <div className="p-6 sm:p-8 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#FAF8F5]">
          <div className="space-y-1">
            <h3 className="text-xl text-[#222225] font-semibold">Daftar Properti Aktif</h3>
            <p className="text-xs text-[#6B6862]">
              Daftar villa dan apartemen yang sedang dikelola beserta tarif per malam dan ulasan tamu
            </p>
          </div>
          <Link
            href="/dashboard/properties"
            className="text-xs font-semibold text-[#8C7F5F] hover:text-[#222225] flex items-center space-x-1.5 transition-colors"
          >
            <span>Lihat Semua Properti</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DC] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#6B6862]">
                <th className="py-4 px-6">Properti & Lokasi</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Tarif per Malam</th>
                <th className="py-4 px-6">Kapasitas</th>
                <th className="py-4 px-6">Rating & Ulasan Airbnb</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5] text-xs">
              {CURATED_VILLAS.map((villa) => (
                <tr key={villa.id} className="hover:bg-[#FAF8F5]/90 transition-colors group">
                  {/* Property Name & Thumb */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative h-12 w-16 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF8F5] border border-[#E8E4DC] shadow-xs group-hover:scale-105 transition-transform">
                        <Image src={villa.heroImage} alt={villa.name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#222225] hover:text-[#8C7F5F] transition-colors line-clamp-1 max-w-[200px] sm:max-w-[260px]">
                          {villa.name}
                        </p>
                        <p className="text-[11px] text-[#8C7F5F] font-medium">{villa.location}</p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-[#FAF8F5] text-[#222225] border border-[#E8E4DC]">
                      {villa.propertyType === "entire-home"
                        ? "5BR Sanctuary Villa"
                        : villa.propertyType === "private-room"
                        ? "Private Room"
                        : "Entire Apartment"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-semibold text-[#222225]">
                    {formatCurrency(villa.price.idr, "IDR")}
                  </td>

                  {/* Capacity */}
                  <td className="py-4 px-6 text-[#6B6862]">
                    {villa.capacity.guests} Tamu &bull; {villa.capacity.beds} Bed
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6">
                    {villa.rating > 0 ? (
                      <div className="flex items-center space-x-1 font-semibold text-[#222225]">
                        <Star className="h-3.5 w-3.5 fill-[#B8934C] text-[#B8934C]" />
                        <span>{villa.rating.toFixed(2)}</span>
                        <span className="text-[#6B6862] font-normal">({villa.reviewsCount})</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        New Listing
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <Link
                        href="/dashboard/seo"
                        className="px-3 py-1.5 rounded-xl border border-[#E8E4DC] hover:border-[#222225] text-[11px] font-semibold transition-colors bg-white hover:bg-[#FAF8F5]"
                      >
                        SEO
                      </Link>
                      <a
                        href={villa.airbnbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl text-[#6B6862] hover:text-[#222225] hover:bg-[#FAF8F5] transition-colors"
                        title="Lihat di Airbnb"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
