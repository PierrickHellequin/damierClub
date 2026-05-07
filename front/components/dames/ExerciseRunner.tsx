"use client";

import { useCallback, useEffect, useState } from "react";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { GameStatus } from "./GameStatus";
import { useGame } from "@/lib/dames/useGame";
import { analyseMove, bestMoveHint } from "@/lib/dames/ai";
import { indexToPos, moveNotation, squareIndex } from "@/lib/dames/notation";
import { legalMoves } from "@/lib/dames/rules";
import type { Color, GameState, Position } from "@/lib/dames/types";
import type { SolutionMovePair } from "@/lib/dames/exercises";
import { cn } from "@/lib/cn";

interface Props {
  initial: GameState;
  /** Side the student is solving for. */
  studentSide: Color;
  /** Free text shown above the board (énoncé). */
  hint?: React.ReactNode;
  /** The exercise's stored solution, revealed on demand. */
  solution?: string;
  /**
   * Optional structured combination. When provided, the coach validates the
   * student's move against this sequence rather than relying on the AI.
   * Even indexes (0, 2, …) are student moves; odd indexes are auto-played
   * opponent replies.
   */
  solutionMoves?: SolutionMovePair[];
}

type Verdict =
  | { kind: "perfect" }
  | { kind: "good"; deltaCp: number }
  | { kind: "imperfect"; deltaCp: number; bestNotation: string }
  | { kind: "step-correct"; remaining: number }
  | { kind: "wrong"; expected: string; played: string }
  | { kind: "combo-completed" };

const OPPONENT_REPLY_DELAY_MS = 700;

export function ExerciseRunner({
  initial,
  studentSide,
  hint,
  solution,
  solutionMoves,
}: Props) {
  const usingSequence = !!solutionMoves && solutionMoves.length > 0;
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
  const [locked, setLocked] = useState(false);
  const [sequenceStep, setSequenceStep] = useState(0);

  const lastMove =
    state.history.length > 0 ? state.history[state.history.length - 1] : undefined;

  const handlePickSource = useCallback(
    (pos: Position) => {
      if (locked) return;
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
      setHintSquare(null);
    },
    [locked, selection, state.board, state.turn, select, deselect],
  );

  const handlePickTarget = useCallback(
    (pos: Position) => {
      if (locked) return;
      const move = targets.get(`${pos.row},${pos.col}`);
      if (!move) return;
      setHintSquare(null);

      if (usingSequence && solutionMoves) {
        const expected = solutionMoves[sequenceStep];
        const playedFrom = squareIndex(move.from.row, move.from.col);
        const playedTo = squareIndex(move.to.row, move.to.col);
        if (
          expected &&
          expected.from === playedFrom &&
          expected.to === playedTo
        ) {
          play(move);
          const nextStep = sequenceStep + 1;
          setSequenceStep(nextStep);
          const remaining = solutionMoves.length - nextStep;
          if (remaining === 0) {
            setVerdict({ kind: "combo-completed" });
            setLocked(true);
          } else {
            // The opponent reply (if any) is scheduled by the effect below.
            setVerdict({ kind: "step-correct", remaining });
          }
        } else {
          // Apply the move so the board reflects the wrong choice, then lock.
          play(move);
          setVerdict({
            kind: "wrong",
            expected: expected
              ? `${expected.from}${expected.to ? "-" : ""}${expected.to}`
              : "?",
            played: moveNotation(move),
          });
          setLocked(true);
        }
        return;
      }

      // AI-only mode: snapshot the board *before* the move so we can analyse.
      const beforeBoard = state.board;
      const beforeTurn = state.turn;
      play(move);
      setLocked(true);
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
    [
      locked,
      targets,
      usingSequence,
      solutionMoves,
      sequenceStep,
      play,
      state.board,
      state.turn,
    ],
  );

  // Auto-play the opponent reply when it's their turn in sequence mode.
  useEffect(() => {
    if (!usingSequence || !solutionMoves) return;
    if (locked) return;
    if (sequenceStep >= solutionMoves.length) return;
    if (sequenceStep % 2 === 0) return; // student's turn
    const reply = solutionMoves[sequenceStep];
    const timer = window.setTimeout(() => {
      const legal = legalMoves(state.board, state.turn);
      const match = legal.find(
        (m) =>
          squareIndex(m.from.row, m.from.col) === reply.from &&
          squareIndex(m.to.row, m.to.col) === reply.to,
      );
      if (!match) {
        // The stored opponent move is no longer legal — fail safely.
        setVerdict({
          kind: "wrong",
          expected: `${reply.from}-${reply.to}`,
          played: "—",
        });
        setLocked(true);
        return;
      }
      play(match);
      const nextStep = sequenceStep + 1;
      setSequenceStep(nextStep);
      const remaining = solutionMoves.length - nextStep;
      if (remaining === 0) {
        setVerdict({ kind: "combo-completed" });
        setLocked(true);
      } else {
        setVerdict({ kind: "step-correct", remaining });
      }
    }, OPPONENT_REPLY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [usingSequence, solutionMoves, sequenceStep, locked, play, state.board, state.turn]);

  const askHint = useCallback(() => {
    if (locked) return;
    if (usingSequence && solutionMoves) {
      const expected = solutionMoves[sequenceStep];
      if (expected) {
        setHintSquare(indexToPos(expected.from));
      }
      return;
    }
    setAnalysing(true);
    bestMoveHint(state.board, state.turn)
      .then((m) => {
        if (m) setHintSquare({ row: m.from.row, col: m.from.col });
      })
      .finally(() => setAnalysing(false));
  }, [locked, usingSequence, solutionMoves, sequenceStep, state.board, state.turn]);

  const handleReset = useCallback(() => {
    setLocked(false);
    setVerdict(null);
    setHintSquare(null);
    setShowSolution(false);
    setSequenceStep(0);
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

        {!locked && verdict?.kind !== "step-correct" ? (
          <CoachActions
            onHint={askHint}
            thinking={analysing}
            usingSequence={usingSequence}
            stepsTotal={solutionMoves?.length ?? 0}
            stepIndex={sequenceStep}
          />
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
  usingSequence,
  stepsTotal,
  stepIndex,
}: {
  onHint: () => void;
  thinking: boolean;
  usingSequence: boolean;
  stepsTotal: number;
  stepIndex: number;
}) {
  const studentMovesTotal = Math.ceil(stepsTotal / 2);
  const studentMovesPlayed = Math.ceil(stepIndex / 2);
  return (
    <div className="border-2 border-ink bg-paper-deep paper-grain p-5">
      <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        Coach
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        {usingSequence ? (
          <>
            Combinaison à reproduire : {studentMovesPlayed} / {studentMovesTotal} coup
            {studentMovesTotal > 1 ? "s" : ""} joué{studentMovesPlayed > 1 ? "s" : ""}.
            Le coach met en évidence le pion à jouer si vous demandez un indice.
          </>
        ) : (
          <>
            Trouvez le coup. {`L'indice met en évidence le pion à jouer (sans
          révéler la destination).`}
          </>
        )}
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
  if (verdict.kind === "combo-completed") {
    return (
      <Verdict tone="green" title="Combinaison réussie ✓">
        <p>
          {`Vous avez joué la combinaison complète attendue. Bravo ! Cliquez
          sur `}
          <em>Recommencer</em> pour rejouer la position.
        </p>
      </Verdict>
    );
  }
  if (verdict.kind === "step-correct") {
    return (
      <Verdict tone="green" title="Bon coup ✓">
        <p>
          {verdict.remaining > 1
            ? `Continuez : ${verdict.remaining} coups restants dans la combinaison.`
            : "Encore un coup pour terminer la combinaison."}
        </p>
      </Verdict>
    );
  }
  if (verdict.kind === "wrong") {
    return (
      <Verdict tone="red" title="Ce n'est pas le coup attendu">
        <p>
          Le coup attendu était <strong>{verdict.expected}</strong>. Vous avez
          joué <strong>{verdict.played}</strong>.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Cliquez sur <em>Recommencer</em> pour réessayer.
        </p>
      </Verdict>
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
        Différence d&apos;évaluation :{" "}
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
