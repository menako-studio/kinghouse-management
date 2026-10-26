import Script from "next/script"
import { FAQ_CATEGORIES } from "@/lib/faq"
import { contentTranslator } from "@/lib/i18n/content"
import { type SiteLocale } from "@/lib/i18n/site"

/** FAQPage JSON-LD built from the same questions and answers the page shows. */
export function FaqSchema({ locale }: { locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: tx(item.question),
        acceptedAnswer: { "@type": "Answer", text: tx(item.answer) },
      }))
    ),
  }
  return <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
