import type { Metadata } from "next"
import { CURATED_VILLAS } from "@/lib/data"
import { VillaDetailView, villaMetadata } from "@/components/pages/villa-detail-view"

interface PageProps {
  params: Promise<{ area: string; slug: string }>
}

export async function generateStaticParams() {
  return CURATED_VILLAS.map((villa) => ({ area: villa.areaSlug, slug: villa.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return villaMetadata(slug, "id")
}

export default async function IdVillaDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <VillaDetailView slug={slug} locale="id" />
}
