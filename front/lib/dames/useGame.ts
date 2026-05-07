"use client";

import { useCallback, useMemo, useReducer } from "react";
import { newGame } from "./game";
import { applyMove, checkOutcome, legalMoves } from "./rules";
import { opposite } from "./types";
import type { Color, GameState, Move, Position } from "./types";

type Selection =
  | { kind: "none" }
  | { kind: "selected"; from: Position; moves: Move[] };

interface InternalState {
  game: GameState;
  selection: Selection;
}

type Action =
  | { type: "select"; from: Position }
  | { type: "deselect" }
  | { type: "play"; move: Move }
  | { type: "undo" }
  | { type: "reset"; initial?: GameState };

function reducer(state: InternalState, action: Action): InternalState {
  switch (action.type) {
    case "select": {
      if (state.game.outcome) return state;
      const piece = state.game.board[action.from.row][action.from.col];
      if (!piece || piece.color !== state.game.turn) return state;
      const moves = legalMoves(state.game.board, state.game.turn).filter(
        (m) => m.from.row === action.from.row && m.from.col === action.from.col,
      );
      if (moves.length === 0) return state;
      return { ...state, selection: { kind: "selected", from: action.from, moves } };
    }
    case "deselect":
      return { ...state, selection: { kind: "none" } };
    case "play": {
      const board = applyMove(state.game.board, action.move);
      const next: Color = opposite(state.game.turn);
      const outcome = checkOutcome(board, next);
      return {
        game: {
          board,
          turn: next,
          history: [...state.game.history, action.move],
          outcome,
        },
        selection: { kind: "none" },
      };
    }
    case "undo": {
      if (state.game.history.length === 0) return state;
      const replay = state.game.history.slice(0, -1);
      let g = newGame();
      for (const m of replay) {
        const b = applyMove(g.board, m);
        const next = opposite(g.turn);
        g = {
          board: b,
          turn: next,
          history: [...g.history, m],
          outcome: checkOutcome(b, next),
        };
      }
      return { game: g, selection: { kind: "none" } };
    }
    case "reset":
      return { game: action.initial ?? newGame(), selection: { kind: "none" } };
  }
}

export function useGame(initial?: GameState) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: initial ?? newGame(),
    selection: { kind: "none" } as Selection,
  }));

  const allLegal = useMemo(
    () => (state.game.outcome ? [] : legalMoves(state.game.board, state.game.turn)),
    [state.game.board, state.game.turn, state.game.outcome],
  );

  const select = useCallback(
    (from: Position) => dispatch({ type: "select", from }),
    [],
  );
  const deselect = useCallback(() => dispatch({ type: "deselect" }), []);
  const play = useCallback((move: Move) => dispatch({ type: "play", move }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const reset = useCallback(
    (initial?: GameState) => dispatch({ type: "reset", initial }),
    [],
  );

  /** Map from "row,col" → Move available from selection (used to highlight targets). */
  const targets = useMemo(() => {
    if (state.selection.kind !== "selected") return new Map<string, Move>();
    const map = new Map<string, Move>();
    for (const m of state.selection.moves) {
      map.set(`${m.to.row},${m.to.col}`, m);
    }
    return map;
  }, [state.selection]);

  /** Set of "row,col" of pieces that have at least one legal move (for hinting). */
  const movableSquares = useMemo(() => {
    const set = new Set<string>();
    for (const m of allLegal) set.add(`${m.from.row},${m.from.col}`);
    return set;
  }, [allLegal]);

  /** The opponent of the side to play, used by AI driver effects. */
  return {
    state: state.game,
    selection: state.selection,
    targets,
    movableSquares,
    select,
    deselect,
    play,
    undo,
    reset,
    allLegal,
  };
}
