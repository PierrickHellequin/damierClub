import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OrnamentRule } from "@/components/Ornament";

export const metadata: Metadata = {
  title: "Jouer aux dames",
  description:
    "Jouez aux dames depuis votre navigateur : partie libre, contre l'ordinateur, exercices de combinaisons et tutoriels.",
};

const MODES = [
  {
    href: "/jouer/libre",
    title: "Partie libre",
    eyebrow: "Deux joueurs",
    description:
      "Un seul écran, à tour de rôle. Idéal pour rejouer une position à plusieurs.",
    glyph: "♔",
  },
  {
    href: "/jouer/contre-ordi",
    title: "Contre l'ordinateur",
    eyebrow: "Solo",
    description:
      "Trois niveaux : facile pour débuter, moyen pour rejouer une combinaison, difficile pour se faire bouger.",
    glyph: "♛",
  },
  {
    href: "/jouer/entrainement",
    title: "Entraînement",
    eyebrow: "Combinaisons",
    description:
      "Petits problèmes : trouver la rafle gagnante en un coup ou deux. Niveau progressif.",
    glyph: "✦",
  },
  {
    href: "/jouer/tutoriels",
    title: "Tutoriels",
    eyebrow: "Apprendre",
    description:
      "Les bases du jeu, les règles, les ouvertures connues, expliquées par les rédacteurs des clubs.",
    glyph: "❦",
  },
] as const;

export default function JouerPage() {
  return (
    <Container className="py-12">
      <header className="border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          La salle de jeu
        </p>
        <h1 className="mt-1 font-display text-5xl">Jouer aux dames</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Toutes les parties suivent les règles internationales (10×10), avec
          la rafle maximale obligatoire en vigueur à la FFJD.
        </p>
      </header>

      <OrnamentRule symbol="◆" />

      <div className="grid gap-6 sm:grid-cols-2">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href as never}
            className="group flex items-start gap-5 border border-rule bg-paper-deep paper-grain p-6 transition-colors hover:border-accent-red"
          >
            <span
              aria-hidden
              className="font-display text-5xl text-accent-red transition-transform group-hover:scale-110"
            >
              {m.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
                {m.eyebrow}
              </p>
              <h2 className="mt-1 font-display text-2xl">{m.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{m.description}</p>
              <p className="mt-3 font-meta text-[0.7rem] uppercase tracking-[0.2em] text-accent-red">
                Commencer →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
