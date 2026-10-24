import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BedDouble, Building2, PartyPopper } from "lucide-react"

const GUEST_PATHS = [
  {
    href: "/villas",
    icon: BedDouble,
    title: "Menginap",
    description: "Villa & apartemen di Jabodetabek. Cek tanggal dan harga total, lalu booking.",
    cta: "Cari Tempat Menginap",
    image: "/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg",
  },
  {
    href: "/events#jenis-acara",
    icon: PartyPopper,
    title: "Acara & Event",
    description: "Wedding, gathering & ulang tahun, atau shooting foto/video.",
    cta: "Lihat Venue & Paket",
    image: "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
  },
]

/**
 * Funnel entry: the homepage asks one question first — owner or guest — and
 * routes each answer to its own qualification form and WhatsApp line.
 */
export function FunnelEntryGate() {
  return (
    <section id="mulai" aria-labelledby="funnel-gate-heading" className="bg-[#FAF7F1] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C7F5F]">Mulai di sini</span>
          <h2 id="funnel-gate-heading" className="mt-1 font-serif text-3xl text-[#222222] sm:text-4xl">
            Apa yang Anda butuhkan hari ini?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Target 1 — Owner / Host */}
          <div className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-[#231F1A] p-8 text-white lg:col-span-2">
            <Image
              src="/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp"
              alt="Unit apartemen yang dikelola Kinghouse"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover brightness-[0.35]"
            />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5 text-[#DFC58E]" />
                Saya pemilik properti
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl">Housekeeping, Co-Hosting, atau Full Management</h3>
              <p className="text-sm font-light text-white/80">
                Pilih layanan yang sesuai, isi data properti, dan tim owner relations menghubungi Anda dalam 1 jam kerja.
              </p>
              <Link
                href="/owner-services#layanan"
                className="inline-flex items-center gap-2 rounded-full bg-[#DFC58E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#19191B] transition-colors hover:bg-[#C9A96E]"
              >
                Kelola Properti Saya <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Target 2 — Guest: stay or event */}
          <div className="space-y-3 lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C5347]">Saya mencari tempat</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {GUEST_PATHS.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3EFE6]">
                    <Image
                      src={path.image}
                      alt={path.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <div className="flex items-center gap-2 text-[#8C7F5F]">
                      <path.icon className="h-4 w-4" />
                      <h3 className="font-serif text-xl text-[#222222]">{path.title}</h3>
                    </div>
                    <p className="flex-1 text-xs leading-relaxed text-[#6B6862]">{path.description}</p>
                    <span className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-[#8C7F5F]">
                      {path.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
