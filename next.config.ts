import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // On-demand optimization in `next dev` was delaying the first paint for many seconds.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
