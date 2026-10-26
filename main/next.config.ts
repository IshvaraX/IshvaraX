import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Import only the icons actually used instead of the whole react-icons/md index.
    optimizePackageImports: ["react-icons", "react-icons/md", "react-icons/fa6", "react-icons/si"],
  },
};

export default nextConfig;