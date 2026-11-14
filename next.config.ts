import type { NextConfig } from "next";

/**
 * Baseline security headers for every route (public pages, API, static files).
 * proxy.ts only runs on /dashboard and /login, so these are what protect the
 * rest of the site. No script-src CSP: GA/GTM and Next's inline bootstrap need
 * nonces for that; the directives below are safe without them.
 */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Two root layouts (app/(site) = English, app/id = Indonesian) need a global 404.
    globalNotFound: true,
  },
  async headers() {
    // Admin pages and admin APIs carry private data: never store them in a shared cache or index them.
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
    ];
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...["/dashboard", "/dashboard/:path*", "/login", "/api/auth/:path*", "/api/erp/:path*", "/api/cron/:path*"].map((source) => ({
        source,
        headers: privateHeaders,
      })),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
