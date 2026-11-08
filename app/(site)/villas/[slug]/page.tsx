import { notFound, permanentRedirect } from "next/navigation"
import { CURATED_VILLAS } from "@/lib/data"

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

export default async function VillaCanonicalPage({ params }: PageProps) {
  const resolvedParams = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === resolvedParams.slug)

  if (!villa) {
    notFound()
  }

  // 308 Permanent redirect to the canonical localized URL for Local SEO authority
  permanentRedirect(`/locations/${villa.areaSlug}/villas/${villa.slug}`)
}

