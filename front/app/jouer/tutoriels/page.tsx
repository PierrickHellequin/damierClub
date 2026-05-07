import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { OrnamentRule } from "@/components/Ornament";
import { publicApi, safe } from "@/lib/api";
import type { PublicArticleSummary, SpringPage } from "@/types/api";

export const metadata: Metadata = {
  title: "Tutoriels",
  description:
    "Les bases du jeu de dames, les règles, les pièges classiques — par les rédacteurs des clubs.",
};

export const revalidate = 120;

const EMPTY_PAGE: SpringPage<PublicArticleSummary> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 0,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
};

const FALLBACK_TUTORIALS = [
  {
    title: "Les règles du jeu",
    eyebrow: "Démarrer",
    body:
      "Damier 10×10, vingt pions par camp, déplacement diagonal, prise par-dessus l'adversaire. La rafle maximale est obligatoire : la prise la plus longue prime. Un pion qui finit son trajet sur la rangée d'arrivée devient une dame.",
  },
  {
    title: "Les coups de base",
    eyebrow: "Apprendre",
    body:
      "L'ouverture privilégie le centre. Évitez de laisser un pion seul en territoire adverse. Un pion défendu par un autre devient redoutable. Les dames sont fortes mais ne sauvent pas une partie déjà perdue par un pion en moins.",
  },
  {
    title: "Les pièges classiques",
    eyebrow: "Approfondir",
    body:
      "Le coup du forgeron, la prise au triangle, les rafles enchaînées : ces motifs reviennent dans presque chaque partie. Apprenez à les voir AVANT que l'adversaire ne les pose.",
  },
];

export default async function TutorielsPage() {
  const result = await safe(
    publicApi.listArticles({ category: "TUTORIAL", size: 12 }),
    EMPTY_PAGE,
  );

  return (
    <Container className="py-10">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/jouer" className="hover:text-accent-red">
          ← Retour à la salle de jeu
        </Link>
      </p>
      <header className="mt-4 border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Apprendre
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Tutoriels</h1>
        <p className="mt-3 text-ink-soft">
          Les guides et tutoriels publiés par les clubs. Pour les bases
          essentielles, retrouvez aussi les fiches ci-dessous.
        </p>
      </header>

      {result.content.length > 0 ? (
        <>
          <OrnamentRule symbol="◆" />
          <h2 className="font-display text-2xl">Publiés par les clubs</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.content.map((a) => (
              <ArticleCard key={a.id} article={a} variant="standard" />
            ))}
          </div>
        </>
      ) : null}

      <OrnamentRule symbol="◆" />

      <section>
        <h2 className="font-display text-2xl">Les fondamentaux</h2>
        <p className="mt-2 text-ink-soft">
          Trois fiches courtes pour démarrer ou réviser, indépendamment de ce
          que les clubs publient.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {FALLBACK_TUTORIALS.map((t) => (
            <article
              key={t.title}
              className="border border-rule bg-paper-deep paper-grain p-6"
            >
              <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
                {t.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl">{t.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{t.body}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
