"use client";

import { useEffect, useRef, useState } from "react";
import type { Board, Move, Piece, Position } from "./types";

const LEG_DURATION_MS = 220;
const CAPTURE_FADE_PADDING_MS = 140;

export interface AnimatorState {
  /** The piece that is moving, drawn at `pos` with a CSS transition to `pos`. */
  piece: Piece;
  /**
   * The position the animated `<g>` should currently target. Mutating this
   * over time (initial → path[0] → path[1]…) triggers CSS transitions.
   */
  pos: Position;
  /** True between mount and first paint — render the element without a transition. */
  primed: boolean;
  /** Total duration in ms until the animation will be complete. */
  totalDurationMs: number;
}

export interface CaptureGhost {
  pos: Position;
  piece: Piece;
}

export interface MoveAnimation {
  animator: AnimatorState | null;
  captures: CaptureGhost[];
  /** While truthy, the static piece at this destination should NOT be rendered. */
  hideStaticAt: Position | null;
}

/**
 * Drives a multi-leg slide animation when `lastMove` changes. Returns the
 * data the Board needs to render the moving piece on top of the static
 * board plus any capture ghosts.
 *
 * Captures need the *previous* board because the engine has already cleared
 * those squares by the time we render. Pass it via `prevBoard`. If
 * `prevBoard` is null (first move, undo) we render captures without piece
 * detail (fallback).
 */
export function useMoveAnimation(
  lastMove: Move | undefined,
  currentBoard: Board,
  prevBoard: Board | null,
): MoveAnimation {
  const [animation, setAnimation] = useState<MoveAnimation>({
    animator: null,
    captures: [],
    hideStaticAt: null,
  });
  const lastMoveRef = useRef<Move | undefined>(undefined);

  useEffect(() => {
    if (!lastMove) {
      lastMoveRef.current = undefined;
      // Resetting state when the trigger prop changes is intentional here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimation({ animator: null, captures: [], hideStaticAt: null });
      return;
    }
    if (lastMoveRef.current === lastMove) return;
    lastMoveRef.current = lastMove;

    const movingPiece = currentBoard[lastMove.to.row]?.[lastMove.to.col];
    if (!movingPiece) {
      setAnimation({ animator: null, captures: [], hideStaticAt: null });
      return;
    }

    const captures: CaptureGhost[] = lastMove.captures.map((pos) => {
      const fromPrev = prevBoard?.[pos.row]?.[pos.col] ?? null;
      // Fallback: render an enemy man (visually distinguishable) if we don't
      // know the actual kind/color.
      return {
        pos,
        piece:
          fromPrev ??
          ({ color: movingPiece.color === "white" ? "black" : "white", kind: "man" } as Piece),
      };
    });

    const totalLegs = Math.max(1, lastMove.path.length);
    const totalDurationMs = totalLegs * LEG_DURATION_MS + CAPTURE_FADE_PADDING_MS;

    // Phase 0: prime — render the animated piece at `from` without transition.
    setAnimation({
      animator: {
        piece: movingPiece,
        pos: lastMove.from,
        primed: true,
        totalDurationMs,
      },
      captures,
      hideStaticAt: lastMove.to,
    });

    // Two animation frames so the browser commits the primed state before we
    // change the target — without this, the transition might not engage.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setAnimation((prev) => {
          if (!prev.animator) return prev;
          return {
            ...prev,
            animator: {
              ...prev.animator,
              pos: lastMove.path[0] ?? lastMove.to,
              primed: false,
            },
          };
        });
      });
      pendingRafs.push(raf2);
    });

    const pendingRafs: number[] = [raf1];
    const pendingTimers: number[] = [];

    // Each subsequent leg: change `pos` after LEG_DURATION_MS * legIndex.
    for (let leg = 1; leg < lastMove.path.length; leg++) {
      const t = window.setTimeout(() => {
        setAnimation((prev) => {
          if (!prev.animator) return prev;
          return {
            ...prev,
            animator: { ...prev.animator, pos: lastMove.path[leg], primed: false },
          };
        });
      }, leg * LEG_DURATION_MS);
      pendingTimers.push(t);
    }

    // End: clear animation so the static board takes over.
    const endTimer = window.setTimeout(() => {
      setAnimation({ animator: null, captures: [], hideStaticAt: null });
    }, totalDurationMs);
    pendingTimers.push(endTimer);

    return () => {
      pendingRafs.forEach((id) => cancelAnimationFrame(id));
      pendingTimers.forEach((id) => clearTimeout(id));
    };
  }, [lastMove, currentBoard, prevBoard]);

  return animation;
}

export const ANIM_LEG_DURATION_MS = LEG_DURATION_MS;
