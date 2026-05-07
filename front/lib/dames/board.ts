import {
  BOARD_SIZE,
  type Board,
  type GameState,
  isDark,
  type Piece,
} from "./types";

export function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
}

export function initialBoard(): Board {
  const board = emptyBoard();
  // Black on rows 0-3, white on rows 6-9, on dark squares only.
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!isDark(r, c)) continue;
      if (r < 4) board[r][c] = { color: "black", kind: "man" };
      else if (r > 5) board[r][c] = { color: "white", kind: "man" };
    }
  }
  return board;
}

export function initialState(): GameState {
  return {
    board: initialBoard(),
    turn: "white",
    history: [],
    outcome: null,
  };
}

export function pieceAt(board: Board, row: number, col: number): Piece | null {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null;
  return board[row][col];
}

export function countPieces(board: Board): { white: number; black: number; whiteKings: number; blackKings: number } {
  let white = 0,
    black = 0,
    whiteKings = 0,
    blackKings = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (!p) continue;
      if (p.color === "white") {
        white++;
        if (p.kind === "king") whiteKings++;
      } else {
        black++;
        if (p.kind === "king") blackKings++;
      }
    }
  }
  return { white, black, whiteKings, blackKings };
}
