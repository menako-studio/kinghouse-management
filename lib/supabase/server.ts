import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ""

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("your-project-ref")
)

export const SUPABASE_SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || "public"

/**
 * PostgREST answers 406 "Invalid schema: x" when a configured schema is not in
 * Supabase's "Exposed schemas". The repo's SQL lives in `public`, so when a
 * stale NEXT_PUBLIC_SUPABASE_SCHEMA (e.g. "kinghouse") points somewhere that is
 * not exposed, retry the same request against `public` instead of failing.
 */
export const FALLBACK_SCHEMA = "public"

export async function fetchWithSchemaFallback(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init)
  if (SUPABASE_SCHEMA === FALLBACK_SCHEMA || res.status !== 406) return res

  const body = await res.clone().text().catch(() => "")
  if (!body.includes("Invalid schema")) return res

  const headers = new Headers(init?.headers)
  if (headers.has("Accept-Profile")) headers.set("Accept-Profile", FALLBACK_SCHEMA)
  if (headers.has("Content-Profile")) headers.set("Content-Profile", FALLBACK_SCHEMA)
  console.warn(
    `[supabase] schema "${SUPABASE_SCHEMA}" is not exposed; retrying on "${FALLBACK_SCHEMA}". ` +
      `Set NEXT_PUBLIC_SUPABASE_SCHEMA=public in Vercel to silence this.`
  )
  return fetch(input, { ...init, headers })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serverClient: SupabaseClient<any, any, any> | null = null

/**
 * Returns a server-side Supabase client singleton
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseServerClient(): SupabaseClient<any, any, any> | null {
  if (!isSupabaseConfigured) {
    return null
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: SUPABASE_SCHEMA,
      },
      global: {
        fetch: fetchWithSchemaFallback,
      },
    })
  }

  return serverClient
}
