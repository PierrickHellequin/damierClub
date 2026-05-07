import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PublicPlayerSummary } from "@/types/api";

export function PlayerCard({
  player,
  rank,
}: {
  player: PublicPlayerSummary;
  rank?: number;
}) {
  const fullName =
    [player.firstName, player.lastName].filter(Boolean).join(" ").trim() ||
    "Joueur sans nom";
  const href = `/joueurs/${player.id}` as const;
  return (
    <Link
      href={href as never}
      className="group flex items-center gap-4 border border-rule bg-paper-deep paper-grain p-5 transition-colors hover:border-accent-red"
    >
      {rank ? (
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center border font-display text-xl",
            rank <= 3
              ? "border-accent-red bg-accent-red text-paper"
              : "border-ink/30 text-ink-soft",
          )}
        >
          {rank}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight group-hover:text-accent-red">
          {fullName}
        </p>
        <p className="mt-0.5 truncate text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
          {player.clubName ?? "Sans club"}
          {player.city ? ` · ${player.city}` : ""}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-2xl text-accent-red">
          {player.currentPoints?.toLocaleString("fr-FR") ?? "—"}
        </p>
        <p className="text-[0.65rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
          {player.ranking ? `Classement ${player.ranking}` : "Points ELO"}
        </p>
      </div>
    </Link>
  );
}
