"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp,
  Sparkles,
  Building2,
  Printer,
  MessageSquare,
} from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"
import { SUBMARKET_BENCHMARKS } from "@/lib/pricing/engine"
import { trackWhatsAppClick } from "@/lib/analytics"
import { Button } from "@/components/ui/button"

interface SubmarketOption {
  key: string
  labelEn: string
  labelId: string
  area: string
  propertyTypeEn: string
  propertyTypeId: string
  defaultBedrooms: number
  benchmarkAdrIdr: number
  marketOccupancyPercent: number
  kinghouseOccupancyPercent: number
}

const SUBMARKET_OPTIONS: SubmarketOption[] = [
  {
    key: "versatile-house-jagakarsa",
    labelEn: "Jagakarsa, South Jakarta — Luxury Villa & Event Garden",
    labelId: "Jagakarsa, Jakarta Selatan — Luxury Villa & Event Garden",
    area: "Jagakarsa, Jakarta Selatan",
    propertyTypeEn: "Luxury Villa",
    propertyTypeId: "Villa Mewah",
    defaultBedrooms: 5,
    benchmarkAdrIdr: SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"].avgCompetitorAdrIdr,
    marketOccupancyPercent: SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"].marketOccupancyPercent,
    kinghouseOccupancyPercent: SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"].kinghouseOccupancyPercent,
  },
  {
    key: "sky-house-tangerang",
    labelEn: "Alam Sutera / Pinang, Tangerang — Urban Transit Apartment",
    labelId: "Alam Sutera / Pinang, Tangerang — Apartemen Urban Transit",
    area: "Pinang, Kota Tangerang",
    propertyTypeEn: "Apartment",
    propertyTypeId: "Apartemen",
    defaultBedrooms: 1,
    benchmarkAdrIdr: SUBMARKET_BENCHMARKS["sky-house-tangerang"].avgCompetitorAdrIdr,
    marketOccupancyPercent: SUBMARKET_BENCHMARKS["sky-house-tangerang"].marketOccupancyPercent,
    kinghouseOccupancyPercent: SUBMARKET_BENCHMARKS["sky-house-tangerang"].kinghouseOccupancyPercent,
  },
  {
    key: "bright-airy-apartment-palmerah",
    labelEn: "Palmerah / Slipi, West Jakarta — Central Urban Studio",
    labelId: "Palmerah / Slipi, Jakarta Barat — Studio Urban Central",
    area: "Palmerah, Jakarta Barat",
    propertyTypeEn: "Studio Apartment",
    propertyTypeId: "Studio Apartemen",
    defaultBedrooms: 1,
    benchmarkAdrIdr: SUBMARKET_BENCHMARKS["bright-airy-apartment-palmerah"].avgCompetitorAdrIdr,
    marketOccupancyPercent: SUBMARKET_BENCHMARKS["bright-airy-apartment-palmerah"].marketOccupancyPercent,
    kinghouseOccupancyPercent: SUBMARKET_BENCHMARKS["bright-airy-apartment-palmerah"].kinghouseOccupancyPercent,
  },
  {
    key: "skyline-luxury-orange-county-cikarang",
    labelEn: "Cikarang Selatan, Bekasi — Expat Business Suite (Orange County)",
    labelId: "Cikarang Selatan, Bekasi — Suite Bisnis Ekspatriat (Orange County)",
    area: "Cikarang Selatan, Bekasi",
    propertyTypeEn: "Executive Suite",
    propertyTypeId: "Suite Eksekutif",
    defaultBedrooms: 1,
    benchmarkAdrIdr: SUBMARKET_BENCHMARKS["skyline-luxury-orange-county-cikarang"].avgCompetitorAdrIdr,
    marketOccupancyPercent: SUBMARKET_BENCHMARKS["skyline-luxury-orange-county-cikarang"].marketOccupancyPercent,
    kinghouseOccupancyPercent: SUBMARKET_BENCHMARKS["skyline-luxury-orange-county-cikarang"].kinghouseOccupancyPercent,
  },
  {
    key: "custom-jabodetabek",
    labelEn: "Other Greater Jakarta Enclave (Custom)",
    labelId: "Kawasan Lain di Jabodetabek (Kustom)",
    area: "Jabodetabek",
    propertyTypeEn: "Villa / Apartment",
    propertyTypeId: "Villa / Apartemen",
    defaultBedrooms: 2,
    benchmarkAdrIdr: 650000,
    marketOccupancyPercent: 52,
    kinghouseOccupancyPercent: 75,
  },
]

export function PropertyRevenueCalculator() {
  const { formatPrice, language } = useLocalization()
  const isId = language === "ID"

  // Input states
  const [selectedSubmarketKey, setSelectedSubmarketKey] = useState<string>("versatile-house-jagakarsa")
  const currentSubmarket = useMemo(() => {
    return SUBMARKET_OPTIONS.find((s) => s.key === selectedSubmarketKey) || SUBMARKET_OPTIONS[0]
  }, [selectedSubmarketKey])

  const [bedrooms, setBedrooms] = useState<number>(currentSubmarket.defaultBedrooms)
  const [customAdrIdr, setCustomAdrIdr] = useState<number>(currentSubmarket.benchmarkAdrIdr)
  const [feeTier, setFeeTier] = useState<"standard" | "premium">("standard")
  const [hasPool, setHasPool] = useState<boolean>(selectedSubmarketKey === "versatile-house-jagakarsa")
  const [hasNetflix, setHasNetflix] = useState<boolean>(true)
  const [hasSmartLock, setHasSmartLock] = useState<boolean>(true)
  const [hasWifi, setHasWifi] = useState<boolean>(true)

  // Sync default values when changing submarket
  const handleSubmarketChange = (key: string) => {
    setSelectedSubmarketKey(key)
    const found = SUBMARKET_OPTIONS.find((s) => s.key === key)
    if (found) {
      setBedrooms(found.defaultBedrooms)
      setCustomAdrIdr(found.benchmarkAdrIdr)
      setHasPool(key === "versatile-house-jagakarsa")
    }
  }

  // Purely dynamic calculations based on real benchmarks and dynamic pricing algorithms
  const calculations = useMemo(() => {
    const baseAdr = Math.max(150000, customAdrIdr)
    
    // Amenity multiplier factor
    let amenityMultiplier = 1.0
    if (hasPool) amenityMultiplier += 0.12 // Pool adds ~12% ADR premium
    if (hasNetflix) amenityMultiplier += 0.03
    if (hasSmartLock) amenityMultiplier += 0.02
    if (hasWifi) amenityMultiplier += 0.03

    // 1. Self-Managed Scenario (Conventional flat pricing on OTA)
    const selfOccupancyRate = currentSubmarket.marketOccupancyPercent / 100
    const selfNightsBooked = Math.round(365 * selfOccupancyRate)
    const selfGrossAnnual = Math.round(selfNightsBooked * baseAdr)
    // Airbnb OTA platform fee ~15% + estimated cleaning/linen hassle cost ~5%
    const selfNetAnnual = Math.round(selfGrossAnnual * 0.80)
    const selfNetMonthly = Math.round(selfNetAnnual / 12)

    // 2. Kinghouse Managed Scenario (AirDNA Dynamic Pricing + Direct Booking SEO)
    // Dynamic Pricing delivers higher average daily rate (+18% weighted across weekend & holiday surges)
    const kinghouseWeightedAdr = Math.round(baseAdr * 1.18 * amenityMultiplier)
    const kinghouseOccupancyRate = currentSubmarket.kinghouseOccupancyPercent / 100
    const kinghouseNightsBooked = Math.round(365 * kinghouseOccupancyRate)
    const kinghouseGrossAnnual = Math.round(kinghouseNightsBooked * kinghouseWeightedAdr)
    
    // Management commission (Standard: 15%, Premium: 20%)
    const commissionPercent = feeTier === "premium" ? 20 : 15
    const kinghouseManagementFeeAnnual = Math.round((kinghouseGrossAnnual * commissionPercent) / 100)
    // Cleaning fee is paid 100% by guests on Airbnb/Direct, so it is not deducted from owner
    const kinghouseNetAnnual = Math.round(kinghouseGrossAnnual - kinghouseManagementFeeAnnual)
    const kinghouseNetMonthly = Math.round(kinghouseNetAnnual / 12)

    // Lift / Increment
    const netAnnualLift = Math.max(0, kinghouseNetAnnual - selfNetAnnual)
    const netMonthlyLift = Math.round(netAnnualLift / 12)
    const percentageLift = selfNetAnnual > 0 ? Math.round((netAnnualLift / selfNetAnnual) * 100) : 0

    return {
      baseAdr,
      selfOccupancyPercent: currentSubmarket.marketOccupancyPercent,
      selfNightsBooked,
      selfGrossAnnual,
      selfNetAnnual,
      selfNetMonthly,
      kinghouseWeightedAdr,
      kinghouseOccupancyPercent: currentSubmarket.kinghouseOccupancyPercent,
      kinghouseNightsBooked,
      kinghouseGrossAnnual,
      kinghouseManagementFeeAnnual,
      kinghouseNetAnnual,
      kinghouseNetMonthly,
      netAnnualLift,
      netMonthlyLift,
      percentageLift,
      commissionPercent,
    }
  }, [
    customAdrIdr,
    currentSubmarket,
    feeTier,
    hasPool,
    hasNetflix,
    hasSmartLock,
    hasWifi,
  ])

  // Pre-filled WhatsApp consultation message (bilingual)
  const whatsappUrl = useMemo(() => {
    const propertyType = isId ? currentSubmarket.propertyTypeId : currentSubmarket.propertyTypeEn
    const message = isId
      ? `Halo Kinghouse Management, saya ingin konsultasi hasil simulasi potensi cuan properti saya:
- Lokasi: ${currentSubmarket.area}
- Tipe/Kamar: ${bedrooms} Bedroom (${propertyType})
- Estimasi ADR: ${formatPrice(calculations.baseAdr)} / malam
- Hasil Proyeksi Net Kinghouse: ${formatPrice(calculations.kinghouseNetMonthly)} / bulan (Surplus +${formatPrice(calculations.netMonthlyLift)}/bln)
- Model: ${feeTier === "premium" ? "20% Multi-Channel Premium" : "15% Full Service"}

Mohon informasi jadwal audit fisik & onboarding properti saya. Terima kasih!`
      : `Hello Kinghouse Management, I would like to discuss my property revenue simulation audit:
- Location: ${currentSubmarket.area}
- Type/Bedrooms: ${bedrooms} Bedroom (${propertyType})
- Estimated ADR: ${formatPrice(calculations.baseAdr)} / night
- Projected Net Monthly Payout: ${formatPrice(calculations.kinghouseNetMonthly)} / month (Surplus +${formatPrice(calculations.netMonthlyLift)}/mo)
- Model: ${feeTier === "premium" ? "20% Multi-Channel Premium" : "15% Full Service"}

Please provide information on scheduling a complimentary physical audit and onboarding timeline. Thank you!`

    return `https://wa.me/6282123933218?text=${encodeURIComponent(message)}`
  }, [isId, currentSubmarket, bedrooms, calculations, feeTier, formatPrice])

  const handlePrintAudit = () => {
    window.print()
  }

  return (
    <section id="calculator" className="section-macro-spacing bg-[#FAF7F1] relative border-y border-[#CBBEA0]/30 select-none">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#231F1A]/5 px-3.5 py-1 text-xs font-semibold text-[#6B4B2A] border border-[#6B4B2A]/20">
            <Sparkles className="h-3.5 w-3.5 text-[#B8934C]" />
            <span className="uppercase tracking-widest text-[11px]">
              {isId ? "Simulator Pendapatan Standar AirDNA" : "AirDNA-Grade Revenue Simulator"}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#231F1A] font-normal tracking-tight">
            {isId
              ? "Hitung Potensi Pendapatan Bersih Properti Anda"
              : "Calculate Your Property's Net Revenue Potential"}
          </h2>
          <p className="text-sm sm:text-base text-[#5C5347] max-w-2xl mx-auto leading-relaxed">
            {isId
              ? "Berdasarkan benchmark empiris submarket Jabodetabek dan algoritma Dynamic Pricing Kinghouse. Bandingkan hasil jika dikelola mandiri vs dikelola profesional."
              : "Based on empirical Greater Jakarta submarket benchmarks and Kinghouse dynamic pricing algorithms. Compare self-managed yields vs professional institutional co-hosting."}
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (Left, 5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DC] shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-[#E8E4DC] pb-4">
              <h3 className="font-serif text-xl text-[#231F1A] flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#B8934C]" />
                {isId ? "Parameter Properti Anda" : "Your Property Parameters"}
              </h3>
              <p className="text-xs text-[#5C5347] mt-1">
                {isId
                  ? "Pilih lokasi dan karakteristik unit Anda untuk kalkulasi akurat."
                  : "Select your asset location and specifications for an accurate projection."}
              </p>
            </div>

            {/* Submarket Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231F1A] block">
                {isId ? "Lokasi / Submarket Jabodetabek" : "Location / Greater Jakarta Submarket"}
              </label>
              <select
                value={selectedSubmarketKey}
                onChange={(e) => handleSubmarketChange(e.target.value)}
                className="w-full rounded-xl border border-[#CBBEA0]/40 bg-[#FAF7F1] px-3.5 py-2.5 text-xs sm:text-sm text-[#231F1A] focus:outline-hidden focus:ring-2 focus:ring-[#B8934C]/30"
              >
                {SUBMARKET_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms and Custom ADR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#231F1A] block">
                  {isId ? "Jumlah Kamar Tidur" : "Bedrooms"}
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#CBBEA0]/40 bg-[#FAF7F1] px-3.5 py-2.5 text-xs sm:text-sm text-[#231F1A] focus:outline-hidden focus:ring-2 focus:ring-[#B8934C]/30"
                >
                  <option value={1}>{isId ? "1 Kamar (Studio / Suite)" : "1 Bedroom (Studio / Suite)"}</option>
                  <option value={2}>{isId ? "2 Kamar Tidur" : "2 Bedrooms"}</option>
                  <option value={3}>{isId ? "3 Kamar Tidur" : "3 Bedrooms"}</option>
                  <option value={4}>{isId ? "4 Kamar Tidur" : "4 Bedrooms"}</option>
                  <option value={5}>{isId ? "5+ Kamar Tidur (Luxury Villa)" : "5+ Bedrooms (Luxury Villa)"}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#231F1A] block">
                  {isId ? "Harga Sewa / Malam (IDR)" : "Nightly Base Rate (IDR)"}
                </label>
                <input
                  type="number"
                  step={50000}
                  min={100000}
                  value={customAdrIdr}
                  onChange={(e) => setCustomAdrIdr(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#CBBEA0]/40 bg-[#FAF7F1] px-3.5 py-2 text-xs sm:text-sm text-[#231F1A] focus:outline-hidden focus:ring-2 focus:ring-[#B8934C]/30 font-medium"
                />
              </div>
            </div>

            {/* Key Amenities Multi-Check */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231F1A] block">
                {isId ? "Fasilitas Unggulan Unit" : "Key Unit Amenities"}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#231F1A]">
                <label className="flex items-center space-x-2 p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E4DC] cursor-pointer hover:border-[#B8934C] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasPool}
                    onChange={(e) => setHasPool(e.target.checked)}
                    className="accent-[#B8934C] rounded"
                  />
                  <span>{isId ? "Kolam Renang" : "Private Swimming Pool"}</span>
                </label>
                <label className="flex items-center space-x-2 p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E4DC] cursor-pointer hover:border-[#B8934C] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasSmartLock}
                    onChange={(e) => setHasSmartLock(e.target.checked)}
                    className="accent-[#B8934C] rounded"
                  />
                  <span>{isId ? "Smart Lock PIN" : "Smart Keypad Lock"}</span>
                </label>
                <label className="flex items-center space-x-2 p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E4DC] cursor-pointer hover:border-[#B8934C] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasNetflix}
                    onChange={(e) => setHasNetflix(e.target.checked)}
                    className="accent-[#B8934C] rounded"
                  />
                  <span>{isId ? "Smart TV Netflix" : "Smart TV 4K & Netflix"}</span>
                </label>
                <label className="flex items-center space-x-2 p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E4DC] cursor-pointer hover:border-[#B8934C] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasWifi}
                    onChange={(e) => setHasWifi(e.target.checked)}
                    className="accent-[#B8934C] rounded"
                  />
                  <span>{isId ? "WiFi Cepat" : "High-Speed WiFi"}</span>
                </label>
              </div>
            </div>

            {/* Management Fee Tier */}
            <div className="space-y-2 pt-2 border-t border-[#E8E4DC]">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231F1A] block">
                {isId ? "Pilihan Skema Co-Hosting Kinghouse" : "Kinghouse Co-Hosting Service Tier"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFeeTier("standard")}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    feeTier === "standard"
                      ? "bg-[#231F1A] text-white border-[#231F1A] shadow-sm"
                      : "bg-[#FAF7F1] text-[#231F1A] border-[#CBBEA0]/40 hover:border-[#B8934C]"
                  }`}
                >
                  <span className="block text-xs font-bold">15% Standard</span>
                  <span className={`block text-[10px] ${feeTier === "standard" ? "text-white/70" : "text-[#5C5347]"}`}>
                    {isId ? "Full-Service Airbnb Host" : "Full-Service Co-Hosting"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeeTier("premium")}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    feeTier === "premium"
                      ? "bg-[#231F1A] text-white border-[#231F1A] shadow-sm"
                      : "bg-[#FAF7F1] text-[#231F1A] border-[#CBBEA0]/40 hover:border-[#B8934C]"
                  }`}
                >
                  <span className="block text-xs font-bold text-[#CBBEA0]">20% Premium</span>
                  <span className={`block text-[10px] ${feeTier === "premium" ? "text-white/70" : "text-[#5C5347]"}`}>
                    {isId ? "Multi-Channel + Direct SEO" : "Multi-Channel + Direct SEO"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Column (Right, 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Net Yield Card */}
            <div className="bg-[#231F1A] text-white rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(35,31,26,0.2)] border border-[#CBBEA0]/30 relative overflow-hidden">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8934C]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-8">
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#B8934C]/20 px-3 py-1 text-[11px] font-semibold text-[#EFE2CE] border border-[#B8934C]/30">
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-[#B8934C]" />
                    {isId ? "Proyeksi Kenaikan Laba Bersih Owner" : "Projected Net Owner Yield Lift"}
                  </span>
                  <span className="text-xs text-[#CBBEA0] font-mono">
                    Audit: {currentSubmarket.area}
                  </span>
                </div>

                {/* Big Net Monthly Display */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-white/60 block">
                    {isId ? "Estimasi Transferan Bersih ke Rekening Anda" : "Estimated Net Monthly Payout to Your Bank Account"}
                  </span>
                  <div className="flex items-baseline space-x-3">
                    <span className="font-serif text-3xl sm:text-5xl text-white font-normal">
                      {formatPrice(calculations.kinghouseNetMonthly)}
                    </span>
                    <span className="text-sm sm:text-base text-[#CBBEA0] font-light">
                      {isId ? "/ bulan" : "/ month"}
                    </span>
                  </div>
                  <div className="inline-flex items-center text-xs font-semibold text-[#4ADE80] bg-[#4ADE80]/10 px-3 py-1 rounded-full border border-[#4ADE80]/20">
                    {isId
                      ? `+${formatPrice(calculations.netMonthlyLift)}/bulan lebih tinggi (+${calculations.percentageLift}% Net Lift)`
                      : `+${formatPrice(calculations.netMonthlyLift)}/month higher (+${calculations.percentageLift}% Net Lift)`}
                  </div>
                </div>

                {/* Comparison Bar: Self vs Kinghouse */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">
                        {isId ? "Okupansi Rata-Rata Kelola Mandiri:" : "Self-Managed Average Occupancy:"}
                      </span>
                      <span className="font-mono text-white/80">
                        {calculations.selfOccupancyPercent}% ({calculations.selfNightsBooked} {isId ? "malam/thn" : "nights/yr"})
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/40 rounded-full transition-all duration-500"
                        style={{ width: `${calculations.selfOccupancyPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#CBBEA0] font-semibold">
                        {isId ? "Okupansi Bersama Kinghouse Dynamic Yield:" : "Occupancy with Kinghouse Dynamic Yield:"}
                      </span>
                      <span className="font-mono text-[#CBBEA0] font-bold">
                        {calculations.kinghouseOccupancyPercent}% ({calculations.kinghouseNightsBooked} {isId ? "malam/thn" : "nights/yr"})
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B8934C] to-[#EFE2CE] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(184,147,76,0.5)]"
                        style={{ width: `${calculations.kinghouseOccupancyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Annual Financial Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                      {isId ? "Omset Kotor Tahunan" : "Annual Gross Booking"}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white block">
                      {formatPrice(calculations.kinghouseGrossAnnual)}
                    </span>
                    <span className="text-[10px] text-white/40 line-through">
                      {formatPrice(calculations.selfGrossAnnual)} ({isId ? "Mandiri" : "Self"})
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                      {isId ? `Fee Kinghouse (${calculations.commissionPercent}%)` : `Kinghouse Fee (${calculations.commissionPercent}%)`}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#CBBEA0] block">
                      {formatPrice(calculations.kinghouseManagementFeeAnnual)}
                    </span>
                    <span className="text-[10px] text-white/50">
                      {isId ? "Tanpa Biaya Tersembunyi" : "Zero Hidden Markups"}
                    </span>
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#4ADE80] font-semibold block">
                      {isId ? "Total Surplus Bersih / Thn" : "Net Annual Surplus"}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#4ADE80] block">
                      +{formatPrice(calculations.netAnnualLift)}
                    </span>
                    <span className="text-[10px] text-[#4ADE80]/80">
                      {isId ? "Surplus di atas kelola sendiri" : "Surplus above self-management"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Pricing Engine Explainer Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-white/80">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-[#CBBEA0] block">
                      ✦ {isId ? "Lonjakan Akhir Pekan" : "Weekend Surge"}
                    </span>
                    <p className="text-[11px] text-white/70 leading-snug">
                      {isId
                        ? "Naik otomatis +25% s/d +35% saat Jumat-Minggu tanpa sepi peminat."
                        : "Automated +25% to +35% weekend rate surge capitalizing on high leisure demand."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-[#CBBEA0] block">
                      ✦ {isId ? "Libur Nasional" : "National Holidays"}
                    </span>
                    <p className="text-[11px] text-white/70 leading-snug">
                      {isId
                        ? "Lonjakan rate +40% di long weekend & peak holiday resmi Indonesia."
                        : "Up to +40% rate surge during Indonesian long weekends & peak holiday seasons."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-[#CBBEA0] block">
                      ✦ {isId ? "0% Fee OTA Direct" : "0% Platform Fee Direct"}
                    </span>
                    <p className="text-[11px] text-white/70 leading-snug">
                      {isId
                        ? "Direct booking lewat SEO Google Kinghouse menghemat potongan komisi platform."
                        : "Direct bookings via Kinghouse Google SEO eliminate 15% platform service cuts."}
                    </p>
                  </div>
                </div>

                {/* Conversion Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                  <Button
                    size="lg"
                    asChild
                    className="flex-1 bg-white text-[#231F1A] hover:bg-[#FAF7F1] hover:text-black font-semibold text-xs uppercase tracking-widest py-6 shadow-xl border-none"
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick({ source: "revenue_calculator", context: selectedSubmarketKey })}
                    >
                      <MessageSquare className="mr-2 h-4 w-4 text-[#25D366]" />
                      {isId ? "Klaim Audit & Konsultasi via WhatsApp" : "Claim Audit & Fast-Track via WhatsApp"}
                    </a>
                  </Button>

                  <Button
                    size="lg"
                    variant="outlineLight"
                    onClick={handlePrintAudit}
                    className="font-semibold text-xs uppercase tracking-widest py-6 border-white/20 text-white hover:bg-white/10"
                  >
                    <Printer className="mr-2 h-4 w-4 text-[#CBBEA0]" />
                    {isId ? "Cetak Lembar Audit (A4)" : "Print Official Audit Sheet (A4)"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
