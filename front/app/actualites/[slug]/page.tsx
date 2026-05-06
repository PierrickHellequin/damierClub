import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CategoryBadge, categoryLabel } from "@/components/CategoryBadge";
import { OrnamentRule } from "@/components/Ornament";
import { ArticleCard } from "@/components/ArticleCard";
import { publicApi, safe, ApiNotFound } from "@/lib/api";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import {
  formatArticleDate,
  formatArticleDateFull,
  formatRelative,
} from "@/lib/format";
import type { PublicArticleSummary } from "@/types/api";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await publicApi.articleBySlug(slug);
    return {
      title: article.title,
      description: article.excerpt ?? undefined,
      openGraph: {
        title: article.title,
        description: article.excerpt ?? undefined,
        images: article.coverImage ? [article.coverImage] : undefined,
        type: "article",
        publishedTime: article.publishedAt ?? undefined,
      },
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;
  try {
    article = await publicApi.articleBySlug(slug);
  } catch (err) {
    if (err instanceof ApiNotFound) notFound();
    throw err;
  }

  const recent = await safe(publicApi.recentArticles(6), [] as PublicArticleSummary[]);
  const related = recent.filter((a) => a.id !== article.id).slice(0, 3);

  const html = sanitizeArticleHtml(article.content);
  const author = [article.author?.firstName, article.author?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <article>
      <Container size="narrow" className="pt-12">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
          <Link href="/actualites" className="hover:text-accent-red">
            ← Toutes les actualités
          </Link>
        </p>
        <header className="mt-6 border-b-2 border-ink pb-6">
          <CategoryBadge category={article.category} />
          <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-6xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-5 text-xl italic text-ink-soft">
              {article.excerpt}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] font-meta uppercase tracking-[0.2em] text-ink-soft">
            <span>{formatArticleDateFull(article.publishedAt)}</span>
            {author ? (
              <span>
                Par <span className="text-ink">{author}</span>
              </span>
            ) : null}
            <span aria-hidden>·</span>
            <span>{article.viewCount.toLocaleString("fr-FR")} lectures</span>
            {article.publishedAt ? (
              <span className="text-ink-mute">
                {formatRelative(article.publishedAt)}
              </span>
            ) : null}
          </div>
        </header>
      </Container>

      {article.coverImage ? (
        <Container size="narrow" className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt=""
            className="w-full border border-ink/15 object-cover"
          />
          <p className="mt-2 text-center text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
            {categoryLabel(article.category)} —{" "}
            {formatArticleDate(article.publishedAt)}
          </p>
        </Container>
      ) : null}

      <Container size="narrow" className="mt-10">
        <div
          className="prose-paper drop-cap"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {article.tags && article.tags.length > 0 ? (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-rule pt-6 font-meta text-[0.7rem] uppercase tracking-[0.2em]">
            <span className="text-ink-soft">Mots-clés :</span>
            {article.tags.map((t) => (
              <span
                key={t}
                className="border border-ink/30 px-2 py-0.5 text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </Container>

      {related.length > 0 ? (
        <>
          <OrnamentRule symbol="◆ ◆ ◆" />
          <Container className="pb-4">
            <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
              À lire aussi
            </p>
            <h2 className="mt-1 mb-6 font-display text-3xl">Du même journal</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} variant="standard" />
              ))}
            </div>
          </Container>
        </>
      ) : null}
    </article>
  );
}
