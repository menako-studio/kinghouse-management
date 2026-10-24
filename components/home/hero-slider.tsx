"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Compass,
  Building2,
  Film,
} from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"

type SceneMode = "lifestyle" | "architecture"

interface VideoSource {
  title: string
  subtitle: string
  tag: string
  desktop: string
  mobile: string
  description: string
}

// Web-optimized renditions (H.264, 24fps, faststart, no audio track).
// Mobile files are pre-cropped to a portrait ratio so phones never download pixels they can't display.
const SCENE_DATA: Record<SceneMode, VideoSource> = {
  lifestyle: {
    title: "The Living Sanctuary Experience",
    subtitle: "Versatile House • Jagakarsa, Jakarta Selatan",
    tag: "✦ Lifestyle Experience",
    desktop: "/properties/versatile-house/web/lifestyle-desktop.mp4",
    mobile: "/properties/versatile-house/web/lifestyle-mobile.mp4",
    description: "An intimate escape where tropical warmth, laughter, and private poolside moments seamlessly unite.",
  },
  architecture: {
    title: "Architectural Serenity & Greenery",
    subtitle: "Versatile House • Jagakarsa, Jakarta Selatan",
    tag: "🏛 Architectural View",
    desktop: "/properties/versatile-house/web/architecture-desktop.mp4",
    mobile: "/properties/versatile-house/web/architecture-mobile.mp4",
    description: "500m² private botanical grounds, double-height living halls, and uncompromised privacy in South Jakarta.",
  },
}

const POSTER_IMAGE = "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.webp"
const MOBILE_QUERY = "(max-width: 767px)"

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string }

/** Respect Data Saver and very slow connections — the still hero image is shown instead. */
function isConstrainedNetwork(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  if (!connection) return false
  return Boolean(connection.saveData) || ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "")
}

export function HeroSlider() {
  const { t } = useLocalization()
  const [scene, setScene] = useState<SceneMode>("lifestyle")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  // `null` until the client decides which rendition to stream. The video is never part of the
  // server-rendered HTML, so the hero image is the only above-the-fold media competing for bandwidth
  // during the critical rendering path (LCP).
  const [videoVariant, setVideoVariant] = useState<"mobile" | "desktop" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentScene = SCENE_DATA[scene]

  // Deferred, viewport-aware video activation:
  // - Desktop/tablet: after the window `load` event + browser idle time.
  // - Mobile: on the first user interaction (scroll / touch / key), so phones on cellular data
  //   render the optimized hero image instantly and only stream video when the visitor engages.
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    let cancelled = false
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined

    const activate = () => {
      if (cancelled) return
      cancelled = true
      cleanupListeners()
      setVideoVariant(mql.matches ? "mobile" : "desktop")
    }

    const interactionEvents: (keyof WindowEventMap)[] = ["scroll", "touchstart", "pointerdown", "keydown"]
    const cleanupListeners = () => {
      interactionEvents.forEach((evt) => window.removeEventListener(evt, activate))
      window.removeEventListener("load", scheduleIdle)
    }

    const scheduleIdle = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      }
      if (w.requestIdleCallback) {
        idleHandle = w.requestIdleCallback(activate, { timeout: 3000 })
      } else {
        timeoutHandle = setTimeout(activate, 1500)
      }
    }

    if (isConstrainedNetwork()) {
      return
    }

    if (mql.matches) {
      interactionEvents.forEach((evt) => window.addEventListener(evt, activate, { once: true, passive: true }))
    } else if (document.readyState === "complete") {
      scheduleIdle()
    } else {
      window.addEventListener("load", scheduleIdle, { once: true })
    }

    return () => {
      cancelled = true
      cleanupListeners()
      const w = window as Window & { cancelIdleCallback?: (handle: number) => void }
      if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle)
      if (timeoutHandle) clearTimeout(timeoutHandle)
    }
  }, [])

  const videoSrc = videoVariant ? currentScene[videoVariant] : null

  const changeScene = (nextScene: SceneMode) => {
    if (nextScene === scene) return
    setIsLoaded(false)
    setScene(nextScene)
  }

  // Play / Pause Toggle
  const togglePlayPause = () => {
    // Allow an explicit "play" tap to start streaming even before the deferred trigger fires.
    if (!videoVariant) {
      setIsPlaying(true)
      setVideoVariant(window.matchMedia(MOBILE_QUERY).matches ? "mobile" : "desktop")
      return
    }

    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false))
    } else {
      video.pause()
    }
  }

  // Handle scene change or rendition activation and ensure smooth autoplay
  useEffect(() => {
    if (!videoSrc || !videoRef.current) return
    videoRef.current.play()?.catch(() => setIsPlaying(false))
  }, [videoSrc])

  return (
    <section className="relative h-[660px] sm:h-[84vh] md:h-screen w-full overflow-hidden bg-black select-none">
      {/* 1. Optimized hero image (LCP element) — always server-rendered */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Image
          src={POSTER_IMAGE}
          alt="Versatile House Jagakarsa — private pool villa managed by Kinghouse Management"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover brightness-[0.75]"
        />
      </div>

      {/* 2. Responsive Native HTML5 Background Video (client-only, deferred) */}
      {videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className={`absolute inset-0 z-0 h-full w-full object-cover brightness-[0.82] contrast-[1.05] transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* 3. Nakula-Style Luxury Gradients & Vignette Overlays */}
      {/* Top soft shadow for navbar legibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/75 via-black/20 to-transparent pointer-events-none" />
      {/* Bottom deep gradient for content & dock legibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      {/* Radial subtle luxury vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.55)_100%)] pointer-events-none" />

      {/* 4. Luxury Content Container */}
      <div className="relative z-20 mx-auto flex h-full min-h-[660px] sm:min-h-screen max-w-7xl flex-col justify-between px-5 pt-20 pb-8 sm:px-10 sm:pt-28 sm:pb-12 lg:px-12 lg:pt-32 lg:pb-12">
        {/* Top Eyebrow Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-xs font-medium tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#E8DFC8] backdrop-blur-md shadow-2xl">
              <Sparkles className="h-3 w-3 text-[#B8934C]" />
              <span>{t("curatedResidencesJabodetabek")}</span>
            </div>

            {/* Official Airbnb Superhost Pill */}
            <a
              href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#DFC58E]/50 bg-black/50 hover:bg-black/75 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-xs font-semibold text-[#DFC58E] backdrop-blur-md shadow-xl transition-all hover:scale-105 cursor-pointer"
              title="Official Airbnb Superhost Profile — Kinghouse Management"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Airbnb Superhost</span>
              <span className="text-xs text-white/80 font-normal">★ 4.5 &bull; 10 Reviews ↗</span>
            </a>
          </div>

          {/* Quick Scene Pill Badge (Desktop View) */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8934C] animate-pulse" />
            <span className="font-light tracking-wide">{currentScene.title}</span>
          </div>
        </div>

        {/* Center Main Headline & Dual Conversion Call-to-Action */}
        <div className="max-w-4xl space-y-4 sm:space-y-8 my-auto pt-4 sm:pt-6">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-light tracking-[0.22em] sm:tracking-[0.25em] uppercase text-[#DFC58E]">
              {t("extraordinaryHospitality")}
            </p>
            <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal leading-[1.08] sm:leading-[1.06] tracking-tight text-white drop-shadow-md">
              {t("curatedVillasTitle")} <br />
              <span className="italic font-light text-[#EFEBE4]">
                {t("managedToPerfection")}
              </span>
            </h1>
          </div>

          <p className="max-w-2xl text-xs sm:text-lg text-white/85 font-light leading-relaxed drop-shadow">
            {t("heroDescription")}
          </p>

          {/* Dual Conversion CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-[#19191B] hover:bg-[#FAF8F5] hover:text-black border-none font-semibold text-xs uppercase tracking-[0.16em] px-6 sm:px-8 py-3.5 sm:py-6 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/villas" className="flex items-center justify-center gap-2">
                <Compass className="h-4 w-4 text-[#8C7F5F]" />
                <span>{t("exploreVillasB2C")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 bg-black/30 hover:bg-white/15 text-white hover:text-white font-medium text-xs uppercase tracking-[0.16em] px-6 sm:px-8 py-3.5 sm:py-6 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/owner-services" className="flex items-center justify-center gap-2">
                <Building2 className="h-4 w-4 text-[#DFC58E]" />
                <span>{t("partnerWithUsB2B")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Dock: Controls, Scene Mode Switcher, & Property Spec */}
        <div className="border-t border-white/20 pt-4 sm:pt-6 mt-4 sm:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 text-white pb-2 sm:pb-0">
          {/* Left: Interactive Scene Switcher & Playback Control */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Play / Pause Toggle Button */}
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/25 bg-black/40 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200"
              aria-label={isPlaying ? "Pause background video" : "Play background video"}
              title={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
              )}
            </button>

            {/* Scene Selector Pill: Lifestyle vs Architecture */}
            <div className="inline-flex rounded-full border border-white/20 bg-black/50 p-1 backdrop-blur-md">
              <button
                onClick={() => changeScene("lifestyle")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  scene === "lifestyle"
                    ? "bg-[#B8934C] text-white shadow-sm font-semibold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <Film className="h-3 w-3" />
                <span>{t("lifestyle")}</span>
              </button>

              <button
                onClick={() => changeScene("architecture")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  scene === "architecture"
                    ? "bg-[#B8934C] text-white shadow-sm font-semibold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>{t("architecture")}</span>
              </button>
            </div>
          </div>

          {/* Center: Scroll Down Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
            <span>{t("scrollToDiscover")}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#DFC58E] animate-bounce" />
          </div>

          {/* Right: Featured Villa Information & Link */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex flex-col text-left md:text-right">
              <Link
                href="/villas/versatile-house-jagakarsa"
                className="group flex items-center gap-1.5 font-serif text-sm text-white hover:text-[#DFC58E] transition-colors"
              >
                <span>Versatile House With Garden</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
              <span className="text-xs sm:text-xs text-white/70 uppercase tracking-wider font-light">
                Jagakarsa, Jakarta Selatan &bull; 12 Guests &bull; 5BR Private Pool
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
