import { cn } from "@/lib/cn";
import { countPieces } from "@/lib/dames/board";
import type { Board, Color, GameOutcome } from "@/lib/dames/types";

const COLOR_LABEL: Record<Color, string> = {
  white: "Blancs",
  black: "Noirs",
};

export function GameStatus({
  board,
  turn,
  outcome,
  thinking,
}: {
  board: Board;
  turn: Color;
  outcome: GameOutcome | null;
  thinking?: Color | null;
}) {
  const counts = countPieces(board);

  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        État de la partie
      </p>
      {outcome ? (
        <Outcome outcome={outcome} />
      ) : (
        <div className="mt-2">
          <p className="font-display text-2xl">
            Trait aux <span className="text-accent-red">{COLOR_LABEL[turn]}</span>
            {thinking === turn ? <span className="ml-2 text-ink-soft text-base italic">— l'ordi réfléchit…</span> : null}
          </p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <SideCount
          color="white"
          count={counts.white}
          kings={counts.whiteKings}
          active={!outcome && turn === "white"}
        />
        <SideCount
          color="black"
          count={counts.black}
          kings={counts.blackKings}
          active={!outcome && turn === "black"}
        />
      </div>
    </div>
  );
}

function Outcome({ outcome }: { outcome: GameOutcome }) {
  if (outcome.kind === "draw") {
    return (
      <p className="mt-2 font-display text-2xl">
        Partie nulle <span className="text-ink-soft">({outcome.reason === "agreement" ? "accord" : "répétition"})</span>
      </p>
    );
  }
  return (
    <p className="mt-2 font-display text-2xl">
      <span className="text-accent-red">{COLOR_LABEL[outcome.winner]} gagnent</span>
      <span className="ml-2 text-ink-soft text-base">
        {outcome.reason === "no-pieces" ? "(toutes les pièces capturées)" : "(adversaire bloqué)"}
      </span>
    </p>
  );
}

function SideCount({
  color,
  count,
  kings,
  active,
}: {
  color: Color;
  count: number;
  kings: number;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border px-3 py-2 transition-colors",
        active ? "border-accent-red bg-paper" : "border-rule",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-5 rounded-full border",
          color === "white" ? "bg-paper border-ink" : "bg-ink border-ink",
        )}
      />
      <div className="flex-1 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-soft">
        {COLOR_LABEL[color]}
      </div>
      <div className="font-display text-xl">
        {count}
        {kings > 0 ? (
          <span className="ml-1 text-sm text-accent-red">({kings} ♛)</span>
        ) : null}
      </div>
    </div>
  );
}
