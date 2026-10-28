import type { MetadataRoute } from "next";
import { fetchPublic, siteConfig } from "@/lib/site";

type Post = { id: string; createdAt: number };
type Project = { createdAt: number };

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, projects] = await Promise.all([
    fetchPublic<Post[]>("/blogs", 3600),
    fetchPublic<Project[]>("/projects", 3600),
  ]);

  const latestProject = projects?.length
    ? new Date(Math.max(...projects.map((p) => p.createdAt)))
    : now;
  const latestPost = posts?.length ? new Date(Math.max(...posts.map((p) => p.createdAt))) : now;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/projects`, lastModified: latestProject, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/learnings`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${siteConfig.url}/blog/${p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
