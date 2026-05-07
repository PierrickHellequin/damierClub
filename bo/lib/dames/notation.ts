// MIRRORED from front/lib/dames — keep in sync.
// Pure logic, no React or DOM dependencies.

// Standard French/International draughts notation: dark squares numbered 1-50
// from top-left to bottom-right, scanning rows left-to-right.
// Square 1 is at (row 0, col 1), square 50 is at (row 9, col 8).

import { emptyBoard } from "./board";
import { isDark } from "./types";
import type { Board, Move, Piece, Position } from "./types";

export function squareIndex(row: number, col: number): number | null {
  if (!isDark(row, col)) return null;
  return row * 5 + Math.floor(col / 2) + 1;
}

export function indexToPos(index: number): Position {
  const i = index - 1;
  const row = Math.floor(i / 5);
  const colInRow = i % 5; // 0..4
  // On even rows (0,2,4...) col = 1,3,5,7,9. On odd rows col = 0,2,4,6,8.
  const offset = row % 2 === 0 ? 1 : 0;
  return { row, col: colInRow * 2 + offset };
}

/** Compact textual move notation, e.g. "32-28" for a quiet move, "32x23" for a capture. */
export function moveNotation(move: Move): string {
  const from = squareIndex(move.from.row, move.from.col);
  const to = squareIndex(move.to.row, move.to.col);
  const sep = move.captures.length > 0 ? "x" : "-";
  return `${from}${sep}${to}`;
}

/**
 * Encode a board to a compact string: 50 characters, one per dark square,
 * where '.' = empty, 'w' = white man, 'W' = white king, 'b' = black man, 'B' = black king.
 */
export function encodeBoard(board: Board): string {
  const out: string[] = [];
  for (let i = 1; i <= 50; i++) {
    const { row, col } = indexToPos(i);
    const p = board[row][col];
    out.push(pieceCharFor(p));
  }
  return out.join("");
}

/** Inverse of `encodeBoard`. Returns null if the input is malformed. */
export function decodeBoard(encoded: string): Board | null {
  if (encoded.length !== 50) return null;
  const board = emptyBoard();
  for (let i = 0; i < 50; i++) {
    const ch = encoded[i];
    const piece = pieceFromChar(ch);
    if (piece === undefined) return null;
    if (piece) {
      const { row, col } = indexToPos(i + 1);
      board[row][col] = piece;
    }
  }
  return board;
}

function pieceCharFor(p: Piece | null): string {
  if (!p) return ".";
  if (p.color === "white") return p.kind === "king" ? "W" : "w";
  return p.kind === "king" ? "B" : "b";
}

function pieceFromChar(ch: string): Piece | null | undefined {
  switch (ch) {
    case ".":
      return null;
    case "w":
      return { color: "white", kind: "man" };
    case "W":
      return { color: "white", kind: "king" };
    case "b":
      return { color: "black", kind: "man" };
    case "B":
      return { color: "black", kind: "king" };
    default:
      return undefined;
  }
}
