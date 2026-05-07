import Link from "next/link";
import { Container } from "./Container";
import { CheckeredBand } from "./CheckeredBand";

const NAV = [
  { href: "/", label: "Une" },
  { href: "/actualites", label: "Actualités" },
  { href: "/clubs", label: "Clubs" },
  { href: "/joueurs", label: "Joueurs" },
  { href: "/jouer", label: "Jouer" },
  { href: "/a-propos", label: "À propos" },
] as const;

function todayLabel() {
  const d = new Date();
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function Masthead() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <Container>
        <div className="flex items-center justify-between py-3 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-soft">
          <span className="hidden sm:inline">Édition du {todayLabel()}</span>
          <span aria-hidden>—</span>
          <span>Fédération · Jeu de dames</span>
        </div>
      </Container>
      <CheckeredBand />
      <Container>
        <div className="py-10 text-center">
          <p className="text-[0.7rem] font-meta uppercase tracking-[0.4em] text-ink-soft">
            Le Damier · N°{new Date().getFullYear()}
          </p>
          <h1 className="mt-2 font-display text-5xl sm:text-7xl leading-[0.95]">
            <Link href="/" className="hover:text-accent-red transition-colors">
              Damier Club
            </Link>
          </h1>
          <p className="mt-3 italic text-ink-soft">
            « Tout ce qui se joue, se note, se publie — depuis nos clubs. »
          </p>
        </div>
      </Container>
      <CheckeredBand />
      <nav aria-label="Navigation principale" className="border-y border-ink/30">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-3 text-sm font-meta uppercase tracking-[0.2em]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink hover:text-accent-red transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
