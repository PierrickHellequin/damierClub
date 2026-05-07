// Lightweight minimax + alpha-beta AI for French/International draughts.
// Tuned for browser play: depth 4 returns in well under a second on a fresh
// board, depth 6 is acceptable through the midgame on a modern laptop.
//
// The evaluation function captures the basics:
//  - material with kings worth 3× a man,
//  - center bias,
//  - back-rank protection,
//  - light tempo bonus for forward men,
//  - corner men penalty (passive corner squares).

import { applyMove, legalMoves } from "./rules";
import { opposite } from "./types";
import type { Board, Color, Move } from "./types";

export type Difficulty = "facile" | "moyen" | "difficile";

const DEPTH_BY_DIFFICULTY: Record<Difficulty, number> = {
  facile: 2,
  moyen: 4,
  difficile: 6,
};

const MAN_VALUE = 100;
const KING_VALUE = 300;
const CENTER_BONUS = 4;
const BACK_RANK_BONUS = 6;
const ADVANCE_BONUS = 2;
const CORNER_PENALTY = -8;
const WIN_SCORE = 1_000_000;

const CENTER_SQUARES: Array<[number, number]> = [
  [4, 3], [4, 5], [5, 4], [5, 6],
  [4, 7], [5, 2],
];

function isCenter(r: number, c: number): boolean {
  for (const [cr, cc] of CENTER_SQUARES) if (r === cr && c === cc) return true;
  return false;
}

function isCorner(r: number, c: number): boolean {
  return (
    (r === 0 && c === 1) ||
    (r === 0 && c === 9) ||
    (r === 9 && c === 0) ||
    (r === 9 && c === 8)
  );
}

/** Static evaluation from the perspective of `me`. Higher is better for `me`. */
export function evaluate(board: Board, me: Color): number {
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const p = board[r][c];
      if (!p) continue;
      const sign = p.color === me ? 1 : -1;
      const base = p.kind === "king" ? KING_VALUE : MAN_VALUE;
      score += sign * base;
      if (isCenter(r, c)) score += sign * CENTER_BONUS;
      if (isCorner(r, c)) score += sign * CORNER_PENALTY;
      if (p.kind === "man") {
        // Back-rank protection: men still on their starting rank.
        if (p.color === "white" && r === 9) score += sign * BACK_RANK_BONUS;
        if (p.color === "black" && r === 0) score += sign * BACK_RANK_BONUS;
        // Tempo: small bonus the closer a man is to its promotion line.
        const distance = p.color === "white" ? r : 9 - r;
        score += sign * ((9 - distance) * ADVANCE_BONUS);
      }
    }
  }
  return score;
}

interface SearchResult {
  move: Move | null;
  score: number;
}

function orderMoves(moves: Move[]): Move[] {
  // Captures already win the longest-rule filter; among quiet moves prefer
  // those that approach promotion (heuristic).
  if (moves.length === 0) return moves;
  if (moves[0].captures.length > 0) return moves;
  return [...moves].sort((a, b) => {
    const da = Math.abs(a.from.row - a.to.row);
    const db = Math.abs(b.from.row - b.to.row);
    return db - da;
  });
}

/** Minimax with alpha-beta pruning. Side to play is determined by `turn`. */
function search(
  board: Board,
  turn: Color,
  me: Color,
  depth: number,
  alpha: number,
  beta: number,
): SearchResult {
  const moves = legalMoves(board, turn);
  if (moves.length === 0) {
    // Side to play has no moves → loses.
    return { move: null, score: turn === me ? -WIN_SCORE - depth : WIN_SCORE + depth };
  }
  if (depth === 0) {
    return { move: null, score: evaluate(board, me) };
  }

  const ordered = orderMoves(moves);
  let bestMove: Move | null = null;

  if (turn === me) {
    let best = -Infinity;
    for (const m of ordered) {
      const next = applyMove(board, m);
      const r = search(next, opposite(turn), me, depth - 1, alpha, beta);
      if (r.score > best) {
        best = r.score;
        bestMove = m;
      }
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return { move: bestMove, score: best };
  } else {
    let best = Infinity;
    for (const m of ordered) {
      const next = applyMove(board, m);
      const r = search(next, opposite(turn), me, depth - 1, alpha, beta);
      if (r.score < best) {
        best = r.score;
        bestMove = m;
      }
      beta = Math.min(beta, best);
      if (alpha >= beta) break;
    }
    return { move: bestMove, score: best };
  }
}

/**
 * Pick a move for the AI. The function is async so it can run inside
 * `requestIdleCallback`-style wrappers without locking the UI thread for
 * deep searches; the actual computation is still synchronous JS — the
 * caller is expected to await on a `setTimeout(..., 0)` boundary.
 */
export async function pickMove(
  board: Board,
  me: Color,
  difficulty: Difficulty = "moyen",
): Promise<Move | null> {
  const depth = DEPTH_BY_DIFFICULTY[difficulty];
  // Yield once so the calling component re-renders the "thinking" state.
  await new Promise<void>((resolve) => setTimeout(resolve, 0));

  // Very easy mode: 35% chance of picking a random legal move so the player
  // can actually win once in a while.
  if (difficulty === "facile" && Math.random() < 0.35) {
    const moves = legalMoves(board, me);
    if (moves.length === 0) return null;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const { move } = search(board, me, me, depth, -Infinity, Infinity);
  if (move) return move;
  // Fallback: pick any legal move.
  const moves = legalMoves(board, me);
  return moves.length > 0 ? moves[0] : null;
}

/**
 * Coach mode: returns the best move *and* its evaluation, plus the score
 * of the move actually played, so the UI can give feedback like
 * "you lost 0.4 points compared to the recommended move".
 *
 * Score sign: positive means good for `me`. Centipawn-equivalent (1 pawn ≈ 100).
 */
export async function analyseMove(
  board: Board,
  me: Color,
  played: Move,
  depth = 4,
): Promise<{ best: Move | null; bestScore: number; playedScore: number }> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  const { move: best, score: bestScore } = search(
    board,
    me,
    me,
    depth,
    -Infinity,
    Infinity,
  );
  // Score the played move by running the search after applying it.
  const after = applyMove(board, played);
  // The opponent now plays; from `me`'s point of view we maximise.
  const { score: oppoBest } = search(
    after,
    opposite(me),
    me,
    depth - 1,
    -Infinity,
    Infinity,
  );
  return { best, bestScore, playedScore: oppoBest };
}

/**
 * Returns the best move only (for hints). Same depth tuning as the moyen
 * difficulty so it's quick.
 */
export async function bestMoveHint(
  board: Board,
  me: Color,
): Promise<Move | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  const { move } = search(board, me, me, 4, -Infinity, Infinity);
  return move;
}
