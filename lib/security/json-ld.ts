/**
 * Serializes structured data for `<script type="application/ld+json">`.
 * JSON.stringify alone does not escape `<`, so a value containing
 * `</script>` (e.g. a CMS article title) would close the tag and inject HTML.
 * Escaping `<`, `>`, `&` and the JS line separators keeps the JSON valid and inert.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028)
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029)

const UNSAFE_JSON_CHARS: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  [LINE_SEPARATOR]: "\\u2028",
  [PARAGRAPH_SEPARATOR]: "\\u2029",
}

const UNSAFE_JSON_PATTERN = new RegExp(`[<>&${LINE_SEPARATOR}${PARAGRAPH_SEPARATOR}]`, "g")

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE_JSON_PATTERN, (ch) => UNSAFE_JSON_CHARS[ch])
}
