import type { PublicEloPoint } from "@/types/api";

interface Props {
  points: PublicEloPoint[];
  width?: number;
  height?: number;
}

const PADDING = { top: 20, right: 24, bottom: 32, left: 48 };

export function EloChart({ points, width = 800, height = 280 }: Props) {
  if (points.length === 0) {
    return (
      <div className="border border-rule bg-paper-deep paper-grain p-6 text-center text-ink-soft italic">
        Aucun historique de points enregistré pour ce joueur.
      </div>
    );
  }

  const w = width;
  const h = height;

  // Compute Y range with a 5% margin so the line never touches the axes.
  const values = points.map((p) => p.points);
  let minY = Math.min(...values);
  let maxY = Math.max(...values);
  if (minY === maxY) {
    minY = minY - 50;
    maxY = maxY + 50;
  } else {
    const span = maxY - minY;
    minY = Math.floor(minY - span * 0.08);
    maxY = Math.ceil(maxY + span * 0.08);
  }
  const yRange = maxY - minY || 1;

  // X positions are evenly spaced (chronological order, indexes).
  const innerW = w - PADDING.left - PADDING.right;
  const innerH = h - PADDING.top - PADDING.bottom;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + innerH - ((p.points - minY) / yRange) * innerH,
    raw: p,
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(PADDING.top + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(PADDING.top + innerH).toFixed(1)} Z`
      : "";

  // Y-axis ticks: 4 evenly spaced
  const ticksY = computeTicks(minY, maxY, 4);
  // X labels: first, middle and last point dates
  const xLabels = pickDateLabels(coords);

  return (
    <div className="border border-rule bg-paper-deep paper-grain p-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="Évolution des points ELO"
      >
        {/* Y gridlines + labels */}
        {ticksY.map((v) => {
          const y = PADDING.top + innerH - ((v - minY) / yRange) * innerH;
          return (
            <g key={`y-${v}`}>
              <line
                x1={PADDING.left}
                x2={w - PADDING.right}
                y1={y}
                y2={y}
                stroke="#b8a98a"
                strokeWidth={0.5}
                strokeDasharray="2 3"
              />
              <text
                x={PADDING.left - 8}
                y={y + 3}
                textAnchor="end"
                fontSize={10}
                fill="#574c40"
                style={{ fontFamily: "var(--font-meta)" }}
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Axis baseline */}
        <line
          x1={PADDING.left}
          x2={w - PADDING.right}
          y1={PADDING.top + innerH}
          y2={PADDING.top + innerH}
          stroke="#1a1714"
          strokeWidth={1}
        />

        {/* Area under the line */}
        {areaPath ? (
          <path d={areaPath} fill="#8c1f1f" fillOpacity={0.08} stroke="none" />
        ) : null}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#8c1f1f"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Points */}
        {coords.map((c, i) => (
          <circle
            key={`p-${i}`}
            cx={c.x}
            cy={c.y}
            r={2.4}
            fill="#1a1714"
          >
            <title>
              {`${formatDate(c.raw.date)} · ${c.raw.points} pts (${c.raw.pointsChange >= 0 ? "+" : ""}${c.raw.pointsChange})${c.raw.label ? ` — ${c.raw.label}` : ""}`}
            </title>
          </circle>
        ))}

        {/* X labels */}
        {xLabels.map((l) => (
          <text
            key={l.x}
            x={l.x}
            y={h - 10}
            textAnchor="middle"
            fontSize={10}
            fill="#574c40"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function computeTicks(min: number, max: number, count: number): number[] {
  if (count <= 1) return [min, max];
  const step = (max - min) / (count - 1);
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(Math.round(min + i * step));
  }
  return ticks;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function pickDateLabels(
  coords: Array<{ x: number; raw: PublicEloPoint }>,
): Array<{ x: number; label: string }> {
  if (coords.length === 0) return [];
  if (coords.length === 1) {
    return [{ x: coords[0].x, label: formatDate(coords[0].raw.date) }];
  }
  const first = coords[0];
  const last = coords[coords.length - 1];
  const middle = coords[Math.floor(coords.length / 2)];
  const result = [
    { x: first.x, label: formatDate(first.raw.date) },
    { x: last.x, label: formatDate(last.raw.date) },
  ];
  if (coords.length > 4) {
    result.splice(1, 0, { x: middle.x, label: formatDate(middle.raw.date) });
  }
  return result;
}
