import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ClubCard } from "@/components/ClubCard";
import { Pagination } from "@/components/Pagination";
import { OrnamentRule } from "@/components/Ornament";
import { publicApi, safe } from "@/lib/api";
import type { PublicClubSummary } from "@/types/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Annuaire des clubs",
  description:
    "Liste des clubs de jeu de dames affiliés. Trouvez un club près de chez vous.",
};

const PAGE_SIZE = 24;

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0) || 0);

  const result = await safe(
    publicApi.listClubs({ page, size: PAGE_SIZE }),
    {
      content: [] as PublicClubSummary[],
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
          Annuaire
        </p>
        <h1 className="mt-1 font-display text-5xl">Les clubs affiliés</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          {result.totalElements > 0
            ? `${result.totalElements.toLocaleString("fr-FR")} clubs recensés à travers toute la fédération.`
            : "Aucun club n'est encore référencé."}
        </p>
      </header>

      <OrnamentRule symbol="◆" />

      {result.content.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">
          La liste arrive bientôt — l'annuaire est en cours de constitution.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.content.map((c) => (
            <ClubCard key={c.id} club={c} />
          ))}
        </div>
      )}

      <Pagination
        basePath="/clubs"
        page={result.number}
        totalPages={result.totalPages}
      />
    </Container>
  );
}
