# Security Policy

This repository is public. It must never contain secrets, credentials, guest/owner data or database dumps.

## Reporting a vulnerability
Use GitHub's **Report a vulnerability** (Security tab → private advisory). Please do not open public issues for security problems.

## Rules for contributors
- All secrets (Supabase service role key, `CRON_SECRET`, API keys) live only in Vercel / Supabase environment settings, never in git.
- Only `*.example` env files with placeholder values may be committed.
- Admin and cron endpoints must verify auth server-side (`lib/auth-server`).
- Supabase tables must keep Row Level Security enabled.
