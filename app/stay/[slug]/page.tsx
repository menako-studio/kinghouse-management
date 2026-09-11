import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import {
  Sparkles,
  PhoneCall,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  MessageCircle,
} from "lucide-react"
import { GUEST_COMPENDIUMS, UPSELL_SERVICES } from "@/lib/guest-guide/data"
import { WifiWidget } from "@/components/stay/wifi-widget"
import { UpsellMenu } from "@/components/stay/upsell-menu"
import { GuideSection } from "@/components/stay/guide-section"
import { QrModal } from "@/components/stay/qr-modal"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return Object.keys(GUEST_COMPENDIUMS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const compendium = GUEST_COMPENDIUMS[slug]

  if (!compendium) {
    return {
      title: "Digital Guest Guide | Kinghouse Hospitality",
    }
  }

  return {
    title: `Panduan Tamu & Layanan • ${compendium.propertyName} | Kinghouse`,
    description: `Buku panduan digital, password WiFi, petunjuk check-in, dan pemesanan layanan tambahan untuk ${compendium.propertyName}.`,
  }
}

export default async function GuestStayPage({ params }: PageProps) {
  const { slug } = await params
  const compendium = GUEST_COMPENDIUMS[slug]

  if (!compendium) {
    notFound()
  }

  const directWaUrl = `https://wa.me/${compendium.whatsappConciergePhone}?text=${encodeURIComponent(
    `Halo Concierge Kinghouse! Saya sedang menginap di ${compendium.propertyName} dan membutuhkan bantuan operasional.`
  )}`

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans pb-16 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/stay"
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <Image
              src="/brand/icon-bone.svg"
              alt="Kinghouse"
              width={20}
              height={20}
              className="h-4 w-auto object-contain"
            />
            <span>Kinghouse Stay</span>
          </Link>

          <div className="flex items-center gap-2">
            <QrModal
              propertySlug={compendium.propertySlug}
              propertyName={compendium.propertyName}
            />
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950/40 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Bantuan WA</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <Image
          src={compendium.heroImage}
          alt={compendium.propertyName}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#CBBEA0]/20 px-3 py-1 text-xs font-semibold text-[#CBBEA0] backdrop-blur-md border border-[#CBBEA0]/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Digital Guest Compendium & Concierge
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {compendium.propertyName}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-300 mt-1">
              <MapPin className="h-3.5 w-3.5 text-[#CBBEA0] shrink-0" />
              <span>{compendium.area}</span>
              <span className="text-stone-600">•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Managed by Kinghouse
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 space-y-6">
        {/* 1. High-Speed WiFi Widget */}
        <WifiWidget wifi={compendium.wifi} />

        {/* 2. In-Stay Upsell & Add-On Services (Vouch Style) */}
        <UpsellMenu
          services={UPSELL_SERVICES}
          propertySlug={compendium.propertySlug}
          propertyName={compendium.propertyName}
          whatsappPhone={compendium.whatsappConciergePhone}
        />

        {/* 3. Comprehensive House Guide (Access, Appliances, Rules, Neighborhood) */}
        <GuideSection
          access={compendium.access}
          houseRules={compendium.houseRules}
          appliances={compendium.appliances}
          localGuide={compendium.localGuide}
        />

        {/* Bottom Concierge Card */}
        <div className="rounded-3xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-950 p-6 text-center shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <PhoneCall className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-stone-100 font-serif">
            Butuh Bantuan Mendesak Selama Menginap?
          </h4>
          <p className="text-xs text-stone-400 max-w-md mx-auto mt-1 mb-4">
            Tim operasional dan *on-ground caretaker* Kinghouse siaga membantu kebutuhan Anda mulai dari penggantian token listrik, linen tambahan, hingga keadaan darurat.
          </p>
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50"
          >
            <MessageCircle className="h-4 w-4" />
            Hubungi WhatsApp Host (+62 821-2393-3218)
          </a>
        </div>
      </main>
    </div>
  )
}
