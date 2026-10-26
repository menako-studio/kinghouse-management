import { EventsVenueSchema } from "@/components/pages/events-schema"

export default function IdEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EventsVenueSchema locale="id" />
      {children}
    </>
  )
}
