import type { Metadata } from "next";

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
    "student developers",
    "open source collaboration",
    "coding mentorship",
    "PINAKA",
    "AI",
    "Brain-Computer Interface",
  ],
  twitter: "@ishvarax",
  ogImage: "/icon.jpg",
  social: [
    "https://github.com/ishvarax",
    "https://x.com/ishvarax",
    "https://www.linkedin.com/company/ishvarax",
    "https://www.instagram.com/ishvarax",
    "https://www.youtube.com/@ishvarax",
  ],
} as const;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: PageMeta): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    keywords: keywords ? [...siteConfig.keywords, ...keywords] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
      ...(type === "article" ? { publishedTime, modifiedTime, tags, authors: [siteConfig.name] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
  };
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function fetchPublic<T>(path: string, revalidate = 600): Promise<T | null> {
  try {
    const res = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function excerpt(markdown: string, max = 160): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 80))}…`;
}
