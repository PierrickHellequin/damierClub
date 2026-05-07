"use client";

import { useMemo, useState } from "react";
import { ExerciseRunner } from "@/components/dames/ExerciseRunner";
import { decodeBoard } from "@/lib/dames/notation";
import { cn } from "@/lib/cn";
import type { Exercise } from "@/lib/dames/exercises";
import type { GameState } from "@/lib/dames/types";

interface Props {
  exercises: Exercise[];
}

const DIFFICULTY_LABEL = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
} as const;

export function EntrainementClient({ exercises }: Props) {
  const [activeId, setActiveId] = useState(exercises[0]?.id ?? "");
  const active = useMemo(
    () => exercises.find((e) => e.id === activeId) ?? exercises[0] ?? null,
    [exercises, activeId],
  );
  const initial = useMemo<GameState | null>(() => {
    if (!active) return null;
    const board = decodeBoard(active.position);
    if (!board) return null;
    return {
      board,
      turn: active.sideToPlay,
      history: [],
      outcome: null,
    };
  }, [active]);

  if (!active) {
    return (
      <p className="text-ink-soft italic">
        Aucun exercice n'est disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="border-2 border-ink bg-paper-deep paper-grain">
        <p className="border-b border-ink p-3 text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
          Positions disponibles
        </p>
        <ul className="max-h-[480px] overflow-y-auto divide-y divide-rule">
          {exercises.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setActiveId(e.id)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors",
                  e.id === active.id
                    ? "bg-paper border-l-4 border-accent-red"
                    : "border-l-4 border-transparent hover:bg-paper",
                )}
              >
                <p className="font-display text-base leading-tight">{e.title}</p>
                <p className="mt-1 text-[0.65rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
                  {DIFFICULTY_LABEL[e.difficulty]} ·{" "}
                  {e.sideToPlay === "white" ? "Blancs au trait" : "Noirs au trait"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section>
        <header className="border-b-2 border-ink pb-4">
          <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
            {DIFFICULTY_LABEL[active.difficulty]}
          </p>
          <h2 className="mt-1 font-display text-3xl">{active.title}</h2>
          <p className="mt-2 text-ink-soft">{active.description}</p>
        </header>
        <div className="mt-6">
          {initial ? (
            <ExerciseRunner
              key={active.id}
              initial={initial}
              studentSide={active.sideToPlay}
              hint={
                <p>
                  <strong>
                    {active.sideToPlay === "white"
                      ? "Trait aux Blancs."
                      : "Trait aux Noirs."}
                  </strong>{" "}
                  Trouvez le meilleur coup. Le coach analyse votre choix dès
                  que vous jouez.
                </p>
              }
              solution={active.solution || undefined}
            />
          ) : (
            <p className="text-ink-soft italic">
              Position invalide pour cet exercice.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
