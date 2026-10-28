import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f2ecee",
    theme_color: "#6442d6",
    categories: ["education", "productivity", "social"],
    icons: [
      { src: "/logo-blue-orange.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/icon.jpg", sizes: "1200x630", type: "image/jpeg" },
    ],
  };
}
