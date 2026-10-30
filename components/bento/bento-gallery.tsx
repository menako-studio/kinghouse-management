"use client"

import { useState } from "react"
import Image from "next/image"
import { Grid, Sparkles } from "lucide-react"
import { PhotoLightboxModal } from "./photo-lightbox-modal"
import { useLocalization } from "@/lib/context/localization-context"

interface BentoGalleryProps {
  images: {
    url: string
    caption: string
    category: "exterior" | "living" | "bedroom" | "pool" | "bathroom" | "dining" | "garden" | "kitchen"
  }[]
  propertyName: string
}

export function BentoGallery({ images, propertyName }: BentoGalleryProps) {
  const { tc } = useLocalization()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsLightboxOpen(true)
  }

  // Ensure we have at least 5 images for the 1 + 4 grid layout
  const primaryImage = images[0]
  const secondaryImages = images.slice(1, 5)

  return (
    <>
      <div className="relative">
        {/* Bento Grid: 1 Large Left, 4 Smaller 2x2 Right */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-2.5 h-[340px] sm:h-[420px] md:h-[480px] lg:h-[560px] overflow-hidden rounded-xl">
          {/* Main Hero Image (Left 2 columns on desktop) */}
          <div
            onClick={() => openLightbox(0)}
            className="group relative md:col-span-2 h-full cursor-pointer overflow-hidden bg-[#EBEBEB]"
          >
            <Image
              src={primaryImage.url}
              alt={primaryImage.caption ? tc(primaryImage.caption) : propertyName}
              fill
              loading="eager"
              fetchPriority="high"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            <span className="sr-only">{tc("View primary photo")}</span>
          </div>

          {/* Secondary 2x2 Grid (Right 2 columns on desktop) */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2 md:gap-2.5 h-full">
            {secondaryImages.map((image, index) => {
              const photoIdx = index + 1
              return (
                <div
                  key={photoIdx}
                  onClick={() => openLightbox(photoIdx)}
                  className="group relative h-full cursor-pointer overflow-hidden bg-[#EBEBEB]"
                >
                  <Image
                    src={image.url}
                    alt={image.caption ? tc(image.caption) : `${propertyName} ${photoIdx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  <span className="sr-only">{tc("View photo {n}", { n: photoIdx + 1 })}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* "View all photos" button overlay */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 rounded-lg border border-[#222222] bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#222222] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
        >
          <Grid className="h-3.5 w-3.5" />
          <span>{tc("Show all {count} photos", { count: images.length })}</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        initialIndex={selectedPhotoIndex}
        propertyName={propertyName}
      />
    </>
  )
}
