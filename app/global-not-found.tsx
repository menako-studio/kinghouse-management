import type { Metadata } from "next"
import { RootDocument } from "@/components/layout/root-document"
import NotFound from "@/app/(site)/not-found"

export const metadata: Metadata = {
  title: "Page Not Found | Kinghouse Management",
  robots: { index: false, follow: true },
}

/**
 * 404 for URLs that match no route. The app has two root layouts (English in
 * app/(site), Indonesian in app/id), so the global 404 renders its own document.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFound />
    </RootDocument>
  )
}
