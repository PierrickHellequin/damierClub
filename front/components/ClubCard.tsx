import Link from "next/link";
import type { PublicClubSummary } from "@/types/api";

export function ClubCard({ club }: { club: PublicClubSummary }) {
  const href = `/clubs/${club.id}` as const;
  return (
    <Link
      href={href as never}
      className="group flex items-center gap-4 border border-rule bg-paper-deep paper-grain p-5 transition-colors hover:border-accent-red"
    >
      <div className="flex size-14 shrink-0 items-center justify-center border border-ink/30 bg-paper">
        {club.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.logoUrl}
            alt=""
            className="size-full object-contain p-1"
          />
        ) : (
          <span aria-hidden className="font-display text-2xl text-ink/60">
            {club.name?.charAt(0) ?? "?"}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight group-hover:text-accent-red">
          {club.name}
        </p>
        <p className="mt-0.5 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
          {club.city ?? "—"} · {club.membersCount ?? 0} membres
        </p>
      </div>
      <span aria-hidden className="font-display text-xl text-ink-mute group-hover:text-accent-red">
        →
      </span>
    </Link>
  );
}
