import { initialState } from "./board";
import { applyMove, checkOutcome, legalMoves } from "./rules";
import { opposite } from "./types";
import type { Color, GameState, Move, Position } from "./types";

export function newGame(): GameState {
  return initialState();
}

/** Return the move from the given starting square that ends on `to`, if any. */
export function findMove(
  state: GameState,
  from: Position,
  to: Position,
): Move | null {
  const candidates = legalMoves(state.board, state.turn).filter(
    (m) => m.from.row === from.row && m.from.col === from.col,
  );
  return (
    candidates.find((m) => m.to.row === to.row && m.to.col === to.col) ?? null
  );
}

/** Legal moves originating from a specific square. */
export function legalFrom(state: GameState, from: Position): Move[] {
  return legalMoves(state.board, state.turn).filter(
    (m) => m.from.row === from.row && m.from.col === from.col,
  );
}

export function play(state: GameState, move: Move): GameState {
  const board = applyMove(state.board, move);
  const next: Color = opposite(state.turn);
  const outcome = checkOutcome(board, next);
  return {
    board,
    turn: next,
    history: [...state.history, move],
    outcome,
  };
}

/** Undo the last n moves (defaults to 1). Returns the original state if history is empty. */
export function undo(state: GameState, count = 1): GameState {
  if (state.history.length === 0) return state;
  const replay = state.history.slice(0, Math.max(0, state.history.length - count));
  let s = newGame();
  for (const m of replay) {
    s = play(s, m);
  }
  return s;
}
