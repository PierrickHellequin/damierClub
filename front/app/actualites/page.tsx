import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { OrnamentRule } from "@/components/Ornament";
import { categoryLabel } from "@/components/CategoryBadge";
import { publicApi, safe } from "@/lib/api";
import type { ArticleCategory, PublicArticleSummary } from "@/types/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toutes les actualités du jeu de dames : résultats, événements, annonces des clubs.",
};

const ALL_CATEGORIES: ArticleCategory[] = [
  "NEWS",
  "RESULTS",
  "EVENTS",
  "TUTORIAL",
  "ANNOUNCEMENT",
];

const PAGE_SIZE = 12;

function isCategory(value: string | undefined): value is ArticleCategory {
  return !!value && (ALL_CATEGORIES as string[]).includes(value);
}

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0) || 0);
  const category = isCategory(params.category) ? params.category : undefined;
  const search = params.search?.trim() || undefined;

  const result = await safe(
    publicApi.listArticles({ page, size: PAGE_SIZE, category, search }),
    {
      content: [] as PublicArticleSummary[],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size: PAGE_SIZE,
      first: true,
      last: true,
      numberOfElements: 0,
      empty: true,
    },
  );

  return (
    <Container className="py-12">
      <header className="border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Rubrique
        </p>
        <h1 className="mt-1 font-display text-5xl">Actualités</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          La chronique des clubs, des tournois et de la vie du jeu de dames.
          Filtrez par rubrique pour ne rien manquer.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2 font-meta text-[0.7rem] uppercase tracking-[0.2em]">
        <FilterPill
          href={buildHref({ search }) }
          active={!category}
        >
          Toutes
        </FilterPill>
        {ALL_CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            href={buildHref({ category: c, search })}
            active={category === c}
          >
            {categoryLabel(c)}
          </FilterPill>
        ))}
      </div>

      {search ? (
        <p className="mt-6 text-sm text-ink-soft">
          Résultats pour <strong className="text-ink">« {search} »</strong>{" "}
          <Link href="/actualites" className="text-accent-red hover:underline">
            (effacer)
          </Link>
        </p>
      ) : null}

      <OrnamentRule symbol="◆" />

      {result.content.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">
          Aucun article ne correspond à ces critères pour l'instant.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.content.map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      )}

      <Pagination
        basePath="/actualites"
        page={result.number}
        totalPages={result.totalPages}
        searchParams={{ category, search }}
      />
    </Container>
  );
}

function buildHref(filters: { category?: ArticleCategory; search?: string }) {
  const sp = new URLSearchParams();
  if (filters.category) sp.set("category", filters.category);
  if (filters.search) sp.set("search", filters.search);
  const qs = sp.toString();
  return qs ? `/actualites?${qs}` : "/actualites";
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as never}
      className={
        "border px-3 py-1 transition-colors " +
        (active
          ? "border-accent-red bg-accent-red text-paper"
          : "border-ink/30 hover:border-accent-red hover:text-accent-red")
      }
    >
      {children}
    </Link>
  );
}
