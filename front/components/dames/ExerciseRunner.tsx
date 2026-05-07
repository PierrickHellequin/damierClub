"use client";

import { useCallback, useState } from "react";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { GameStatus } from "./GameStatus";
import { useGame } from "@/lib/dames/useGame";
import { analyseMove, bestMoveHint } from "@/lib/dames/ai";
import { moveNotation } from "@/lib/dames/notation";
import type { Color, GameState, Position } from "@/lib/dames/types";
import { cn } from "@/lib/cn";

interface Props {
  initial: GameState;
  /** Side the student is solving for. Once they play, no further input is accepted. */
  studentSide: Color;
  /** Free text shown above the board (énoncé). */
  hint?: React.ReactNode;
  /** The exercise's stored solution, revealed on demand. */
  solution?: string;
}

type Verdict =
  | { kind: "perfect" }
  | { kind: "good"; deltaCp: number }
  | { kind: "imperfect"; deltaCp: number; bestNotation: string };

export function ExerciseRunner({
  initial,
  studentSide,
  hint,
  solution,
}: Props) {
  const {
    state,
    selection,
    targets,
    movableSquares,
    select,
    deselect,
    play,
    reset,
  } = useGame(initial);
  const [flipped, setFlipped] = useState(studentSide === "black");
  const [hintSquare, setHintSquare] = useState<Position | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [studentMoved, setStudentMoved] = useState(false);

  const lastMove =
    state.history.length > 0 ? state.history[state.history.length - 1] : undefined;

  const handlePickSource = useCallback(
    (pos: Position) => {
      // Once the student has played their move, the board is locked.
      if (studentMoved) return;
      if (selection.kind === "selected") {
        if (
          selection.from.row === pos.row &&
          selection.from.col === pos.col
        ) {
          deselect();
          return;
        }
      }
      const piece = state.board[pos.row][pos.col];
      if (piece && piece.color === state.turn) {
        select(pos);
      } else {
        deselect();
      }
      // Picking a source clears any visible hint.
      setHintSquare(null);
    },
    [studentMoved, selection, state.board, state.turn, select, deselect],
  );

  const handlePickTarget = useCallback(
    (pos: Position) => {
      if (studentMoved) return;
      const move = targets.get(`${pos.row},${pos.col}`);
      if (!move) return;
      setStudentMoved(true);
      setHintSquare(null);
      // Snapshot the board *before* the move so we can analyse it.
      const beforeBoard = state.board;
      const beforeTurn = state.turn;
      play(move);
      setAnalysing(true);
      setVerdict(null);
      analyseMove(beforeBoard, beforeTurn, move, 4)
        .then(({ best, bestScore, playedScore }) => {
          const delta = bestScore - playedScore;
          const sameMove =
            best &&
            best.from.row === move.from.row &&
            best.from.col === move.from.col &&
            best.to.row === move.to.row &&
            best.to.col === move.to.col;
          if (sameMove || delta <= 5) {
            setVerdict({ kind: "perfect" });
          } else if (delta < 80) {
            setVerdict({ kind: "good", deltaCp: delta });
          } else {
            setVerdict({
              kind: "imperfect",
              deltaCp: delta,
              bestNotation: best ? moveNotation(best) : "?",
            });
          }
        })
        .catch(() => {
          setVerdict(null);
        })
        .finally(() => {
          setAnalysing(false);
        });
    },
    [studentMoved, targets, play, state.board, state.turn],
  );

  const askHint = useCallback(() => {
    if (studentMoved) return;
    setAnalysing(true);
    bestMoveHint(state.board, state.turn)
      .then((m) => {
        if (m) setHintSquare({ row: m.from.row, col: m.from.col });
      })
      .finally(() => setAnalysing(false));
  }, [studentMoved, state.board, state.turn]);

  const handleReset = useCallback(() => {
    setStudentMoved(false);
    setVerdict(null);
    setHintSquare(null);
    setShowSolution(false);
    reset(initial);
  }, [initial, reset]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)]">
      <div className="space-y-4">
        {hint ? (
          <div className="border-l-4 border-accent-red bg-paper-deep paper-grain px-5 py-4 text-ink-soft">
            {hint}
          </div>
        ) : null}
        <Board
          state={state}
          selectedFrom={
            selection.kind === "selected" ? selection.from : hintSquare ?? null
          }
          targets={targets}
          movableSquares={movableSquares}
          onPickSource={handlePickSource}
          onPickTarget={handlePickTarget}
          flipped={flipped}
          lastMove={lastMove}
        />
        <Controls
          canUndo={false}
          onUndo={() => {}}
          onReset={handleReset}
          flipped={flipped}
          onToggleFlip={() => setFlipped((f) => !f)}
        />
      </div>
      <aside className="space-y-4">
        <GameStatus
          board={state.board}
          turn={state.turn}
          outcome={state.outcome}
        />

        {!studentMoved ? (
          <CoachActions onHint={askHint} thinking={analysing} />
        ) : (
          <CoachVerdict verdict={verdict} thinking={analysing} />
        )}

        {solution ? (
          <SolutionPanel
            shown={showSolution}
            onToggle={() => setShowSolution((s) => !s)}
            text={solution}
          />
        ) : null}
      </aside>
    </div>
  );
}

function CoachActions({
  onHint,
  thinking,
}: {
  onHint: () => void;
  thinking: boolean;
}) {
  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Coach
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Trouvez le coup. L'indice met en évidence le pion à jouer (sans
        révéler la destination).
      </p>
      <button
        type="button"
        onClick={onHint}
        disabled={thinking}
        className={cn(
          "mt-3 border px-4 py-2 font-meta text-[0.75rem] uppercase tracking-[0.2em]",
          thinking
            ? "border-rule text-ink-mute cursor-wait"
            : "border-ink hover:bg-ink hover:text-paper",
        )}
      >
        {thinking ? "Analyse…" : "Donner un indice"}
      </button>
    </div>
  );
}

function CoachVerdict({
  verdict,
  thinking,
}: {
  verdict: Verdict | null;
  thinking: boolean;
}) {
  if (thinking) {
    return (
      <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
          Coach
        </p>
        <p className="mt-2 text-ink italic">{`L'ordi analyse votre coup…`}</p>
      </div>
    );
  }
  if (!verdict) {
    return (
      <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
          Coach
        </p>
        <p className="mt-2 text-ink-soft">Coup joué. Aucune analyse disponible.</p>
      </div>
    );
  }
  if (verdict.kind === "perfect") {
    return (
      <Verdict tone="green" title="Coup parfait ✓">
        <p>
          {`C'est exactement le coup recommandé par l'analyse. Bravo ! Cliquez
          sur `}
          <em>Recommencer</em> pour rejouer la position.
        </p>
      </Verdict>
    );
  }
  if (verdict.kind === "good") {
    return (
      <Verdict tone="green" title="Coup correct ✓">
        <p>
          Bien joué — votre coup est très proche du meilleur (différence{" "}
          {(verdict.deltaCp / 100).toFixed(2)}). On peut difficilement faire
          mieux dans cette position.
        </p>
      </Verdict>
    );
  }
  return (
    <Verdict tone="red" title="On peut mieux faire">
      <p>
        Le coup recommandé était <strong>{verdict.bestNotation}</strong>.
        Différence d'évaluation :{" "}
        <strong>{(verdict.deltaCp / 100).toFixed(2)}</strong> en faveur du
        coup recommandé.
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Cliquez sur <em>Recommencer</em> pour réessayer la position.
      </p>
    </Verdict>
  );
}

function Verdict({
  tone,
  title,
  children,
}: {
  tone: "green" | "red";
  title: string;
  children: React.ReactNode;
}) {
  const border = tone === "green" ? "border-accent-green" : "border-accent-red";
  const eyebrow = tone === "green" ? "text-accent-green" : "text-accent-red";
  return (
    <div className={cn("border-l-4", border, "bg-paper-deep paper-grain px-5 py-4")}>
      <p className={cn("text-[0.7rem] font-meta uppercase tracking-[0.3em]", eyebrow)}>
        Verdict
      </p>
      <p className="mt-2 font-display text-xl">{title}</p>
      <div className="mt-2 text-ink">{children}</div>
    </div>
  );
}

function SolutionPanel({
  shown,
  onToggle,
  text,
}: {
  shown: boolean;
  onToggle: () => void;
  text: string;
}) {
  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Solution
      </p>
      {shown ? (
        <>
          <p className="mt-2 text-ink whitespace-pre-line">{text}</p>
          <button
            type="button"
            onClick={onToggle}
            className="mt-3 text-[0.7rem] font-meta uppercase tracking-[0.2em] text-ink-soft hover:text-accent-red"
          >
            Masquer
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="mt-3 border border-ink px-4 py-2 font-meta text-[0.75rem] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
        >
          Voir la solution
        </button>
      )}
    </div>
  );
}
