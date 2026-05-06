import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { OrnamentRule } from "@/components/Ornament";
import { publicApi, ApiNotFound } from "@/lib/api";

export const revalidate = 120;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const club = await publicApi.clubById(id);
    return {
      title: club.name ?? "Club",
      description:
        club.description?.slice(0, 200) ??
        `Présentation du club ${club.name ?? ""} à ${club.city ?? ""}.`,
    };
  } catch {
    return { title: "Club" };
  }
}

export default async function ClubPage({ params }: Props) {
  const { id } = await params;
  let club;
  try {
    club = await publicApi.clubById(id);
  } catch (err) {
    if (err instanceof ApiNotFound) notFound();
    throw err;
  }

  const bureau = [
    { role: "Président·e", name: club.president },
    { role: "Vice-président·e", name: club.vicePresident },
    { role: "Secrétaire", name: club.secretaire },
    { role: "Trésorier·ère", name: club.tresorier },
  ].filter((b) => b.name && b.name.trim().length > 0);

  return (
    <Container size="narrow" className="py-12">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/clubs" className="hover:text-accent-red">
          ← Tous les clubs
        </Link>
      </p>

      <header className="mt-6 flex flex-col items-start gap-6 border-b-2 border-ink pb-8 sm:flex-row">
        <div className="flex size-24 shrink-0 items-center justify-center border border-ink bg-paper-deep paper-grain">
          {club.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={club.logoUrl}
              alt=""
              className="size-full object-contain p-2"
            />
          ) : (
            <span aria-hidden className="font-display text-5xl text-ink/60">
              {club.name?.charAt(0) ?? "?"}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
            Club affilié
          </p>
          <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl">
            {club.name ?? "Club"}
          </h1>
          <p className="mt-3 text-ink-soft">
            {[club.address, club.city].filter(Boolean).join(" · ") ||
              "Localisation à venir"}
          </p>
        </div>
      </header>

      <dl className="mt-8 grid gap-6 border border-rule bg-paper-deep paper-grain p-6 sm:grid-cols-3">
        <Stat label="Membres" value={club.membersCount.toLocaleString("fr-FR")} />
        <Stat
          label="Année de fondation"
          value={club.creationDate?.slice(0, 4) ?? "—"}
        />
        <Stat
          label="Site web"
          value={
            club.website ? (
              <a
                href={club.website}
                rel="noreferrer noopener"
                target="_blank"
                className="text-accent-red hover:underline"
              >
                Visiter
              </a>
            ) : (
              "—"
            )
          }
        />
      </dl>

      {club.description ? (
        <>
          <OrnamentRule symbol="◆" />
          <section>
            <h2 className="font-display text-2xl">À propos du club</h2>
            <p className="mt-3 whitespace-pre-line text-ink-soft">
              {club.description}
            </p>
          </section>
        </>
      ) : null}

      {bureau.length > 0 ? (
        <>
          <OrnamentRule symbol="◆" />
          <section>
            <h2 className="font-display text-2xl">Le bureau</h2>
            <ul className="mt-4 divide-y divide-rule border border-rule bg-paper-deep paper-grain">
              {bureau.map((b) => (
                <li
                  key={b.role}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <span className="text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-soft">
                    {b.role}
                  </span>
                  <span className="font-display text-lg">{b.name}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </Container>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[0.65rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl">{value}</dd>
    </div>
  );
}
