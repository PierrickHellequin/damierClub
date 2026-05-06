import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import { formatArticleDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PublicArticleSummary } from "@/types/api";

type Variant = "lead" | "standard" | "compact";

export function ArticleCard({
  article,
  variant = "standard",
}: {
  article: PublicArticleSummary;
  variant?: Variant;
}) {
  const href = `/actualites/${article.slug}` as const;
  const author =
    article.author?.firstName || article.author?.lastName
      ? `${article.author.firstName ?? ""} ${article.author.lastName ?? ""}`.trim()
      : null;

  if (variant === "lead") {
    return (
      <article className="grid gap-8 border-b border-rule pb-10 lg:grid-cols-5">
        {article.coverImage ? (
          <Link
            href={href as never}
            className="lg:col-span-2 block overflow-hidden border border-ink/15"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </Link>
        ) : null}
        <div
          className={cn(
            "flex flex-col justify-center",
            article.coverImage ? "lg:col-span-3" : "lg:col-span-5",
          )}
        >
          <CategoryBadge category={article.category} />
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            <Link href={href as never} className="hover:text-accent-red">
              {article.title}
            </Link>
          </h2>
          {article.excerpt ? (
            <p className="mt-4 text-ink-soft">{article.excerpt}</p>
          ) : null}
          <p className="mt-5 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
            {formatArticleDate(article.publishedAt)}
            {author ? ` · ${author}` : ""}
          </p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="border-b border-rule pb-4 last:border-b-0 last:pb-0">
        <CategoryBadge category={article.category} />
        <h3 className="mt-2 font-display text-lg leading-snug">
          <Link href={href as never} className="hover:text-accent-red">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 text-[0.65rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
          {formatArticleDate(article.publishedAt)}
        </p>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col border border-rule bg-paper-deep paper-grain p-6">
      {article.coverImage ? (
        <Link
          href={href as never}
          className="mb-5 -mx-6 -mt-6 block overflow-hidden border-b border-ink/15"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt=""
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </Link>
      ) : null}
      <CategoryBadge category={article.category} />
      <h3 className="mt-3 font-display text-2xl leading-tight">
        <Link href={href as never} className="hover:text-accent-red">
          {article.title}
        </Link>
      </h3>
      {article.excerpt ? (
        <p className="mt-3 line-clamp-3 text-sm text-ink-soft">
          {article.excerpt}
        </p>
      ) : null}
      <p className="mt-auto pt-4 text-[0.65rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
        {formatArticleDate(article.publishedAt)}
        {author ? ` · ${author}` : ""}
      </p>
    </article>
  );
}
