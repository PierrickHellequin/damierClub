'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Tool = '.' | 'w' | 'W' | 'b' | 'B';

const PALETTE: Array<{ tool: Tool; label: string; description: string }> = [
  { tool: '.', label: 'Vide', description: 'Effacer la case' },
  { tool: 'w', label: 'Pion blanc', description: 'Placer un pion blanc' },
  { tool: 'W', label: 'Dame blanche', description: 'Placer une dame blanche' },
  { tool: 'b', label: 'Pion noir', description: 'Placer un pion noir' },
  { tool: 'B', label: 'Dame noire', description: 'Placer une dame noire' },
];

const EMPTY = '.'.repeat(50);

const INITIAL_POSITION = (() => {
  // Standard 10×10 setup: black on rows 0-3, white on rows 6-9.
  const arr = Array.from({ length: 50 }, () => '.');
  for (let i = 0; i < 50; i++) {
    const row = Math.floor(i / 5);
    if (row < 4) arr[i] = 'b';
    else if (row > 5) arr[i] = 'w';
  }
  return arr.join('');
})();

interface Props {
  position: string;
  onChange: (next: string) => void;
  size?: number;
}

export function PositionEditor({ position, onChange, size = 360 }: Props) {
  const [tool, setTool] = useState<Tool>('w');
  const safe = position && position.length === 50 ? position : EMPTY;

  function setSquare(squareIndex: number, value: Tool) {
    const arr = safe.split('');
    arr[squareIndex] = value;
    onChange(arr.join(''));
  }

  function handleClick(e: React.MouseEvent, squareIndex: number) {
    // Shift + click acts as eraser regardless of selected tool.
    const value: Tool = e.shiftKey ? '.' : tool;
    setSquare(squareIndex, value);
  }

  function handleContextMenu(e: React.MouseEvent, squareIndex: number) {
    e.preventDefault();
    setSquare(squareIndex, '.');
  }

  function countPieces(p: string) {
    let w = 0,
      b = 0;
    for (const ch of p) {
      if (ch === 'w' || ch === 'W') w++;
      if (ch === 'b' || ch === 'B') b++;
    }
    return { w, b };
  }

  const counts = countPieces(safe);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p) => (
          <button
            key={p.tool}
            type="button"
            onClick={() => setTool(p.tool)}
            className={
              'flex items-center gap-2 border px-3 py-2 text-sm transition-colors ' +
              (tool === p.tool
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 hover:border-stone-900')
            }
            title={p.description}
          >
            <ToolIcon tool={p.tool} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <BoardSvg
          position={safe}
          size={size}
          onSquareClick={handleClick}
          onSquareContextMenu={handleContextMenu}
        />
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-xs text-stone-500">
            {`Clic gauche : pose l'outil sélectionné.`}
            <br />
            Maj+clic ou clic droit : efface la case.
          </p>
          <div className="rounded border border-stone-200 bg-stone-50 p-3 text-xs">
            <p>
              Pièces blanches : <strong>{counts.w}</strong> · Pièces noires :{' '}
              <strong>{counts.b}</strong>
            </p>
            <p className="mt-1 text-stone-500">
              {counts.w === 0 && counts.b === 0
                ? 'Plateau vide.'
                : counts.w + counts.b > 40
                  ? 'Trop de pièces (max théorique 40).'
                  : 'OK'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onChange(EMPTY)}
            >
              Vider le plateau
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onChange(INITIAL_POSITION)}
            >
              Position de départ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool === '.') {
    return (
      <span
        aria-hidden
        className="inline-block h-5 w-5 border border-dashed border-stone-400"
      />
    );
  }
  const isWhite = tool === 'w' || tool === 'W';
  const isKing = tool === 'W' || tool === 'B';
  return (
    <svg width={20} height={20} viewBox="-10 -10 20 20" aria-hidden>
      <circle
        r={8}
        fill={isWhite ? '#f1e6c8' : '#1a1714'}
        stroke="#1a1714"
        strokeWidth={1}
      />
      {isKing ? (
        <text
          x={0}
          y={3}
          textAnchor="middle"
          fontSize={10}
          fill={isWhite ? '#8c1f1f' : '#a07a2c'}
          style={{ fontWeight: 700 }}
        >
          ♛
        </text>
      ) : null}
    </svg>
  );
}

function BoardSvg({
  position,
  size,
  onSquareClick,
  onSquareContextMenu,
}: {
  position: string;
  size: number;
  onSquareClick: (e: React.MouseEvent, squareIndex: number) => void;
  onSquareContextMenu: (e: React.MouseEvent, squareIndex: number) => void;
}) {
  const cells: Array<{ row: number; col: number; index: number; piece: string }> = [];
  for (let i = 0; i < 50; i++) {
    const row = Math.floor(i / 5);
    const offset = row % 2 === 0 ? 1 : 0;
    const col = (i % 5) * 2 + offset;
    cells.push({ row, col, index: i, piece: position[i] });
  }

  return (
    <svg
      viewBox="-2 -2 104 104"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="border-2 border-stone-800 bg-stone-100"
      role="grid"
      aria-label="Éditeur de position"
    >
      {Array.from({ length: 10 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          const dark = (r + c) % 2 === 1;
          return (
            <rect
              key={`s-${r}-${c}`}
              x={c * 10}
              y={r * 10}
              width={10}
              height={10}
              fill={dark ? '#3a2a1c' : '#f4ede0'}
            />
          );
        }),
      )}
      {cells.map((cell) => {
        const cx = cell.col * 10 + 5;
        const cy = cell.row * 10 + 5;
        const isWhite = cell.piece === 'w' || cell.piece === 'W';
        const isKing = cell.piece === 'W' || cell.piece === 'B';
        const isEmpty = cell.piece === '.';
        return (
          <g
            key={`g-${cell.index}`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => onSquareClick(e, cell.index)}
            onContextMenu={(e) => onSquareContextMenu(e, cell.index)}
          >
            {/* invisible hit zone covering the dark square */}
            <rect
              x={cell.col * 10}
              y={cell.row * 10}
              width={10}
              height={10}
              fill="transparent"
            />
            {!isEmpty ? (
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={isWhite ? '#f1e6c8' : '#1a1714'}
                  stroke="#1a1714"
                  strokeWidth={0.4}
                />
                {isKing ? (
                  <text
                    x={cx}
                    y={cy + 1.5}
                    textAnchor="middle"
                    fontSize={4}
                    fill={isWhite ? '#8c1f1f' : '#a07a2c'}
                    style={{ fontWeight: 700, pointerEvents: 'none' }}
                  >
                    ♛
                  </text>
                ) : null}
              </>
            ) : null}
          </g>
        );
      })}
      {/* Square numbers */}
      {cells.map((cell) => (
        <text
          key={`n-${cell.index}`}
          x={cell.col * 10 + 0.6}
          y={cell.row * 10 + 2.4}
          fontSize={2}
          fill="#f4ede0"
          fillOpacity={0.5}
          pointerEvents="none"
          style={{ fontFamily: 'monospace' }}
        >
          {cell.index + 1}
        </text>
      ))}
    </svg>
  );
}
