'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { initialState } from '../../lib/dames/board';
import {
  decodeBoard,
  moveNotation,
  squareIndex,
} from '../../lib/dames/notation';
import { applyMove, legalMoves } from '../../lib/dames/rules';
import type {
  Color,
  GameState,
  Move,
  Piece,
  Position,
} from '../../lib/dames/types';
import { isDark, opposite } from '../../lib/dames/types';

export interface RecordedMove {
  /** FFJD square index, 1-50. */
  from: number;
  to: number;
}

interface Props {
  position: string;
  sideToPlay: Color;
  /** Current recorded sequence; can be empty. */
  moves: RecordedMove[];
  onChange: (next: RecordedMove[]) => void;
  size?: number;
}

interface Selection {
  from: Position;
  legal: Move[];
}

const VIEWBOX = 100;
const CELL = VIEWBOX / 10;

export function MoveRecorder({
  position,
  sideToPlay,
  moves,
  onChange,
  size = 380,
}: Props) {
  const [selection, setSelection] = useState<Selection | null>(null);

  // Replay the recorded moves on the position to compute the live board.
  const live = useMemo<{ state: GameState; error?: string }>(() => {
    const board = decodeBoard(position);
    if (!board) {
      return {
        state: initialState(),
        error: 'Position invalide.',
      };
    }
    let state: GameState = {
      board,
      turn: sideToPlay,
      history: [],
      outcome: null,
    };
    for (let i = 0; i < moves.length; i++) {
      const mv = moves[i];
      const legal = legalMoves(state.board, state.turn);
      const match = findMatch(legal, mv.from, mv.to);
      if (!match) {
        return {
          state,
          error: `Coup invalide à l'étape ${i + 1} (${mv.from}-${mv.to}).`,
        };
      }
      state = {
        board: applyMove(state.board, match),
        turn: opposite(state.turn),
        history: [...state.history, match],
        outcome: null,
      };
    }
    return { state };
  }, [position, sideToPlay, moves]);

  // Reset selection whenever the live state is rebuilt (e.g. position changes).
  useEffect(() => {
    queueMicrotask(() => setSelection(null));
  }, [position, sideToPlay, moves.length]);

  const targets = useMemo(() => {
    if (!selection) return new Map<string, Move>();
    const map = new Map<string, Move>();
    for (const m of selection.legal) map.set(`${m.to.row},${m.to.col}`, m);
    return map;
  }, [selection]);

  const movableSquares = useMemo(() => {
    if (live.error) return new Set<string>();
    const set = new Set<string>();
    for (const m of legalMoves(live.state.board, live.state.turn)) {
      set.add(`${m.from.row},${m.from.col}`);
    }
    return set;
  }, [live]);

  function handleSquareClick(row: number, col: number) {
    if (live.error) return;
    const key = `${row},${col}`;
    if (selection && targets.has(key)) {
      const move = targets.get(key)!;
      const fromIdx = squareIndex(move.from.row, move.from.col)!;
      const toIdx = squareIndex(move.to.row, move.to.col)!;
      onChange([...moves, { from: fromIdx, to: toIdx }]);
      return;
    }
    const piece = live.state.board[row]?.[col] ?? null;
    if (piece && piece.color === live.state.turn) {
      const legal = legalMoves(live.state.board, live.state.turn).filter(
        (m) => m.from.row === row && m.from.col === col,
      );
      if (legal.length > 0) {
        setSelection({ from: { row, col }, legal });
        return;
      }
    }
    setSelection(null);
  }

  function undo() {
    onChange(moves.slice(0, -1));
  }
  function clearAll() {
    onChange([]);
  }

  const turnLabel =
    live.state.turn === 'white' ? 'Trait aux Blancs' : 'Trait aux Noirs';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-6">
        <RecorderBoard
          state={live.state}
          selectedFrom={selection?.from ?? null}
          targets={targets}
          movableSquares={movableSquares}
          onSquareClick={handleSquareClick}
          size={size}
        />
        <div className="flex-1 min-w-[260px] flex flex-col gap-3 text-sm">
          <div className="rounded border border-stone-200 bg-stone-50 p-3 text-xs">
            <p>
              <strong>{turnLabel}</strong> dans la position courante.
              <br />
              {`Cliquez sur un pion en surbrillance, puis sur la case d'arrivée pour ajouter le coup à la combinaison.`}
            </p>
          </div>
          {live.error ? (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {live.error}
            </div>
          ) : null}
          <MoveList moves={moves} fromPosition={position} fromTurn={sideToPlay} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={undo}
              disabled={moves.length === 0}
            >
              ← Retirer le dernier
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={clearAll}
              disabled={moves.length === 0}
            >
              Tout effacer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function findMatch(legal: Move[], fromIdx: number, toIdx: number): Move | null {
  return (
    legal.find(
      (m) =>
        squareIndex(m.from.row, m.from.col) === fromIdx &&
        squareIndex(m.to.row, m.to.col) === toIdx,
    ) ?? null
  );
}

function MoveList({
  moves,
  fromPosition,
  fromTurn,
}: {
  moves: RecordedMove[];
  fromPosition: string;
  fromTurn: Color;
}) {
  // Replay a second time to display the textual notation per ply (we already
  // know the moves are legal because `live` did not flag an error).
  const board = decodeBoard(fromPosition);
  if (!board) return null;
  const items: Array<{ index: number; notation: string; turn: Color }> = [];
  let g: GameState = { board, turn: fromTurn, history: [], outcome: null };
  for (let i = 0; i < moves.length; i++) {
    const legal = legalMoves(g.board, g.turn);
    const m = findMatch(legal, moves[i].from, moves[i].to);
    if (!m) break;
    items.push({ index: i + 1, notation: moveNotation(m), turn: g.turn });
    g = {
      board: applyMove(g.board, m),
      turn: opposite(g.turn),
      history: [...g.history, m],
      outcome: null,
    };
  }
  if (items.length === 0) {
    return (
      <p className="text-xs text-stone-500 italic">
        Aucun coup enregistré pour la combinaison.
      </p>
    );
  }
  return (
    <ol className="rounded border border-stone-200 bg-white divide-y divide-stone-100 text-xs font-mono">
      {items.map((it) => (
        <li
          key={it.index}
          className="flex items-center gap-2 px-3 py-1.5"
        >
          <span className="w-6 text-stone-400">{it.index}.</span>
          <span className={it.turn === 'white' ? 'text-stone-900' : 'text-stone-500'}>
            {it.turn === 'white' ? 'B' : 'N'}
          </span>
          <span>{it.notation}</span>
        </li>
      ))}
    </ol>
  );
}

function RecorderBoard({
  state,
  selectedFrom,
  targets,
  movableSquares,
  onSquareClick,
  size,
}: {
  state: GameState;
  selectedFrom: Position | null;
  targets: Map<string, Move>;
  movableSquares: Set<string>;
  onSquareClick: (row: number, col: number) => void;
  size: number;
}) {
  return (
    <svg
      viewBox={`-3 -3 ${VIEWBOX + 6} ${VIEWBOX + 6}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="border-2 border-stone-800 bg-stone-100"
    >
      {Array.from({ length: 10 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          const dark = isDark(r, c);
          const x = c * CELL;
          const y = r * CELL;
          const isSelected =
            selectedFrom &&
            selectedFrom.row === r &&
            selectedFrom.col === c;
          const isTarget = targets.has(`${r},${c}`);
          return (
            <g key={`s-${r}-${c}`} onClick={() => onSquareClick(r, c)} style={{ cursor: dark ? 'pointer' : 'default' }}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                fill={dark ? '#3a2a1c' : '#f4ede0'}
              />
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
      {state.board.map((row, r) =>
        row.map((piece, c) => {
          if (!piece) return null;
          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;
          const movable = movableSquares.has(`${r},${c}`);
          return (
            <PieceSvg
              key={`p-${r}-${c}`}
              piece={piece}
              cx={x}
              cy={y}
              r={CELL * 0.4}
              movable={movable}
              onClick={() => onSquareClick(r, c)}
            />
          );
        }),
      )}
      {Array.from({ length: 10 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          if (!isDark(r, c)) return null;
          const idx = squareIndex(r, c);
          if (!idx) return null;
          return (
            <text
              key={`n-${r}-${c}`}
              x={c * CELL + 0.6}
              y={r * CELL + 1.8}
              fontSize={1.8}
              fill="#f4ede0"
              fillOpacity={0.5}
              pointerEvents="none"
              style={{ fontFamily: 'monospace' }}
            >
              {idx}
            </text>
          );
        }),
      )}
    </svg>
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
  const isWhite = piece.color === 'white';
  const fill = isWhite ? '#f1e6c8' : '#1a1714';
  const stroke = isWhite ? '#1a1714' : '#000';
  const accent = isWhite ? '#8c1f1f' : '#a07a2c';
  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      onClick={onClick}
      style={{ cursor: movable ? 'pointer' : 'default' }}
    >
      <ellipse cx={0} cy={r * 0.18} rx={r * 1.05} ry={r * 0.32} fill="#000" fillOpacity={0.25} />
      <circle cx={0} cy={0} r={r} fill={fill} stroke={stroke} strokeWidth={0.4} />
      <circle cx={0} cy={0} r={r * 0.78} fill="none" stroke={stroke} strokeWidth={0.25} strokeOpacity={0.5} />
      {piece.kind === 'king' ? (
        <text
          x={0}
          y={r * 0.18}
          textAnchor="middle"
          fontSize={r * 0.9}
          fill={accent}
          style={{ fontWeight: 700, pointerEvents: 'none' }}
        >
          ♛
        </text>
      ) : null}
      {movable ? (
        <circle cx={0} cy={0} r={r + 0.6} fill="none" stroke="#2d4a3e" strokeWidth={0.3} strokeOpacity={0.7} />
      ) : null}
    </g>
  );
}
