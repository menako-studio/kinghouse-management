import { notFound, redirect } from "next/navigation"
import { CURATED_VILLAS } from "@/lib/data"
import VillaDetailPage from "@/app/locations/[area]/villas/[slug]/page"

import { Metadata } from "next"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return CURATED_VILLAS.map((villa) => ({
    slug: villa.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === resolvedParams.slug)

  if (!villa) {
    return { title: "Property Not Found | Kinghouse Management" }
  }

  const title = villa.seoMeta?.metaTitle ?? `${villa.name} — ${villa.area} | Kinghouse Management`
  const description =
    villa.seoMeta?.metaDescription ??
    `${villa.editorialDescription.lead} Professionally managed by Kinghouse Management on Airbnb.`
  const canonicalUrl = `/locations/${villa.areaSlug}/villas/${villa.slug}`

  return {
    title,
    description,
    keywords: villa.seoMeta
      ? [villa.seoMeta.focusKeyword, villa.area, "airbnb", "Kinghouse Management", "King House", "short stay villa"]
      : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [{ url: villa.seoMeta?.ogImage ?? villa.heroImage, width: 1200, height: 800, alt: villa.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [villa.seoMeta?.ogImage ?? villa.heroImage],
    },
  }
}

export default async function VillaCanonicalPage({ params }: PageProps) {
  const resolvedParams = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === resolvedParams.slug)

  if (!villa) {
    notFound()
  }

  // Delegate rendering with area prop for full consistency
  return (
    <VillaDetailPage
      params={Promise.resolve({
        area: villa.areaSlug,
        slug: villa.slug,
      })}
    />
  )
}
