import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

// Guard: fails the build when a credential is committed again. Secrets belong in
// environment variables (Vercel settings / .env.local), never in the repository.
const RULES: { name: string; pattern: RegExp }[] = [
  { name: "Airbnb iCal URL with private token", pattern: /airbnb\.com\/calendar\/ical\/\d+\.ics\?t=[0-9a-f]{8,}/i },
  { name: "JWT / Supabase key", pattern: /eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/ },
  { name: "Private key block", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "Stripe / generic live secret key", pattern: /\b(?:sk_live|rk_live)_[0-9a-zA-Z]{16,}/ },
  { name: "Hard-coded password literal", pattern: /\b(?:password|passwd|secret)\s*[:=]\s*["'](?!<)[^"'\s]{8,}["']/i },
  { name: "Env fallback to a literal secret", pattern: /process\.env\.(?:\w*(?:PASSWORD|SECRET|TOKEN|KEY)\w*)\s*\|\|\s*["'][^"']+["']/ },
]

// Fixtures that intentionally contain fake credentials to test rejection paths.
const ALLOWED_FILES = new Set(["tests/no-hardcoded-secrets.test.ts", "tests/pen-testing-security.test.ts", "tests/validation-security.test.ts"])

// Owner decision: the Airbnb iCal tokens and guest WiFi passwords below are kept in
// the repository on purpose (they are already in git history). Remove this list
// when they move to environment variables again.
const ACCEPTED_EXPOSURE = new Set(["lib/data.ts", "lib/guest-guide/data.ts"])

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter((f) => /\.(ts|tsx|mts|js|mjs|json|md|sql|ya?ml|env\.\w+|example)$/.test(f) && !/package-lock\.json$/.test(f))
}

describe("repository contains no committed secrets", () => {
  it("has no credential patterns in tracked files", () => {
    const hits: string[] = []
    for (const file of trackedFiles()) {
      if (ALLOWED_FILES.has(file) || ACCEPTED_EXPOSURE.has(file)) continue
      const text = readFileSync(file, "utf8")
      for (const rule of RULES) {
        const m = text.match(rule.pattern)
        if (m) hits.push(`${file}: ${rule.name} (${m[0].slice(0, 40)}…)`)
      }
    }
    expect(hits).toEqual([])
  })

  it("does not track real .env files", () => {
    const env = trackedFiles().filter((f) => /(^|\/)\.env(\.[\w-]+)?$/.test(f) && !f.endsWith(".example"))
    expect(env).toEqual([])
  })
})
