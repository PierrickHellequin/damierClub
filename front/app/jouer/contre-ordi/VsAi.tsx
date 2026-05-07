"use client";

import { useState } from "react";
import { GameView } from "@/components/dames/GameView";
import type { Difficulty } from "@/lib/dames/ai";
import type { Color } from "@/lib/dames/types";
import { cn } from "@/lib/cn";

const DIFFICULTIES: Array<{ value: Difficulty; label: string; hint: string }> = [
  { value: "facile", label: "Facile", hint: "Profondeur 2 + un peu d'aléa" },
  { value: "moyen", label: "Moyen", hint: "Profondeur 4, défense correcte" },
  { value: "difficile", label: "Difficile", hint: "Profondeur 6, ne pardonne rien" },
];

export function VsAi() {
  const [side, setSide] = useState<Color>("white");
  const [difficulty, setDifficulty] = useState<Difficulty>("moyen");
  // We use a key to force-remount GameView on settings change so the AI
  // restarts cleanly with the new parameters.
  const [seed, setSeed] = useState(0);

  function applySettings(next: { side?: Color; difficulty?: Difficulty }) {
    if (next.side) setSide(next.side);
    if (next.difficulty) setDifficulty(next.difficulty);
    setSeed((s) => s + 1);
  }

  const aiPlays: Color = side === "white" ? "black" : "white";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Votre couleur">
          <div className="grid grid-cols-2 gap-2">
            <Toggle
              active={side === "white"}
              onClick={() => applySettings({ side: "white" })}
            >
              Blancs
            </Toggle>
            <Toggle
              active={side === "black"}
              onClick={() => applySettings({ side: "black" })}
            >
              Noirs
            </Toggle>
          </div>
        </Panel>
        <Panel title="Niveau de l'ordinateur">
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <Toggle
                key={d.value}
                active={difficulty === d.value}
                onClick={() => applySettings({ difficulty: d.value })}
                title={d.hint}
              >
                {d.label}
              </Toggle>
            ))}
          </div>
        </Panel>
      </div>
      <GameView
        key={seed}
        ai={{ mode: "vs-ai", aiPlays, difficulty }}
        hint={
          <p>
            Vous jouez les <strong>{side === "white" ? "Blancs" : "Noirs"}</strong>.
            L'ordinateur démarre {aiPlays === "white" ? "en premier (Blancs)" : "en deuxième (Noirs)"}.
          </p>
        }
      />
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-4">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "border px-4 py-2 font-meta text-[0.75rem] uppercase tracking-[0.2em] transition-colors",
        active
          ? "border-accent-red bg-accent-red text-paper"
          : "border-ink/30 hover:border-accent-red hover:text-accent-red",
      )}
    >
      {children}
    </button>
  );
}
