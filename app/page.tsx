import type { Metadata } from "next"
import { HeroSlider } from "@/components/home/hero-slider"
import { SearchFilterBar } from "@/components/home/search-filter-bar"
import { CuratedGrid } from "@/components/home/curated-grid"
import { TrustSocialProof } from "@/components/home/trust-social-proof"
import { DualPathSplit } from "@/components/home/dual-path-split"
import { FunnelEntryGate } from "@/components/home/funnel-entry-gate"
import { localeAlternates } from "@/lib/i18n/site"

export const metadata: Metadata = {
  title: {
    absolute: "Luxury Villas & Airbnb Management Jakarta | Kinghouse",
  },
  description:
    "Curated luxury villas and short-stay apartments in Greater Jakarta (Jagakarsa, Tangerang, Cikarang). Hotel-standard hygiene & high-yield Airbnb co-hosting.",
  alternates: localeAlternates("/", "en"),
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Cinematic Hero Section with High-Res Visuals & Dual CTAs */}
      <HeroSlider />

      {/* 2. Airbnb-Style Floating Pill Search & Filter Bar (overlaps the hero) */}
      <SearchFilterBar />

      {/* 3. Funnel entry: "Saya pemilik properti" vs "Saya mencari tempat" (Menginap / Event) */}
      <FunnelEntryGate />

      {/* 4. Curated Collections: 3-Column Architectural Symmetrical Grid */}
      <CuratedGrid />

      {/* 5. Trust & Social Proof: Partner Logos & Verified Reviews Carousel */}
      <TrustSocialProof />

      {/* 6. Dual-Path Split Section (50% Guest Escape vs 50% Owner ROI) */}
      <DualPathSplit />
    </main>
  )
}
