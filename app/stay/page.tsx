import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Sparkles, MapPin, ArrowRight, ShieldCheck, QrCode } from "lucide-react"
import { GUEST_COMPENDIUMS } from "@/lib/guest-guide/data"

export const metadata: Metadata = {
  title: "Digital Guest Compendium & Concierge | Kinghouse",
  description:
    "Panduan digital tamu, petunjuk check-in, password WiFi instan, dan layanan concierge 24/7 untuk villa & apartemen kelolaan Kinghouse.",
  alternates: {
    canonical: "/stay",
  },
}

export default function GuestDirectoryPage() {
  const properties = Object.values(GUEST_COMPENDIUMS)

  return (
    <div className="min-h-screen bg-[#191714] text-stone-100 font-sans py-12 px-4 sm:px-6 selection:bg-[#CBBEA0] selection:text-[#231F1A]">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <Link href="/" className="mb-5 inline-block transition-opacity hover:opacity-80">
            <Image
              src="/brand/logo-secondary-bone.svg"
              alt="Kinghouse Management"
              width={160}
              height={46}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#CBBEA0]/10 px-3.5 py-1.5 text-xs font-medium text-[#CBBEA0] border border-[#CBBEA0]/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Digital Guest Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-white font-serif tracking-tight">
            Digital Guest Compendium
          </h1>
          <p className="text-sm text-stone-400 max-w-lg mx-auto mt-2 font-sans font-light">
            Pilih properti tempat Anda menginap untuk melihat password WiFi, petunjuk check-in, aturan rumah, dan memesan layanan ekstra.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {properties.map((prop) => (
            <Link
              key={prop.propertySlug}
              href={`/stay/${prop.propertySlug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-800 bg-[#231F1A]/80 p-5 transition-all duration-300 hover:border-[#CBBEA0]/50 hover:bg-[#231F1A] hover:shadow-[0_10px_30px_rgba(203,190,160,0.08)]"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-4 bg-stone-900">
                  <Image
                    src={prop.heroImage}
                    alt={prop.propertyName}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-medium text-stone-300">
                    <MapPin className="h-3 w-3 text-[#CBBEA0]" />
                    <span>{prop.area}</span>
                  </div>
                </div>

                <h3 className="text-base font-medium text-stone-100 font-serif group-hover:text-[#CBBEA0] transition-colors">
                  {prop.propertyName}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-stone-800/80 pt-3">
                <span className="text-xs font-semibold text-stone-400 group-hover:text-[#CBBEA0] transition-colors">
                  Buka Panduan Digital
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-800 text-stone-300 group-hover:bg-[#CBBEA0] group-hover:text-[#231F1A] transition-all">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Link Back */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← Kembali ke Beranda Kinghouse
          </Link>
        </div>
      </div>
    </div>
  )
}
