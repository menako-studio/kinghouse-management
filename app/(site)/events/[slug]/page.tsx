import type { Metadata } from "next"
import { VILLA_EVENTS } from "@/lib/data"
import { EventDetailView, eventDetailMetadata } from "@/components/pages/event-detail-view"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return VILLA_EVENTS.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return eventDetailMetadata(slug, "en")
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <EventDetailView slug={slug} locale="en" />
}
