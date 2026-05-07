"use client";

import { useCallback, useEffect, useState } from "react";
import { Board } from "./Board";
import { CapturedTray } from "./CapturedTray";
import { Controls } from "./Controls";
import { GameStatus } from "./GameStatus";
import { MoveHistory } from "./MoveHistory";
import { pickMove, type Difficulty } from "@/lib/dames/ai";
import { useGame } from "@/lib/dames/useGame";
import type { Color, GameState, Position } from "@/lib/dames/types";

export type AiSettings =
  | { mode: "two-players" }
  | { mode: "vs-ai"; aiPlays: Color; difficulty: Difficulty };

interface GameViewProps {
  initial?: GameState;
  ai?: AiSettings;
  onMovePlayed?: (state: GameState) => void;
  hideHistory?: boolean;
  hideCaptured?: boolean;
  /** Hint shown above the board (e.g. exercise instructions). */
  hint?: React.ReactNode;
}

export function GameView({
  initial,
  ai = { mode: "two-players" },
  onMovePlayed,
  hideHistory,
  hideCaptured,
  hint,
}: GameViewProps) {
  const {
    state,
    selection,
    targets,
    movableSquares,
    select,
    deselect,
    play,
    undo,
    reset,
  } = useGame(initial);
  const [flipped, setFlipped] = useState(false);
  const [thinking, setThinking] = useState<Color | null>(null);

  const lastMove =
    state.history.length > 0 ? state.history[state.history.length - 1] : undefined;

  const handlePickSource = useCallback(
    (pos: Position) => {
      if (selection.kind === "selected") {
        // Clicking the already-selected piece toggles off.
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
    },
    [selection, state.board, state.turn, select, deselect],
  );

  const handlePickTarget = useCallback(
    (pos: Position) => {
      const move = targets.get(`${pos.row},${pos.col}`);
      if (!move) return;
      play(move);
      onMovePlayed?.(state);
    },
    [targets, play, onMovePlayed, state],
  );

  // AI driver — schedules setState calls through microtasks so React commits
  // a "thinking" frame before the (synchronous) minimax kicks in.
  useEffect(() => {
    if (ai.mode !== "vs-ai") return;
    if (state.outcome) return;
    if (state.turn !== ai.aiPlays) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setThinking(ai.aiPlays);
    });
    pickMove(state.board, ai.aiPlays, ai.difficulty).then((move) => {
      if (cancelled) return;
      setThinking(null);
      if (move) play(move);
    });
    return () => {
      cancelled = true;
      // Clearing the flag is also a microtask: avoids cascading renders.
      queueMicrotask(() => setThinking(null));
    };
    // We intentionally depend on the full board reference (changes per move)
    // and the turn. ai settings are stable for a session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.board, state.turn, state.outcome]);

  const canUndo =
    state.history.length > 0 && !thinking && (
      ai.mode === "two-players" ||
      // In vs-ai mode, undo two ply at once so the player keeps playing.
      true
    );

  const handleUndo = useCallback(() => {
    if (ai.mode === "vs-ai" && state.history.length >= 2) {
      undo();
      undo();
    } else {
      undo();
    }
  }, [ai.mode, state.history.length, undo]);

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
          selectedFrom={selection.kind === "selected" ? selection.from : null}
          targets={targets}
          movableSquares={movableSquares}
          onPickSource={handlePickSource}
          onPickTarget={handlePickTarget}
          flipped={flipped}
          lastMove={lastMove}
        />
        <Controls
          canUndo={canUndo}
          onUndo={handleUndo}
          onReset={() => reset(initial)}
          flipped={flipped}
          onToggleFlip={() => setFlipped((f) => !f)}
          thinking={thinking !== null}
        />
      </div>
      <aside className="space-y-4">
        <GameStatus
          board={state.board}
          turn={state.turn}
          outcome={state.outcome}
          thinking={thinking}
        />
        {hideCaptured ? null : <CapturedTray moves={state.history} />}
        {hideHistory ? null : <MoveHistory moves={state.history} />}
      </aside>
    </div>
  );
}
