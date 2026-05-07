import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { EloChart } from "@/components/EloChart";
import { OrnamentRule } from "@/components/Ornament";
import { ApiNotFound, publicApi, safe } from "@/lib/api";
import type {
  PublicEloPoint,
  PublicTournamentResult,
} from "@/types/api";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

const CLUB_ROLE_LABEL: Record<string, string> = {
  PRESIDENT: "Président·e",
  VICE_PRESIDENT: "Vice-président·e",
  SECRETAIRE: "Secrétaire",
  TRESORIER: "Trésorier·ère",
  MEMBRE: "Membre",
};

function fullName(p: { firstName: string | null; lastName: string | null }): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || "Joueur";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await publicApi.playerById(id);
    return {
      title: fullName(p),
      description:
        `${fullName(p)} — joueur de dames ${p.clubName ? `du club ${p.clubName}` : ""}, ${p.currentPoints ?? "?"} points ELO.`.trim(),
    };
  } catch {
    return { title: "Joueur" };
  }
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;

  let player;
  try {
    player = await publicApi.playerById(id);
  } catch (err) {
    if (err instanceof ApiNotFound) notFound();
    throw err;
  }

  const [history, palmares] = await Promise.all([
    safe(publicApi.playerEloHistory(id), [] as PublicEloPoint[]),
    safe(publicApi.playerTournaments(id), [] as PublicTournamentResult[]),
  ]);

  const palmaresDesc = [...palmares].reverse();

  return (
    <Container size="narrow" className="py-12">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/joueurs" className="hover:text-accent-red">
          ← Annuaire des joueurs
        </Link>
      </p>

      <header className="mt-6 border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Profil
        </p>
        <h1 className="mt-1 font-display text-5xl">{fullName(player)}</h1>
        <p className="mt-3 text-ink-soft">
          {player.clubName ? (
            <>
              Club{" "}
              {player.clubId ? (
                <Link
                  href={`/clubs/${player.clubId}`}
                  className="text-accent-red hover:underline"
                >
                  {player.clubName}
                </Link>
              ) : (
                player.clubName
              )}
              {player.clubRole && player.clubRole !== "MEMBRE" ? (
                <> · {CLUB_ROLE_LABEL[player.clubRole] ?? player.clubRole}</>
              ) : null}
            </>
          ) : (
            "Sans club"
          )}
          {player.city ? ` · ${player.city}` : ""}
        </p>
      </header>

      <dl className="mt-8 grid gap-4 border border-rule bg-paper-deep paper-grain p-6 sm:grid-cols-3">
        <Stat
          label="Points ELO"
          value={player.currentPoints?.toLocaleString("fr-FR") ?? "—"}
          accent
        />
        <Stat
          label="Classement"
          value={player.ranking ? `#${player.ranking}` : "—"}
        />
        <Stat
          label="Tournois joués"
          value={player.totalTournaments.toLocaleString("fr-FR")}
        />
        <Stat
          label="Victoires"
          value={player.totalVictories.toLocaleString("fr-FR")}
        />
        <Stat
          label="Nuls"
          value={player.totalDraws.toLocaleString("fr-FR")}
        />
        <Stat
          label="Défaites"
          value={player.totalDefeats.toLocaleString("fr-FR")}
        />
        <Stat
          label="Taux de victoire"
          value={player.winRate != null ? `${player.winRate.toFixed(1)} %` : "—"}
        />
        <Stat
          label="Pic de carrière"
          value={player.highestPoints?.toLocaleString("fr-FR") ?? "—"}
        />
        <Stat
          label="Plus bas"
          value={player.lowestPoints?.toLocaleString("fr-FR") ?? "—"}
        />
      </dl>

      <OrnamentRule symbol="◆" />

      <section>
        <h2 className="font-display text-3xl">Évolution ELO</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Chaque point représente une mise à jour des points : tournoi, ronde
          interclubs ou ajustement.
        </p>
        <div className="mt-5">
          <EloChart points={history} />
        </div>
      </section>

      <OrnamentRule symbol="◆" />

      <section>
        <h2 className="font-display text-3xl">Palmarès</h2>
        {palmaresDesc.length === 0 ? (
          <p className="mt-3 text-ink-soft italic">
            {`Aucune participation à un tournoi enregistrée.`}
          </p>
        ) : (
          <ol className="mt-5 divide-y divide-rule border border-rule bg-paper-deep paper-grain">
            {palmaresDesc.map((p, i) => (
              <li
                key={`${p.tournamentId}-${i}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight">
                    {p.tournamentName ?? "Tournoi"}
                  </p>
                  <p className="mt-1 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
                    {formatTournamentDate(p.tournamentDate)}
                    {p.tournamentLocation ? ` · ${p.tournamentLocation}` : ""}
                    {p.victories != null
                      ? ` · ${p.victories}V / ${p.draws ?? 0}N / ${p.defeats ?? 0}D`
                      : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {p.place ? (
                    <p className="font-display text-xl text-accent-red">
                      {p.place}
                    </p>
                  ) : null}
                  {p.pointsChange != null ? (
                    <p
                      className={
                        "text-[0.75rem] font-meta uppercase tracking-[0.15em] " +
                        (p.pointsChange >= 0
                          ? "text-accent-green"
                          : "text-accent-red")
                      }
                    >
                      {p.pointsChange >= 0 ? "+" : ""}
                      {p.pointsChange} pts
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Container>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-[0.65rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        {label}
      </dt>
      <dd
        className={
          "mt-1 font-display text-2xl " + (accent ? "text-accent-red" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}

function formatTournamentDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
