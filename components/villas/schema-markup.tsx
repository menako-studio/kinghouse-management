import { Villa } from "@/lib/types"
import { generateVacationRentalSchema } from "@/lib/utils"
import { serializeJsonLd } from "@/lib/security/json-ld"

interface SchemaMarkupProps {
  villa: Villa
}

export function SchemaMarkup({ villa }: SchemaMarkupProps) {
  const schema = generateVacationRentalSchema(villa)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}
