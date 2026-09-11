import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Villa } from "./types"
import { SITE_CONFIG } from "./constants"

// Geo coordinates for managed Jabodetabek areas
const AREA_GEO: Record<string, { lat: number; lng: number; region: string }> = {
  jagakarsa: { lat: -6.3494, lng: 106.8431, region: "Jakarta Selatan" },
  tangerang: { lat: -6.1783, lng: 106.6319, region: "Tangerang, Banten" },
  palmerah: { lat: -6.2002, lng: 106.7977, region: "Jakarta Barat" },
  cikarang: { lat: -6.3577, lng: 107.1483, region: "Bekasi, Jawa Barat" },
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: "USD" | "IDR" = "USD"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateVacationRentalSchema(villa: Villa, baseUrl = SITE_CONFIG.baseUrl) {

  const geo = AREA_GEO[villa.areaSlug] ?? { lat: -6.2088, lng: 106.8456, region: "DKI Jakarta" }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": villa.seoMeta?.metaTitle ?? `${villa.name} | Kinghouse`,
    "description": villa.editorialDescription.lead,
    "image": villa.gallery.map((g) => g.url),
    "url": `${baseUrl}/locations/${villa.areaSlug}/villas/${villa.slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": villa.location,
      "addressLocality": villa.area,
      "addressRegion": geo.region,
      "addressCountry": "ID",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.lat,
      "longitude": geo.lng,
    },
    "numberOfRooms": villa.capacity.bedrooms,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": villa.capacity.guests,
      "unitText": "person",
    },
    "amenityFeature": villa.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      "name": a.name,
      "value": true,
    })),
    "offers": {
      "@type": "Offer",
      "price": villa.price.idr,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "url": villa.airbnbUrl,
      "validFrom": "2026-01-01",
    },
  }

  if (villa.rating > 0) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": villa.rating,
      "reviewCount": villa.reviewsCount,
      "bestRating": "5.0",
      "worstRating": "1.0",
    }
  }

  return schema
}
