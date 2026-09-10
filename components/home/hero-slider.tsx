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

type SceneMode = "lifestyle" | "architecture"

interface VideoSource {
  title: string
  subtitle: string
  tag: string
  desktop: string
  mobile: string
  description: string
}

const SCENE_DATA: Record<SceneMode, VideoSource> = {
  lifestyle: {
    title: "The Living Sanctuary Experience",
    subtitle: "Versatile House • Jagakarsa, Jakarta Selatan",
    tag: "✦ Lifestyle Experience",
    desktop: "/properties/versatile-house/talent-act-comp.mp4",
    mobile: "/properties/versatile-house/talent-act-vertical.mp4",
    description: "An intimate escape where tropical warmth, laughter, and private poolside moments seamlessly unite.",
  },
  architecture: {
    title: "Architectural Serenity & Greenery",
    subtitle: "Versatile House • Jagakarsa, Jakarta Selatan",
    tag: "🏛 Architectural View",
    desktop: "/properties/versatile-house/empty.mp4",
    mobile: "/properties/versatile-house/empty-vertical.mp4",
    description: "500m² private botanical grounds, double-height living halls, and uncompromised privacy in South Jakarta.",
  },
}

const POSTER_IMAGE = "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"

export function HeroSlider() {
  const [scene, setScene] = useState<SceneMode>("lifestyle")
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentScene = SCENE_DATA[scene]

  // Detect viewport dynamically so only ONE video stream is ever fetched (cuts bandwidth by 50MB+)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const videoSrc = isMobile ? currentScene.mobile : currentScene.desktop

  // Play / Pause Toggle
  const togglePlayPause = () => {
    const nextState = !isPlaying
    setIsPlaying(nextState)

    if (videoRef.current) {
      if (nextState) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }

  // Handle scene change or viewport change and ensure smooth autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      if (isPlaying) {
        videoRef.current.play().catch(() => {})
      }
    }
  }, [videoSrc, isPlaying])

  return (
    <section className="relative min-h-[660px] sm:min-h-screen sm:h-screen w-full overflow-hidden bg-[#0D0D0E] select-none">
      {/* 1. Poster Image Placeholder (eliminates black flash before video load) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Image
          src={POSTER_IMAGE}
          alt="KingHouse Luxury Hospitality Background"
          fill
          priority
          className="object-cover brightness-[0.55]"
        />
      </div>

      {/* 2. Responsive HTML5 Background Video (loads ONLY matching viewport video stream with preload="metadata") */}
      <video
        ref={videoRef}
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={POSTER_IMAGE}
        onLoadedData={() => setIsLoaded(true)}
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.62] contrast-[1.05] transition-opacity duration-700"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

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
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-[11px] font-medium tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#E8DFC8] backdrop-blur-md shadow-2xl">
            <Sparkles className="h-3 w-3 text-[#B8934C]" />
            <span>KingHouse Curated Residences • Jabodetabek</span>
          </div>

          {/* Quick Scene Pill Badge (Desktop View) */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8934C] animate-pulse" />
            <span className="font-light tracking-wide">{currentScene.title}</span>
          </div>
        </div>

        {/* Center Main Headline & Dual Conversion Call-to-Action */}
        <div className="max-w-4xl space-y-4 sm:space-y-8 my-auto pt-4 sm:pt-6">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-light tracking-[0.22em] sm:tracking-[0.25em] uppercase text-[#DFC58E]">
              Extraordinary Hospitality & Asset Management
            </p>
            <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal leading-[1.08] sm:leading-[1.06] tracking-tight text-white drop-shadow-md">
              Curated Villas, <br />
              <span className="italic font-light text-[#EFEBE4]">
                Managed to Perfection.
              </span>
            </h1>
          </div>

          <p className="max-w-2xl text-xs sm:text-lg text-white/85 font-light leading-relaxed drop-shadow">
            Immerse in architectural retreats across South Jakarta, Tangerang, Palmerah, and Cikarang — paired with institutional-grade asset management delivering superior yield for property owners.
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
                <span>Explore Villas (B2C)</span>
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
                <span>Partner With Us (B2B)</span>
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
                onClick={() => setScene("lifestyle")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  scene === "lifestyle"
                    ? "bg-[#B8934C] text-white shadow-sm font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Film className="h-3 w-3" />
                <span>Lifestyle</span>
              </button>

              <button
                onClick={() => setScene("architecture")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  scene === "architecture"
                    ? "bg-[#B8934C] text-white shadow-sm font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>Architecture</span>
              </button>
            </div>
          </div>

          {/* Center: Scroll Down Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
            <span>Scroll to Discover</span>
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
              <span className="text-[10px] sm:text-[11px] text-white/70 uppercase tracking-wider font-light">
                Jagakarsa, Jakarta Selatan &bull; 12 Guests &bull; 5BR Private Pool
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
