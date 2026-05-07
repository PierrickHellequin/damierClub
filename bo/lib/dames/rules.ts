// MIRRORED from front/lib/dames — keep in sync.
// Pure logic, no React or DOM dependencies.

// French/International draughts rules.
// - Men move one diagonal step forward.
// - Kings (dames) slide any number of empty diagonal squares.
// - Captures are mandatory.
// - "Rafle maximum": the player must play the move that captures the most pieces
//   (not the highest valued — strictly the longest sequence).
// - Multi-jump (rafle) is required: a piece keeps capturing until no more captures
//   are possible from its current square; intermediate squares pass over but cannot
//   land on a piece already captured in the same sequence.
// - Promotion to king happens only if the piece ends its move on the back rank.
//   A man that merely passes through the back rank during a rafle does NOT promote.

import { cloneBoard, opposite } from "./types";
import type { Board, Color, Move, Piece, Position } from "./types";

const DIRS: Array<[number, number]> = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 10 && c >= 0 && c < 10;
}

function backRankFor(color: Color): number {
  return color === "white" ? 0 : 9;
}

interface CaptureNode {
  path: Position[];
  captures: Position[];
}

/** Generate all legal moves for the side to play, applying the longest-capture rule. */
export function legalMoves(board: Board, turn: Color): Move[] {
  const all: Move[] = [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const p = board[r][c];
      if (!p || p.color !== turn) continue;
      const captures = captureSequencesFrom(board, { row: r, col: c }, p);
      for (const node of captures) {
        const last = node.path[node.path.length - 1];
        const startsAsMan = p.kind === "man";
        const endsOnBackRank = last.row === backRankFor(p.color);
        all.push({
          from: { row: r, col: c },
          to: last,
          path: node.path,
          captures: node.captures,
          promotes: startsAsMan && endsOnBackRank,
        });
      }
    }
  }

  if (all.length > 0) {
    // Mandatory longest capture: keep only the moves with max capture count.
    const max = all.reduce((m, mv) => Math.max(m, mv.captures.length), 0);
    return all.filter((m) => m.captures.length === max);
  }

  // No captures — quiet moves.
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const p = board[r][c];
      if (!p || p.color !== turn) continue;
      all.push(...quietMovesFrom(board, { row: r, col: c }, p));
    }
  }
  return all;
}

/** All quiet (non-capturing) moves for the given piece. */
function quietMovesFrom(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];
  if (piece.kind === "man") {
    const forward = piece.color === "white" ? -1 : 1;
    for (const dc of [-1, 1]) {
      const nr = pos.row + forward;
      const nc = pos.col + dc;
      if (!isInside(nr, nc)) continue;
      if (board[nr][nc] !== null) continue;
      const promotes = nr === backRankFor(piece.color);
      moves.push({
        from: pos,
        to: { row: nr, col: nc },
        path: [{ row: nr, col: nc }],
        captures: [],
        promotes,
      });
    }
    return moves;
  }
  // King: slide any distance until blocked.
  for (const [dr, dc] of DIRS) {
    let r = pos.row + dr;
    let c = pos.col + dc;
    while (isInside(r, c) && board[r][c] === null) {
      moves.push({
        from: pos,
        to: { row: r, col: c },
        path: [{ row: r, col: c }],
        captures: [],
        promotes: false,
      });
      r += dr;
      c += dc;
    }
  }
  return moves;
}

/**
 * All maximal capture sequences originating from `pos` for the given piece.
 * The piece never ends a sequence with a single jump if more captures are
 * available; we return all *maximal* paths (no further capture possible).
 */
function captureSequencesFrom(
  board: Board,
  pos: Position,
  piece: Piece,
): CaptureNode[] {
  const work = cloneBoard(board);
  // Remove the piece from its starting square so it doesn't block its own ray.
  work[pos.row][pos.col] = null;
  const results: CaptureNode[] = [];
  walk(work, pos, piece, [], [], results);
  return results;
}

function walk(
  board: Board,
  current: Position,
  piece: Piece,
  pathSoFar: Position[],
  capturedSoFar: Position[],
  out: CaptureNode[],
): void {
  const oneStep = piece.kind === "man" ? singleCapturesMan : singleCapturesKing;
  const next = oneStep(board, current, piece, capturedSoFar);
  if (next.length === 0) {
    if (pathSoFar.length > 0) {
      out.push({ path: pathSoFar.slice(), captures: capturedSoFar.slice() });
    }
    return;
  }
  for (const step of next) {
    // Captured piece is removed only at the end (real rule), but we cannot
    // jump the same piece twice within a single sequence — track it instead.
    pathSoFar.push(step.landing);
    capturedSoFar.push(step.captured);
    walk(board, step.landing, piece, pathSoFar, capturedSoFar, out);
    pathSoFar.pop();
    capturedSoFar.pop();
  }
}

interface CaptureStep {
  landing: Position;
  captured: Position;
}

function alreadyCaptured(captured: Position[], r: number, c: number): boolean {
  for (const p of captured) {
    if (p.row === r && p.col === c) return true;
  }
  return false;
}

/**
 * Single-jump options for a man at `from`. Men can capture forward or
 * backward in the international rules.
 */
function singleCapturesMan(
  board: Board,
  from: Position,
  piece: Piece,
  captured: Position[],
): CaptureStep[] {
  const out: CaptureStep[] = [];
  for (const [dr, dc] of DIRS) {
    const midR = from.row + dr;
    const midC = from.col + dc;
    const landR = from.row + 2 * dr;
    const landC = from.col + 2 * dc;
    if (!isInside(landR, landC)) continue;
    const mid = board[midR]?.[midC];
    if (!mid) continue;
    if (mid.color === piece.color) continue;
    if (alreadyCaptured(captured, midR, midC)) continue;
    if (board[landR][landC] !== null) continue;
    out.push({
      landing: { row: landR, col: landC },
      captured: { row: midR, col: midC },
    });
  }
  return out;
}

/**
 * Single-jump options for a king. Slide along the diagonal, find the first
 * non-empty square; if it is an enemy not yet captured this turn and the
 * square right after it is empty, the king can land on any empty square
 * past the captured piece (still on the same diagonal) before hitting
 * another piece.
 */
function singleCapturesKing(
  board: Board,
  from: Position,
  piece: Piece,
  captured: Position[],
): CaptureStep[] {
  const out: CaptureStep[] = [];
  for (const [dr, dc] of DIRS) {
    let r = from.row + dr;
    let c = from.col + dc;
    // Walk until we hit a piece.
    while (isInside(r, c) && board[r][c] === null) {
      r += dr;
      c += dc;
    }
    if (!isInside(r, c)) continue;
    const target = board[r][c]!;
    if (target.color === piece.color) continue;
    if (alreadyCaptured(captured, r, c)) continue;
    const targetR = r;
    const targetC = c;
    // The square immediately after must exist and be empty for the jump to be legal.
    let lr = targetR + dr;
    let lc = targetC + dc;
    if (!isInside(lr, lc) || board[lr][lc] !== null) continue;
    while (isInside(lr, lc) && board[lr][lc] === null) {
      out.push({
        landing: { row: lr, col: lc },
        captured: { row: targetR, col: targetC },
      });
      lr += dr;
      lc += dc;
    }
  }
  return out;
}

/** Apply a move to a board, returning a new board. Captured pieces are removed; promotion happens at the end. */
export function applyMove(board: Board, move: Move): Board {
  const next = cloneBoard(board);
  const piece = next[move.from.row][move.from.col];
  if (!piece) throw new Error("No piece at move source");
  next[move.from.row][move.from.col] = null;
  for (const cap of move.captures) {
    next[cap.row][cap.col] = null;
  }
  const finalPiece: Piece =
    move.promotes && piece.kind === "man"
      ? { color: piece.color, kind: "king" }
      : piece;
  next[move.to.row][move.to.col] = finalPiece;
  return next;
}

/** Compute the outcome after the given player has just moved. */
export function checkOutcome(
  board: Board,
  toPlay: Color,
): { kind: "win"; winner: Color; reason: "no-pieces" | "no-moves" } | null {
  const moves = legalMoves(board, toPlay);
  if (moves.length > 0) return null;
  // Side to play has no moves: check whether they have pieces left.
  const hasPieces = board.some((row) => row.some((p) => p && p.color === toPlay));
  return {
    kind: "win",
    winner: opposite(toPlay),
    reason: hasPieces ? "no-moves" : "no-pieces",
  };
}
