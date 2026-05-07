"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { squareIndex } from "@/lib/dames/notation";
import { BOARD_SIZE, isDark } from "@/lib/dames/types";
import {
  ANIM_LEG_DURATION_MS,
  useMoveAnimation,
} from "@/lib/dames/useMoveAnimation";
import type {
  Board as BoardData,
  Color,
  GameState,
  Move,
  Piece,
  Position,
} from "@/lib/dames/types";

interface BoardProps {
  state: GameState;
  selectedFrom: Position | null;
  targets: Map<string, Move>;
  movableSquares: Set<string>;
  onPickSource: (pos: Position) => void;
  onPickTarget: (pos: Position) => void;
  /** Show the side currently in check (no captures available though). */
  flipped?: boolean;
  /** Render as a static diagram (no interaction). */
  readOnly?: boolean;
  /** Last move played, for highlighting and animation. */
  lastMove?: Move;
  /** Board *before* `lastMove` was applied — used to draw fading capture ghosts. */
  prevBoard?: BoardData | null;
  /** Optional CSS size: a single number applied as both width and height. */
  size?: number;
}

const VIEWBOX = 100;
const CELL = VIEWBOX / BOARD_SIZE;

function cellCenter(row: number, col: number, flipped: boolean) {
  const x = (flipped ? BOARD_SIZE - 1 - col : col) * CELL + CELL / 2;
  const y = (flipped ? BOARD_SIZE - 1 - row : row) * CELL + CELL / 2;
  return { x, y };
}

export function Board({
  state,
  selectedFrom,
  targets,
  movableSquares,
  onPickSource,
  onPickTarget,
  flipped = false,
  readOnly = false,
  lastMove,
  prevBoard = null,
}: BoardProps) {
  const rows = useMemo(
    () => (flipped ? [...Array(BOARD_SIZE).keys()].reverse() : [...Array(BOARD_SIZE).keys()]),
    [flipped],
  );
  const cols = useMemo(
    () => (flipped ? [...Array(BOARD_SIZE).keys()].reverse() : [...Array(BOARD_SIZE).keys()]),
    [flipped],
  );

  const animation = useMoveAnimation(lastMove, state.board, prevBoard ?? null);

  function handleSquareClick(row: number, col: number) {
    if (readOnly) return;
    const key = `${row},${col}`;
    if (targets.has(key)) {
      onPickTarget({ row, col });
      return;
    }
    const piece = state.board[row][col];
    if (piece && piece.color === state.turn) {
      onPickSource({ row, col });
      return;
    }
    onPickSource({ row, col });
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`-6 -6 ${VIEWBOX + 12} ${VIEWBOX + 12}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
        role="grid"
        aria-label="Damier 10×10"
      >
        {/* Outer frame */}
        <rect
          x={-3}
          y={-3}
          width={VIEWBOX + 6}
          height={VIEWBOX + 6}
          fill="#221b15"
        />
        <rect x={0} y={0} width={VIEWBOX} height={VIEWBOX} fill="#f4ede0" />

        {/* Squares */}
        {rows.map((row) =>
          cols.map((col) => {
            const dark = isDark(row, col);
            const x = (flipped ? BOARD_SIZE - 1 - col : col) * CELL;
            const y = (flipped ? BOARD_SIZE - 1 - row : row) * CELL;
            const fill = dark ? "#3a2a1c" : "#f4ede0";
            const key = `${row}-${col}`;
            const isSelected =
              selectedFrom &&
              selectedFrom.row === row &&
              selectedFrom.col === col;
            const isTarget = targets.has(`${row},${col}`);
            const isLastFrom =
              lastMove &&
              lastMove.from.row === row &&
              lastMove.from.col === col;
            const isLastTo =
              lastMove && lastMove.to.row === row && lastMove.to.col === col;
            const isLastCapture =
              lastMove?.captures.some((c) => c.row === row && c.col === col) ??
              false;
            return (
              <g key={key}>
                <rect
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  fill={fill}
                  onClick={() => handleSquareClick(row, col)}
                  className={cn(!readOnly && dark && "cursor-pointer")}
                />
                {isLastFrom || isLastTo || isLastCapture ? (
                  <rect
                    x={x + 0.4}
                    y={y + 0.4}
                    width={CELL - 0.8}
                    height={CELL - 0.8}
                    fill="none"
                    stroke={isLastCapture ? "#8c1f1f" : "#a07a2c"}
                    strokeWidth={0.6}
                    strokeDasharray="1.5 1"
                    pointerEvents="none"
                  />
                ) : null}
                {isSelected ? (
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    fill="#8c1f1f"
                    fillOpacity={0.18}
                    pointerEvents="none"
                  />
                ) : null}
                {isTarget ? (
                  <circle
                    cx={x + CELL / 2}
                    cy={y + CELL / 2}
                    r={CELL * 0.18}
                    fill="#2d4a3e"
                    fillOpacity={0.55}
                    pointerEvents="none"
                  />
                ) : null}
              </g>
            );
          }),
        )}

        {/* Static pieces (skip the destination of an in-flight animation) */}
        {state.board.map((row, r) =>
          row.map((piece, c) => {
            if (!piece) return null;
            if (
              animation.hideStaticAt &&
              animation.hideStaticAt.row === r &&
              animation.hideStaticAt.col === c
            ) {
              return null;
            }
            const { x, y } = cellCenter(r, c, flipped);
            const movable = !readOnly && movableSquares.has(`${r},${c}`);
            return (
              <PieceSvg
                key={`p-${r}-${c}`}
                piece={piece}
                cx={x}
                cy={y}
                r={CELL * 0.4}
                movable={movable}
                onClick={() => handleSquareClick(r, c)}
              />
            );
          }),
        )}

        {/* Capture ghosts — fade out during the animation */}
        {animation.captures.map((cap, i) => {
          const { x, y } = cellCenter(cap.pos.row, cap.pos.col, flipped);
          // Outer <g> positions the ghost; the inner <g> only animates opacity
          // so the SVG transform attribute is not overridden by the keyframe.
          return (
            <g
              key={`cap-${i}`}
              transform={`translate(${x}, ${y})`}
              pointerEvents="none"
            >
              <g
                style={{
                  animation: `dames-cap-fade ${animation.animator?.totalDurationMs ?? 360}ms ease-out forwards`,
                }}
              >
                <CaptureGhostShape piece={cap.piece} r={CELL * 0.4} />
              </g>
            </g>
          );
        })}

        {/* Animated piece on top */}
        {animation.animator ? (
          <g
            transform={`translate(${cellCenter(animation.animator.pos.row, animation.animator.pos.col, flipped).x}, ${cellCenter(animation.animator.pos.row, animation.animator.pos.col, flipped).y})`}
            style={{
              transition: animation.animator.primed
                ? "none"
                : `transform ${ANIM_LEG_DURATION_MS}ms cubic-bezier(.4,0,.2,1)`,
              pointerEvents: "none",
            }}
          >
            <PieceSvg
              piece={animation.animator.piece}
              cx={0}
              cy={0}
              r={CELL * 0.4}
              movable={false}
              onClick={() => {}}
            />
          </g>
        ) : null}

        {/* Square numbers (FFJD notation) — small, on dark squares only */}
        {rows.map((row) =>
          cols.map((col) => {
            if (!isDark(row, col)) return null;
            const idx = squareIndex(row, col);
            if (!idx) return null;
            const x = (flipped ? BOARD_SIZE - 1 - col : col) * CELL + 0.6;
            const y = (flipped ? BOARD_SIZE - 1 - row : row) * CELL + 1.6;
            return (
              <text
                key={`n-${row}-${col}`}
                x={x}
                y={y}
                fontSize={1.6}
                fill="#f4ede0"
                fillOpacity={0.5}
                pointerEvents="none"
                style={{ fontFamily: "var(--font-meta)" }}
              >
                {idx}
              </text>
            );
          }),
        )}
      </svg>
    </div>
  );
}

function PieceSvg({
  piece,
  cx,
  cy,
  r,
  movable,
  onClick,
}: {
  piece: Piece;
  cx: number;
  cy: number;
  r: number;
  movable: boolean;
  onClick: () => void;
}) {
  const isWhite = piece.color === "white";
  const fill = isWhite ? "#f1e6c8" : "#1a1714";
  const stroke = isWhite ? "#1a1714" : "#000";
  const accent = isWhite ? "#8c1f1f" : "#a07a2c";
  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      onClick={onClick}
      className={movable ? "cursor-pointer" : "cursor-default"}
    >
      <ellipse cx={0} cy={r * 0.18} rx={r * 1.05} ry={r * 0.32} fill="#000" fillOpacity={0.25} />
      <circle cx={0} cy={0} r={r} fill={fill} stroke={stroke} strokeWidth={0.4} />
      <circle cx={0} cy={0} r={r * 0.78} fill="none" stroke={stroke} strokeWidth={0.25} strokeOpacity={0.5} />
      {piece.kind === "king" ? (
        <g>
          <circle cx={0} cy={0} r={r * 0.45} fill="none" stroke={accent} strokeWidth={0.6} />
          <text
            x={0}
            y={r * 0.18}
            textAnchor="middle"
            fontSize={r * 0.9}
            fill={accent}
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            ♛
          </text>
        </g>
      ) : null}
      {movable ? (
        <circle cx={0} cy={0} r={r + 0.6} fill="none" stroke="#2d4a3e" strokeWidth={0.3} strokeOpacity={0.7} />
      ) : null}
    </g>
  );
}

/**
 * Smaller, opacity-driven version of a piece, used by the fading capture
 * ghosts. The piece does NOT receive interactions.
 */
function CaptureGhostShape({ piece, r }: { piece: Piece; r: number }) {
  const isWhite = piece.color === "white";
  const fill = isWhite ? "#f1e6c8" : "#1a1714";
  const stroke = isWhite ? "#1a1714" : "#000";
  return (
    <>
      <ellipse cx={0} cy={r * 0.18} rx={r * 1.05} ry={r * 0.32} fill="#000" fillOpacity={0.25} />
      <circle cx={0} cy={0} r={r} fill={fill} stroke={stroke} strokeWidth={0.4} />
      <circle
        cx={0}
        cy={0}
        r={r * 0.5}
        fill="none"
        stroke="#8c1f1f"
        strokeWidth={0.6}
      />
      <line
        x1={-r * 0.5}
        y1={-r * 0.5}
        x2={r * 0.5}
        y2={r * 0.5}
        stroke="#8c1f1f"
        strokeWidth={0.6}
      />
    </>
  );
}

export type { BoardProps };
export type { Color };
