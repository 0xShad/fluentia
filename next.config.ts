import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js Image optimization for external avatar/photo domains
    remotePatterns: [
      { protocol: "https", hostname: "scontent.fmnl17-3.fna.fbcdn.net" },
      { protocol: "https", hostname: "scontent.fmnl17-7.fna.fbcdn.net" },
      { protocol: "https", hostname: "i.guim.co.uk" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Catch-all for any additional Facebook CDN subdomains
      { protocol: "https", hostname: "*.fbcdn.net" },
    ],
    // Cache optimized images for 30 days (in seconds)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Prefer modern formats
    formats: ["image/avif", "image/webp"],
  },

  // Compress HTTP responses
  compress: true,

  // Strict mode for better runtime performance in prod
  reactStrictMode: true,
};

export default nextConfig;
