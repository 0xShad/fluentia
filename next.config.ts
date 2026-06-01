import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  // Exclude browser-only WebRTC packages from the server bundle.
  // @daily-co/daily-js (pulled in by @vapi-ai/web) crashes webpack workers
  // when Next.js tries to compile it server-side.
  serverExternalPackages: ["@daily-co/daily-js", "@vapi-ai/web"],

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
