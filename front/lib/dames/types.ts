// French/International draughts (jeu de dames) — 10x10 board.
// Coordinates: (row, col) with row 0 = top (black side), row 9 = bottom (white side).
// Dark squares (the only playable ones) are those where (row + col) % 2 === 1.

export type Color = "white" | "black";
export type Kind = "man" | "king";

export interface Piece {
  color: Color;
  kind: Kind;
}

export const BOARD_SIZE = 10;

// 10×10 grid; null = empty (or light square).
export type Board = (Piece | null)[][];

export interface Position {
  /** [row, col] indices, 0-based. */
  row: number;
  col: number;
}

export interface Move {
  /** Where the moving piece starts. */
  from: Position;
  /** Where it lands at the end of its sequence. */
  to: Position;
  /** All landing squares in order (excludes `from`, includes intermediate jumps and `to`). */
  path: Position[];
  /** Pieces removed by this move (empty for non-captures). */
  captures: Position[];
  /** True if the moving piece becomes a king at the end of the move. */
  promotes: boolean;
}

export interface GameState {
  board: Board;
  /** Whose turn it is to move. */
  turn: Color;
  /** Move history (each entry is the move that was played). */
  history: Move[];
  /** Game outcome — null while still in progress. */
  outcome: GameOutcome | null;
}

export type GameOutcome =
  | { kind: "win"; winner: Color; reason: "no-pieces" | "no-moves" }
  | { kind: "draw"; reason: "agreement" | "repetition" };

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

export function isDark(r: number, c: number): boolean {
  return (r + c) % 2 === 1;
}

export function opposite(color: Color): Color {
  return color === "white" ? "black" : "white";
}

export function samePos(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}
