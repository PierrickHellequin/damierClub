import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { VsAi } from "./VsAi";

export const metadata: Metadata = {
  title: "Contre l'ordinateur",
  description:
    "Affrontez l'ordinateur à un niveau facile, moyen ou difficile. Règles FFJD.",
};

export default function VsAiPage() {
  return (
    <Container size="wide" className="py-10">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/jouer" className="hover:text-accent-red">
          ← Retour à la salle de jeu
        </Link>
      </p>
      <header className="mt-4 border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Solo
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">
          Contre l'ordinateur
        </h1>
        <p className="mt-3 text-ink-soft">
          Choisissez votre couleur et le niveau de l'ordinateur. Annuler permet
          de revenir d'un demi-coup à chaque fois (les deux derniers coups en
          mode solo, pour pouvoir rejouer la même position).
        </p>
      </header>
      <div className="mt-8">
        <VsAi />
      </div>
    </Container>
  );
}
