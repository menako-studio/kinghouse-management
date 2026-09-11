"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ExternalLink,
  Search,
  Star,
  Users,
  Bed,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Layers,
  HelpCircle,
  X,
  CheckCircle2,
} from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { ChannelBadge } from "@/components/dashboard/channel-badge"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPropertiesPage() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [selectedGuideVilla, setSelectedGuideVilla] = useState<string | null>(null)

  const handleCopyIcal = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.kinghousemanagement.com"
    const url = `${origin}/api/ical/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  return (
    <div className="space-y-8 animate-sana-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>PORTFOLIO ASSETS & OTA SYNC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Property Portfolio & Channel Sync
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Daftar unit properti aktif, pengaturan komisi bagi hasil, dan link iCal feed sinkronisasi otomatis ke Airbnb / OTA.
          </p>
        </div>
        <div className="text-xs text-[#717171] bg-white border border-[#E8E4DC] px-4 py-2 rounded-2xl shadow-xs self-start sm:self-auto flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span><strong className="text-[#222225] font-semibold">4 Unit</strong> Terhubung Aktif</span>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CURATED_VILLAS.map((villa) => (
          <div
            key={villa.id}
            className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={villa.heroImage} alt={villa.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {villa.area}
                  </span>
                  <span className="text-[10px] font-semibold bg-white/95 text-[#222225] backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                    {villa.architecturalStyle}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <p className="text-[10px] text-white/75 uppercase tracking-wider font-semibold">Tarif Dasar / Malam</p>
                    <p className="text-2xl font-bold text-white tracking-tight">
                      {formatCurrency(villa.price.idr, "IDR")}
                    </p>
                  </div>
                  {villa.rating > 0 ? (
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                      <Star className="h-3.5 w-3.5 fill-[#B8934C] text-[#B8934C]" />
                      <span>{villa.rating.toFixed(2)}</span>
                      <span className="text-white/70 font-normal">({villa.reviewsCount} ulasan)</span>
                    </div>
                  ) : (
                    <span className="text-xs bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full font-medium text-white">
                      Listing Baru
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl text-[#222225] font-semibold leading-snug line-clamp-1">
                    {villa.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-[#717171] mt-1">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#B8934C]" />
                    <span>{villa.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#717171] leading-relaxed line-clamp-2 font-light">
                  {villa.editorialDescription.lead}
                </p>

                {/* Specs */}
                <div className="flex items-center space-x-4 text-xs text-[#717171] pt-3 border-t border-[#FAF8F5]">
                  <span className="flex items-center space-x-1.5">
                    <Users className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>{villa.capacity.guests} Tamu</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1.5">
                    <Bed className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>{villa.capacity.bedrooms} Kamar Tidur</span>
                  </span>
                  <span>&bull;</span>
                  <span>{villa.capacity.beds} Kasur</span>
                </div>

                {/* iCal Feed URL for Non-Tech Operators */}
                <div className="pt-2 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#222225] flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-[#B8934C]" />
                      <span>URL Kalender iCal (Airbnb Sync)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedGuideVilla(villa.name)}
                      className="text-[#B8934C] hover:text-[#222225] font-semibold flex items-center space-x-0.5 cursor-pointer"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>Panduan Sync</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`/api/ical/${villa.slug}`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC] text-[11px] font-mono text-[#555] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyIcal(villa.slug)}
                      className="px-3 py-1.5 rounded-xl bg-[#222225] text-white hover:bg-[#2B2A30] text-[11px] font-semibold transition-all flex items-center space-x-1 cursor-pointer flex-shrink-0"
                    >
                      {copiedSlug === villa.slug ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Channel Status */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#717171] mb-2">
                    Status Konektivitas Saluran OTA
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ChannelBadge channel="airbnb" status="connected" />
                    <ChannelBadge channel="booking" status="coming_soon" />
                    <ChannelBadge channel="agoda" status="coming_soon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex items-center justify-between gap-3">
              <Link
                href="/dashboard/seo"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#222225] text-white py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#2B2A30] transition-all shadow-xs"
              >
                <Search className="h-3.5 w-3.5 text-[#B8934C]" />
                <span>Kelola SEO & Kata Kunci</span>
              </Link>
              <a
                href={villa.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#DAD5CC] transition-all shadow-xs"
              >
                <span>Lihat di Airbnb</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#717171]" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* iCal Guide Modal for Non-Tech Staff */}
      {selectedGuideVilla && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] max-h-[90vh] overflow-y-auto animate-sana-glow">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
              <div>
                <h3 className="text-2xl text-[#222225] font-semibold">Panduan Sinkronisasi Kalender</h3>
                <p className="text-xs text-[#717171] mt-0.5">{selectedGuideVilla}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuideVilla(null)}
                className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs text-[#555] leading-relaxed">
              <p className="font-medium text-[#222225]">
                Ikuti 3 langkah mudah ini untuk menghubungkan kalender Kinghouse ke akun Airbnb Anda agar tidak terjadi double-booking:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-start space-x-3">
                  <span className="h-6 w-6 rounded-full bg-[#222225] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-[#222225] block">Salin Link iCal</strong>
                    <span>Klik tombol &quot;Salin Link&quot; di kartu properti di atas.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-start space-x-3">
                  <span className="h-6 w-6 rounded-full bg-[#222225] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-[#222225] block">Buka Pengaturan Kalender di Airbnb</strong>
                    <span>Masuk ke Akun Host Airbnb &rarr; Buka Listing &rarr; Pilih Menu <strong>&quot;Pricing and availability&quot;</strong> &rarr; Pilih <strong>&quot;Calendar sync&quot;</strong> &rarr; Klik <strong>&quot;Import Calendar&quot;</strong>.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-start space-x-3">
                  <span className="h-6 w-6 rounded-full bg-[#222225] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-[#222225] block">Paste Link & Simpan</strong>
                    <span>Tempelkan URL link iCal yang tadi disalin, beri nama &quot;Kinghouse Direct Sync&quot;, lalu klik <strong>Import Calendar</strong>. Selesai!</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedGuideVilla(null)}
                  className="px-6 py-2.5 rounded-2xl bg-[#222225] text-white font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
                >
                  Saya Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
