import { randomBytes } from "node:crypto"

// Auth has no built-in fallbacks, so tests provide their own throwaway secrets.
// They are generated fresh on every run and never written anywhere.
process.env.AUTH_SECRET = randomBytes(48).toString("base64")
process.env.ADMIN_PASSWORD = randomBytes(18).toString("base64")
process.env.ADMIN_EMAIL = "info@kinghousemanagement.com"

// Calendar feed URLs are env-only; tests use a reserved, non-routable host.
process.env.AIRBNB_ICAL_VERSATILE_STAY = "https://calendar.example.invalid/versatile-stay.ics"
process.env.AIRBNB_ICAL_VERSATILE_EVENTS = "https://calendar.example.invalid/versatile-events.ics"
process.env.AIRBNB_ICAL_SKYHOUSE_TANGERANG = "https://calendar.example.invalid/skyhouse.ics"
process.env.AIRBNB_ICAL_SKYLINE_CIKARANG = "https://calendar.example.invalid/skyline.ics"
