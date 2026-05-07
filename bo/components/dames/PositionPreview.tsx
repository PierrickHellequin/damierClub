'use client';

import React from 'react';

/**
 * Read-only preview of an encoded board position for the BO admin pages.
 * Encoding: 50 chars, one per dark square top-left → bottom-right,
 * with '.' = empty, 'w/W' = white man/king, 'b/B' = black man/king.
 */
export function PositionPreview({ position, size = 240 }: { position: string; size?: number }) {
  const isValid = position && position.length === 50;
  const cells = parsePosition(position);

  return (
    <div className="flex flex-col items-start gap-2">
      <svg
        viewBox="-2 -2 104 104"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="border border-stone-700 bg-stone-200"
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
        {cells.map((cell, i) => {
          if (!cell.piece) return null;
          const { row, col } = cell;
          const cx = col * 10 + 5;
          const cy = row * 10 + 5;
          const isWhite = cell.piece === 'w' || cell.piece === 'W';
          const isKing = cell.piece === 'W' || cell.piece === 'B';
          return (
            <g key={`p-${i}`}>
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
                  style={{ fontWeight: 700 }}
                >
                  ♛
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {!isValid ? (
        <p className="text-xs text-red-700">Position invalide (doit faire 50 caractères).</p>
      ) : null}
    </div>
  );
}

interface ParsedCell {
  row: number;
  col: number;
  piece: '.' | 'w' | 'W' | 'b' | 'B';
}

function parsePosition(position: string): ParsedCell[] {
  const cells: ParsedCell[] = [];
  if (!position || position.length !== 50) return cells;
  for (let i = 0; i < 50; i++) {
    const ch = position[i] as ParsedCell['piece'];
    const row = Math.floor(i / 5);
    const offset = row % 2 === 0 ? 1 : 0;
    const col = (i % 5) * 2 + offset;
    cells.push({ row, col, piece: ch });
  }
  return cells;
}
