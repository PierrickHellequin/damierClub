import type { Move } from "@/lib/dames/types";

/** Counts captures from the move history (assumes initial position is the standard 20-20 setup). */
export function CapturedTray({ moves }: { moves: Move[] }) {
  let whiteLost = 0;
  let blackLost = 0;
  // Each move's captures belong to the opposing color.
  // Even-indexed moves are by white (capturing black), odd by black (capturing white).
  for (let i = 0; i < moves.length; i++) {
    const captures = moves[i].captures.length;
    if (i % 2 === 0) blackLost += captures;
    else whiteLost += captures;
  }

  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-4">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Captures
      </p>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <Tray label="Pris aux blancs" count={whiteLost} variant="white" />
        <Tray label="Pris aux noirs" count={blackLost} variant="black" />
      </div>
    </div>
  );
}

function Tray({
  label,
  count,
  variant,
}: {
  label: string;
  count: number;
  variant: "white" | "black";
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-meta uppercase tracking-[0.2em] text-ink-mute">
        {label}
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={
              "size-3 rounded-full border " +
              (variant === "white"
                ? "bg-paper border-ink"
                : "bg-ink border-ink")
            }
          />
        ))}
        {count === 0 ? (
          <span className="text-xs text-ink-mute italic">— aucune —</span>
        ) : null}
      </div>
      <p className="mt-1 font-display text-2xl">{count}</p>
    </div>
  );
}
