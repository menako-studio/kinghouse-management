import { randomBytes } from "node:crypto"

// Auth has no built-in fallbacks, so tests provide their own throwaway secrets.
// They are generated fresh on every run and never written anywhere.
process.env.AUTH_SECRET = randomBytes(48).toString("base64")
process.env.ADMIN_PASSWORD = randomBytes(18).toString("base64")
process.env.ADMIN_EMAIL = "info@kinghousemanagement.com"

