import { moveNotation } from "@/lib/dames/notation";
import type { Move } from "@/lib/dames/types";

export function MoveHistory({ moves }: { moves: Move[] }) {
  // Pair half-moves: white then black per "round".
  const rounds: Array<{ index: number; white?: Move; black?: Move }> = [];
  for (let i = 0; i < moves.length; i++) {
    const round = Math.floor(i / 2);
    if (i % 2 === 0) {
      rounds.push({ index: round + 1, white: moves[i] });
    } else {
      rounds[round].black = moves[i];
    }
  }

  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain">
      <p className="border-b border-ink p-3 text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Notation
      </p>
      {rounds.length === 0 ? (
        <p className="p-4 text-sm text-ink-soft italic">
          La partie n'a pas encore commencé.
        </p>
      ) : (
        <ol className="max-h-72 overflow-y-auto divide-y divide-rule font-meta text-sm">
          {rounds.map((r) => (
            <li
              key={r.index}
              className="grid grid-cols-[3rem_1fr_1fr] items-center gap-2 px-3 py-1.5"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-mute">
                {r.index}.
              </span>
              <span>{r.white ? moveNotation(r.white) : ""}</span>
              <span>{r.black ? moveNotation(r.black) : ""}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
