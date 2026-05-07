import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { GameView } from "@/components/dames/GameView";

export const metadata: Metadata = {
  title: "Partie libre",
  description: "Partie de dames à deux joueurs sur le même écran.",
};

export default function PartieLibrePage() {
  return (
    <Container size="wide" className="py-10">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/jouer" className="hover:text-accent-red">
          ← Retour à la salle de jeu
        </Link>
      </p>
      <header className="mt-4 border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Deux joueurs
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Partie libre</h1>
        <p className="mt-3 text-ink-soft">
          Deux joueurs, un seul plateau. À chaque trait, le bord rouge indique
          la couleur qui doit jouer. Les coups légaux apparaissent en vert
          quand on sélectionne un pion.
        </p>
      </header>
      <div className="mt-8">
        <GameView ai={{ mode: "two-players" }} />
      </div>
    </Container>
  );
}
