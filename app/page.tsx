import type { Metadata } from "next"
import { HeroSlider } from "@/components/home/hero-slider"
import { SearchFilterBar } from "@/components/home/search-filter-bar"
import { CuratedGrid } from "@/components/home/curated-grid"
import { TrustSocialProof } from "@/components/home/trust-social-proof"
import { DualPathSplit } from "@/components/home/dual-path-split"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Kinghouse Management — Curated Villas & Airbnb Management in Jakarta",
  description:
    "Curated short-stay villas and apartments in Greater Jakarta (Jagakarsa, Tangerang, Palmerah, Cikarang) with 5-star hotel hygiene and institutional-grade property management.",
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Cinematic Hero Section with High-Res Visuals & Dual CTAs */}
      <HeroSlider />

      {/* 2. Airbnb-Style Floating Pill Search & Filter Bar */}
      <SearchFilterBar />

      {/* 3. Curated Collections: 3-Column Architectural Symmetrical Grid */}
      <CuratedGrid />

      {/* 4. Trust & Social Proof: Partner Logos & Verified Reviews Carousel */}
      <TrustSocialProof />

      {/* 5. Dual-Path Split Section (50% Guest Escape vs 50% Owner ROI) */}
      <DualPathSplit />
    </main>
  )
}
