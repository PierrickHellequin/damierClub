import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { ClubCard } from "@/components/ClubCard";
import { OrnamentRule } from "@/components/Ornament";
import { PlayerCard } from "@/components/PlayerCard";
import { StatBlock } from "@/components/StatBlock";
import { publicApi, safe } from "@/lib/api";
import type {
  PublicArticleSummary,
  PublicClubSummary,
  PublicPlayerSummary,
  PublicStats,
} from "@/types/api";

export const revalidate = 60;

const EMPTY_CLUBS_PAGE = {
  content: [] as PublicClubSummary[],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 0,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
};

const EMPTY_STATS: PublicStats = {
  totalClubs: 0,
  totalMembers: 0,
  totalPublishedArticles: 0,
};

export default async function HomePage() {
  const [recent, featured, clubsPage, stats, topPlayers] = await Promise.all([
    safe(publicApi.recentArticles(6), [] as PublicArticleSummary[]),
    safe(publicApi.featuredArticles(), [] as PublicArticleSummary[]),
    safe(publicApi.listClubs({ size: 6 }), EMPTY_CLUBS_PAGE),
    safe(publicApi.stats(), EMPTY_STATS),
    safe(publicApi.topPlayers(3), [] as PublicPlayerSummary[]),
  ]);

  const lead = featured[0] ?? recent[0];
  const followUps = (lead ? recent.filter((a) => a.id !== lead.id) : recent).slice(0, 4);
  const featuredRest = featured.filter((a) => a.id !== lead?.id).slice(0, 3);

  return (
    <>
      <Container className="py-12">
        {lead ? (
          <ArticleCard article={lead} variant="lead" />
        ) : (
          <EmptyHero />
        )}

        {(featuredRest.length > 0 || followUps.length > 0) && (
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <SectionTitle eyebrow="La rédaction" title="À suivre cette semaine" />
              {followUps.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {followUps.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="standard" />
                  ))}
                </div>
              ) : (
                <p className="text-ink-soft">Pas encore d'article publié.</p>
              )}
            </section>
            <aside>
              <SectionTitle eyebrow="En vedette" title="À la une" />
              {featuredRest.length > 0 ? (
                <div className="space-y-5">
                  {featuredRest.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft">
                  Aucun article épinglé pour le moment.
                </p>
              )}
            </aside>
          </div>
        )}
      </Container>

      <OrnamentRule symbol="◆ ◆ ◆" />

      <section className="bg-paper-deep paper-grain border-y border-rule">
        <Container className="py-14">
          <div className="grid gap-10 sm:grid-cols-3">
            <StatBlock label="Clubs affiliés" value={stats.totalClubs} />
            <StatBlock label="Joueurs actifs" value={stats.totalMembers} />
            <StatBlock label="Articles publiés" value={stats.totalPublishedArticles} />
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle eyebrow="Annuaire" title="Quelques clubs" className="mb-0" />
          <Link
            href="/clubs"
            className="text-[0.7rem] font-meta uppercase tracking-[0.2em] text-accent-red hover:underline"
          >
            {`Voir tout l'annuaire →`}
          </Link>
        </div>
        {clubsPage.content.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubsPage.content.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-ink-soft">Aucun club enregistré pour le moment.</p>
        )}
      </Container>

      {topPlayers.length > 0 ? (
        <Container className="pb-14">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Hall of fame"
              title="Au sommet du classement"
              className="mb-0"
            />
            <Link
              href="/joueurs"
              className="text-[0.7rem] font-meta uppercase tracking-[0.2em] text-accent-red hover:underline"
            >
              {`Voir tous les joueurs →`}
            </Link>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {topPlayers.slice(0, 3).map((p, i) => (
              <PlayerCard key={p.id} player={p} rank={i + 1} />
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}

function EmptyHero() {
  return (
    <section className="border border-dashed border-rule bg-paper-deep p-16 text-center">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Édition en préparation
      </p>
      <h2 className="mt-3 font-display text-4xl">
        La une du Damier vous attend
      </h2>
      <p className="mt-4 text-ink-soft">
        Aucun article n'a encore été publié. Reviens d'ici peu pour la première
        édition.
      </p>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <header className={"mb-6 border-b border-ink pb-2 " + (className ?? "")}>
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-display text-3xl leading-tight">{title}</h2>
    </header>
  );
}
