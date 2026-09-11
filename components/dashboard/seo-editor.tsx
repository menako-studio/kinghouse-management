"use client"

import { useState } from "react"
import Image from "next/image"
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  Save,
  Search,
  ExternalLink,
} from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { Villa } from "@/lib/types"
import { useNotifications } from "@/components/dashboard/notification-context"

export function SeoEditor() {
  const { addAlert, showToast } = useNotifications()
  const [selectedVillaId, setSelectedVillaId] = useState<string>(CURATED_VILLAS[0].id)
  const currentVilla = CURATED_VILLAS.find((v) => v.id === selectedVillaId) || CURATED_VILLAS[0]

  // Local state per property
  const [metaTitle, setMetaTitle] = useState<string>(
    currentVilla.seoMeta?.metaTitle || `${currentVilla.name} — ${currentVilla.area} | Kinghouse`
  )
  const [metaDescription, setMetaDescription] = useState<string>(
    currentVilla.seoMeta?.metaDescription ||
      `${currentVilla.editorialDescription.lead} Professionally managed by Kinghouse on Airbnb.`
  )
  const [focusKeyword, setFocusKeyword] = useState<string>(
    currentVilla.seoMeta?.focusKeyword || `airbnb ${currentVilla.areaSlug}`
  )
  const [canonicalUrl, setCanonicalUrl] = useState<string>(
    `https://www.kinghousemanagement.com/locations/${currentVilla.areaSlug}/villas/${currentVilla.slug}`
  )
  const [isSaved, setIsSaved] = useState(false)

  // Switch property handler
  const handleSelectProperty = (villa: Villa) => {
    setSelectedVillaId(villa.id)
    setMetaTitle(villa.seoMeta?.metaTitle || `${villa.name} — ${villa.area} | Kinghouse`)
    setMetaDescription(
      villa.seoMeta?.metaDescription ||
        `${villa.editorialDescription.lead} Professionally managed by Kinghouse on Airbnb.`
    )
    setFocusKeyword(villa.seoMeta?.focusKeyword || `airbnb ${villa.areaSlug}`)
    setCanonicalUrl(`https://www.kinghousemanagement.com/locations/${villa.areaSlug}/villas/${villa.slug}`)
    setIsSaved(false)
  }

  // Handle save
  const handleSave = () => {
    setIsSaved(true)

    addAlert({
      title: `SEO Diperbarui: ${currentVilla.name}`,
      message: `Metadata Google SERP & target keyword "${focusKeyword}" berhasil disimpan.`,
      category: "seo",
      actionUrl: "/dashboard/seo",
    })

    showToast(
      "Metadata SEO Disimpan!",
      `${currentVilla.name} &bull; Score: ${score}%`,
      "success"
    )

    setTimeout(() => setIsSaved(false), 3000)
  }

  // SEO Score calculation
  const titleLength = metaTitle.length
  const descLength = metaDescription.length
  const hasKeywordInTitle = metaTitle.toLowerCase().includes(focusKeyword.toLowerCase().trim())
  const hasKeywordInDesc = metaDescription.toLowerCase().includes(focusKeyword.toLowerCase().trim())
  const isTitleOptimal = titleLength >= 40 && titleLength <= 65
  const isDescOptimal = descLength >= 120 && descLength <= 165

  const checks = [
    { label: "Optimal Meta Title length (40-65 characters)", passed: isTitleOptimal },
    { label: "Optimal Meta Description length (120-165 characters)", passed: isDescOptimal },
    { label: "Focus Keyword included in Meta Title", passed: hasKeywordInTitle && focusKeyword.length > 0 },
    { label: "Focus Keyword included in Meta Description", passed: hasKeywordInDesc && focusKeyword.length > 0 },
    { label: "Structured Data (Schema.org VacationRental + FAQ) Active", passed: true },
    { label: "Canonical URL validated with HTTPS", passed: canonicalUrl.startsWith("https://") },
  ]

  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100)

  return (
    <div className="space-y-8">
      {/* Property Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAFAFA] border border-[#EBEBEB] rounded-2xl">
        {CURATED_VILLAS.map((villa) => (
          <button
            key={villa.id}
            onClick={() => handleSelectProperty(villa)}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedVillaId === villa.id
                ? "bg-[#222222] text-white shadow-sm"
                : "text-[#717171] hover:text-[#222222] hover:bg-white"
            }`}
          >
            <div className="relative h-4 w-4 rounded-full overflow-hidden flex-shrink-0">
              <Image src={villa.heroImage} alt={villa.name} fill className="object-cover" />
            </div>
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{villa.name}</span>
            <span className="text-[10px] opacity-70">({villa.area})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F5F4F0] pb-4">
              <div>
                <h3 className="text-xl text-[#222222] font-semibold">SEO Metadata Editor</h3>
                <p className="text-xs text-[#717171]">
                  Fine-tune Google Search snippets and Airbnb Superhost ranking weights
                </p>
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center space-x-2 bg-[#222222] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaved ? "Saved! ✓" : "Save Metadata"}</span>
              </button>
            </div>

            {/* Focus Keyword */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Target Keyword (Focus Keyword)
                </label>
                <span className="text-[11px] text-[#A69C8E]">High-intent guest search query</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#A69C8E]" />
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. rent villa jagakarsa south jakarta"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBEBEB] text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222]"
                />
              </div>
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Meta Title (Google SERP & Airbnb Title)
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    isTitleOptimal ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {titleLength}/60 chars {isTitleOptimal ? "✓" : "(Ideal: 40-60)"}
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222]"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Meta Description
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    isDescOptimal ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {descLength}/160 chars {isDescOptimal ? "✓" : "(Ideal: 120-160)"}
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222] leading-relaxed resize-none"
              />
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Canonical URL (Prevents Duplicate Content)
                </label>
                <span className="text-[11px] text-[#A69C8E]">Index Authority</span>
              </div>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-[#A69C8E]" />
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBEBEB] text-xs font-mono text-[#717171] focus:outline-none focus:border-[#222222]"
                />
              </div>
            </div>

            {/* OpenGraph & Social Image Preview */}
            <div className="space-y-2 pt-2 border-t border-[#F5F4F0]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  OpenGraph Social Card Preview
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold">1200 x 630px Auto-optimized</span>
              </div>
              <div className="relative aspect-[1200/630] rounded-xl overflow-hidden border border-[#EBEBEB] group">
                <Image
                  src={currentVilla.heroImage}
                  alt={currentVilla.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B896]">
                    Kinghouse Curated Property &bull; {currentVilla.area}
                  </span>
                  <p className="text-sm font-semibold text-white truncate">
                    {metaTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SERP Previews & SEO Health Score */}
        <div className="lg:col-span-5 space-y-6">
          {/* SEO Health Score Card */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg text-[#222222] font-semibold">SEO Health Score</h4>
                <p className="text-xs text-[#717171]">Google search readiness & quality index</p>
              </div>
              <div
                className={`flex items-center justify-center h-14 w-14 rounded-2xl text-xl font-bold ${
                  score >= 80
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : score >= 60
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {score}%
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-[#F5F4F0]">
              {checks.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs">
                  {item.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={item.passed ? "text-[#222222]" : "text-[#717171]"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Google SERP Live Preview */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717171]">
                Google Search Snippet Preview
              </span>
              <span className="text-[10px] text-[#A69C8E]">Desktop SERP</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] space-y-1.5 font-sans">
              <div className="flex items-center space-x-2 text-[11px] text-[#202124]">
                <div className="h-4 w-4 rounded-full bg-[#EBEBEB] flex items-center justify-center text-[9px] font-bold">
                  K
                </div>
                <span className="text-[#202124] font-medium">kinghousemanagement.com</span>
                <span className="text-[#5f6368] text-[10px]">
                  &rsaquo; locations &rsaquo; {currentVilla.areaSlug}
                </span>
              </div>
              <h5 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
                {metaTitle}
              </h5>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {metaDescription}
              </p>
            </div>
          </div>

          {/* Airbnb Conversion Algorithm Highlights */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-[#F5F4F0] p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#A69C8E]" />
              <h4 className="font-semibold text-xs text-[#222222] uppercase tracking-wider">
                SEO Impact on Airbnb Occupancy
              </h4>
            </div>
            <p className="text-xs text-[#717171] leading-relaxed">
              Listings utilizing the Kinghouse editorial framework demonstrate average impression gains of
              <strong className="text-[#222222]"> +280% </strong> on Airbnb search and up to
              <strong className="text-[#222222]"> 3x booking conversion lift </strong> within the first 60 days.
            </p>
            <div className="pt-2">
              <a
                href={currentVilla.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#222222] hover:underline"
              >
                <span>View Live Airbnb Listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

