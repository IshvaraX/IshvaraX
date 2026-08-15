// Central site metadata used for SEO (layout, sitemap, robots, JSON-LD).
export const siteConfig = {
  name: "IshvaraX",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ishvarax.vercel.app",
  title: "IshvaraX — A community for people who love to code",
  description:
    "IshvaraX is a community for the upliftment of people who love to code — learn, collaborate, and build real freelance projects together. PINAKA is our separate, independent research side project.",
  keywords: [
    "IshvaraX",
    "coding community",
    "learn to code",
    "freelance coding projects",
    "open collaboration",
    "developer community",
    "programming projects",
    "PINAKA",
    "AI",
    "Brain-Computer Interface",
  ],
  twitter: "@ishvarax",
} as const;
