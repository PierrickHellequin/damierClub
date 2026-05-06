import type { MetadataRoute } from "next";
import { publicApi, safe } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  const [articlesPage, clubsPage] = await Promise.all([
    safe(publicApi.listArticles({ size: 100 }), null),
    safe(publicApi.listClubs({ size: 200 }), null),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/actualites`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/clubs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/a-propos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap =
    articlesPage?.content.map((a) => ({
      url: `${base}/actualites/${a.slug}`,
      lastModified: a.publishedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  const clubRoutes: MetadataRoute.Sitemap =
    clubsPage?.content.map((c) => ({
      url: `${base}/clubs/${c.id}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })) ?? [];

  return [...staticRoutes, ...articleRoutes, ...clubRoutes];
}
