import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Two root layouts (app/(site) = English, app/id = Indonesian) need a global 404.
    globalNotFound: true,
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
