import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OrnamentRule } from "@/components/Ornament";
import { Pagination } from "@/components/Pagination";
import { PlayerCard } from "@/components/PlayerCard";
import { publicApi, safe } from "@/lib/api";
import type {
  PublicClubSummary,
  PublicPlayerSummary,
  SpringPage,
} from "@/types/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Annuaire des joueurs",
  description:
    "Annuaire public des joueurs des clubs affiliés. Classement par points ELO et filtre par club.",
};

const PAGE_SIZE = 30;

const EMPTY_PAGE: SpringPage<PublicPlayerSummary> = {
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

const EMPTY_CLUBS: SpringPage<PublicClubSummary> = {
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

export default async function JoueursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0) || 0);
  const clubId = params.clubId?.trim() || undefined;

  const [result, clubs] = await Promise.all([
    safe(publicApi.listPlayers({ page, size: PAGE_SIZE, clubId }), EMPTY_PAGE),
    safe(publicApi.listClubs({ size: 200 }), EMPTY_CLUBS),
  ]);

  const startRank = page * PAGE_SIZE;

  return (
    <Container className="py-12">
      <header className="border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Annuaire
        </p>
        <h1 className="mt-1 font-display text-5xl">Joueurs</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          {result.totalElements > 0
            ? `${result.totalElements.toLocaleString("fr-FR")} joueurs licenciés actifs, classés par points ELO.`
            : "L'annuaire des joueurs sera disponible dès qu'un club aura inscrit ses membres."}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2 font-meta text-[0.7rem] uppercase tracking-[0.2em]">
        <FilterPill href={"/joueurs"} active={!clubId}>
          Tous les clubs
        </FilterPill>
        {clubs.content.map((c) => (
          <FilterPill
            key={c.id}
            href={`/joueurs?clubId=${encodeURIComponent(c.id)}`}
            active={clubId === c.id}
          >
            {c.name ?? "Club"}
          </FilterPill>
        ))}
      </div>

      <OrnamentRule symbol="◆" />

      {result.content.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">
          Aucun joueur ne correspond à ce filtre pour l&apos;instant.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {result.content.map((p, i) => (
            <PlayerCard key={p.id} player={p} rank={startRank + i + 1} />
          ))}
        </div>
      )}

      <Pagination
        basePath="/joueurs"
        page={result.number}
        totalPages={result.totalPages}
        searchParams={{ clubId }}
      />
    </Container>
  );
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
