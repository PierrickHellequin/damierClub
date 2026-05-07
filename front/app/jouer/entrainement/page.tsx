import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { publicApi, safe } from "@/lib/api";
import { BUILTIN_EXERCISES } from "@/lib/dames/exercises";
import type { PublicExercise } from "@/types/api";
import { EntrainementClient } from "./EntrainementClient";

export const metadata: Metadata = {
  title: "Entraînement",
  description: "Petites combinaisons à résoudre pour s'entraîner aux dames.",
};

export const revalidate = 120;

export default async function EntrainementPage() {
  const remote = await safe(publicApi.listExercises(), [] as PublicExercise[]);
  const merged = [
    // Remote first (they're authored content), built-ins fill in the gaps.
    ...remote.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? "",
      position: e.position,
      sideToPlay: e.sideToPlay,
      difficulty: e.difficulty,
      solution: e.solution ?? "",
      solutionMoves: e.solutionMoves ?? undefined,
    })),
    ...BUILTIN_EXERCISES,
  ];

  return (
    <Container size="wide" className="py-10">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        <Link href="/jouer" className="hover:text-accent-red">
          ← Retour à la salle de jeu
        </Link>
      </p>
      <header className="mt-4 border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Combinaisons
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Entraînement</h1>
        <p className="mt-3 text-ink-soft">
          Sélectionnez une position. À vous de trouver le coup gagnant.
          Cliquez sur « Voir la solution » si vous séchez.
        </p>
      </header>
      <div className="mt-8">
        <EntrainementClient exercises={merged} />
      </div>
    </Container>
  );
}
