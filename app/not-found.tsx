"use client"

import Link from "next/link"
import { 
  Compass, 
  ArrowRight, 
  Home, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  ArrowUpRight
} from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"
import { SITE_CONFIG, MANAGED_AREAS } from "@/lib/constants"

export default function NotFound() {
  const { language } = useLocalization()
  const isId = language === "ID"

  return (
    <main className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center overflow-hidden supergraphic-blueprint-bone py-16 sm:py-24 px-6 lg:px-12">
      {/* Decorative architectural ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#CBBEA0]/20 via-[#8C7F5F]/5 to-transparent blur-3xl" 
      />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center animate-sana-fade-in">
        
        {/* Floating Architectural Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full sana-glass border border-[#E8E4DC] text-[#8C7F5F] mb-8 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#8C7F5F] animate-sana-float" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
            {isId ? "404 • LOKASI BELUM TERPETAKAN" : "404 • SANCTUARY UNCHARTED"}
          </span>
        </div>

        {/* Large Editorial 404 Display */}
        <div className="relative mb-6 select-none">
          <div className="font-serif text-8xl sm:text-9xl lg:text-[11rem] font-light text-[#231F1A] leading-none tracking-tight">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-sm pointer-events-none">
            <span className="font-serif text-8xl sm:text-9xl lg:text-[11rem] font-light text-[#8C7F5F]">
              404
            </span>
          </div>
        </div>

        {/* Supergraphic Architectural Divider */}
        <div className="supergraphic-divider max-w-xs mx-auto mb-8" />

        {/* Editorial Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#231F1A] font-normal tracking-tight mb-4 max-w-2xl mx-auto leading-snug">
          {isId 
            ? "Halaman yang Anda cari sedang privat atau telah berpindah." 
            : "The sanctuary you are seeking is private or does not exist."}
        </h1>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-[#5C5347] font-light max-w-xl mx-auto leading-relaxed mb-10">
          {isId
            ? "Layaknya pintu gerbang villa tersembunyi di Jabodetabek, tautan ini belum terdaftar dalam direktori kami. Mari kami antarkan kembali ke koleksi properti dan layanan resmi Kinghouse Management."
            : "Like a secluded villa entrance in Greater Jakarta, this path is currently unmapped. Allow our digital concierge to guide you back to our curated residences and services."}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#231F1A] text-white text-xs font-semibold uppercase tracking-[0.18em] shadow-[0_4px_20px_rgba(35,31,26,0.12)] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Home className="w-4 h-4 text-[#CBBEA0]" />
            <span>{isId ? "Kembali ke Beranda" : "Return to Home"}</span>
          </Link>

          <Link
            href="/villas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#231F1A] border border-[#D5CFC3] text-xs font-semibold uppercase tracking-[0.18em] shadow-xs hover:border-[#8C7F5F] hover:bg-[#FAF7F1] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-[#8C7F5F]" />
            <span>{isId ? "Jelajahi Villa" : "Explore All Villas"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5C5347]" />
          </Link>

          <a
            href={`https://wa.me/${SITE_CONFIG.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              isId 
                ? "Halo Kinghouse Concierge, saya mengalami kendala tautan halaman pada website dan butuh bantuan." 
                : "Hello Kinghouse Concierge, I encountered an unmapped page on your website and require assistance."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF7F1] text-[#5C5347] border border-[#E8E4DC] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#231F1A] hover:border-[#8C7F5F] transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>{isId ? "Bantuan Concierge" : "Concierge Help"}</span>
          </a>
        </div>

        {/* Quick Location Shortcuts (Nakula/Sana Labs Inspired Bento Cards) */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-[#E8E4DC]/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C7F5F] mb-6">
            {isId ? "DESTINASI UNGGULAN JABODETABEK" : "CURATED JABODETABEK ENCLAVES"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {MANAGED_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="group p-4 rounded-xl sana-glass sana-card-hover border border-[#E8E4DC] block"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#231F1A] group-hover:text-[#8C7F5F] transition-colors">
                    {area.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#CBBEA0] group-hover:text-[#8C7F5F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#5C5347]">
                  <MapPin className="w-3 h-3 text-[#8C7F5F]" />
                  <span>{area.region}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Auxiliary Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5C5347]">
          <Link href="/owner-services" className="hover:text-[#231F1A] hover:underline underline-offset-4 transition-colors">
            {isId ? "Layanan Pemilik Properti" : "Owner Services"}
          </Link>
          <span className="text-[#CBBEA0]">•</span>
          <Link href="/faq" className="hover:text-[#231F1A] hover:underline underline-offset-4 transition-colors">
            {isId ? "Tanya Jawab (FAQ)" : "FAQ & Assistance"}
          </Link>
          <span className="text-[#CBBEA0]">•</span>
          <Link href="/blog" className="hover:text-[#231F1A] hover:underline underline-offset-4 transition-colors">
            {isId ? "Artikel & Editorial" : "Journal & Guides"}
          </Link>
          <span className="text-[#CBBEA0]">•</span>
          <Link href="/contact" className="hover:text-[#231F1A] hover:underline underline-offset-4 transition-colors">
            {isId ? "Kontak Resmi" : "Contact Desk"}
          </Link>
        </div>

      </div>
    </main>
  )
}
