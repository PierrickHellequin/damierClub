import type {
  ArticleCategory,
  PublicArticle,
  PublicArticleSummary,
  PublicClub,
  PublicClubSummary,
  PublicStats,
  SpringPage,
} from "@/types/api";

const API_BASE_INTERNAL =
  process.env.API_BASE_INTERNAL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:8090";

type FetchOptions = {
  // ISR / cache control. Default: 60s revalidation.
  revalidate?: number | false;
  // Forward query params; null/undefined entries are dropped.
  query?: Record<string, string | number | boolean | null | undefined>;
};

async function apiGet<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = new URL(path, API_BASE_INTERNAL.endsWith("/") ? API_BASE_INTERNAL : API_BASE_INTERNAL + "/");
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === null || v === undefined || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const revalidate = opts.revalidate ?? 60;
  const res = await fetch(url.toString(), {
    next: revalidate === false ? { revalidate: 0 } : { revalidate },
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    throw new ApiNotFound(`Not found: ${url.pathname}`);
  }
  if (!res.ok) {
    throw new ApiError(`API ${res.status} on ${url.pathname}`);
  }
  return (await res.json()) as T;
}

export class ApiError extends Error {}
export class ApiNotFound extends ApiError {}

export const publicApi = {
  listArticles(params: {
    page?: number;
    size?: number;
    category?: ArticleCategory;
    search?: string;
  } = {}) {
    return apiGet<SpringPage<PublicArticleSummary>>("/api/public/articles", {
      query: {
        page: params.page,
        size: params.size,
        category: params.category,
        search: params.search,
      },
    });
  },

  featuredArticles() {
    return apiGet<PublicArticleSummary[]>("/api/public/articles/featured");
  },

  recentArticles(limit = 5) {
    return apiGet<PublicArticleSummary[]>("/api/public/articles/recent", {
      query: { limit },
    });
  },

  articleCategories() {
    return apiGet<ArticleCategory[]>("/api/public/articles/categories");
  },

  articleBySlug(slug: string) {
    // No revalidation cache to keep view counter fresh; ISR is anyway not
    // critical here since article content rarely changes.
    return apiGet<PublicArticle>(`/api/public/articles/${encodeURIComponent(slug)}`, {
      revalidate: 30,
    });
  },

  listClubs(params: { page?: number; size?: number } = {}) {
    return apiGet<SpringPage<PublicClubSummary>>("/api/public/clubs", {
      query: { page: params.page, size: params.size },
    });
  },

  clubById(id: string) {
    return apiGet<PublicClub>(`/api/public/clubs/${encodeURIComponent(id)}`);
  },

  stats() {
    return apiGet<PublicStats>("/api/public/stats", { revalidate: 300 });
  },
};

// Helper used by pages to gracefully handle a missing API.
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}
