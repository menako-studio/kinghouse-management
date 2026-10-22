"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Grid, Share2 } from "lucide-react"

interface PhotoLightboxModalProps {
  isOpen: boolean
  onClose: () => void
  images: {
    url: string
    caption: string
    category: string
  }[]
  initialIndex?: number
  propertyName: string
}

export function PhotoLightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  propertyName,
}: PhotoLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [lastInitialIndex, setLastInitialIndex] = useState(initialIndex)

  // Reset to the requested photo when the modal is reopened at a new index.
  // Adjusting state during render (React's recommended pattern) avoids a
  // set-state-in-effect round-trip.
  if (initialIndex !== lastInitialIndex) {
    setLastInitialIndex(initialIndex)
    setCurrentIndex(initialIndex)
  }

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") nextPhoto()
      if (e.key === "ArrowLeft") prevPhoto()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, nextPhoto, prevPhoto, onClose])

  if (!isOpen) return null

  const current = images[currentIndex]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white text-[#222222] animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-[#EBEBEB] px-6 lg:px-12 bg-white">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 rounded-full p-2 text-[#222222] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Close photo gallery"
        >
          <X className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
            Close Gallery
          </span>
        </button>

        <div className="text-center">
          <p className="font-serif text-sm text-[#222222] font-medium">{propertyName}</p>
          <p className="text-xs text-[#717171]">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-wider text-[#A69C8E] font-medium px-2 py-1 bg-[#FAFAFA] rounded-md border border-[#EBEBEB]">
            {current.category}
          </span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex flex-1 items-center justify-center bg-[#FAFAFA] p-4 lg:p-12 overflow-hidden select-none">
        {/* Navigation Buttons */}
        <button
          onClick={prevPhoto}
          className="absolute left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md text-[#222222] hover:bg-white hover:scale-105 transition-all border border-[#EBEBEB]"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextPhoto}
          className="absolute right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md text-[#222222] hover:bg-white hover:scale-105 transition-all border border-[#EBEBEB]"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Hero Photo Display */}
        <div className="relative max-h-[75vh] w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-lg shadow-sm border border-[#EBEBEB] bg-black">
          <Image
            src={current.url}
            alt={current.caption || `${propertyName} photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Caption & Thumbnail Strip */}
      <div className="border-t border-[#EBEBEB] bg-white p-4">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#717171] italic text-center md:text-left">
            &ldquo;{current.caption}&rdquo;
          </p>

          {/* Thumbnails */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded border transition-all ${
                  idx === currentIndex
                    ? "border-[#222222] ring-2 ring-[#222222]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
