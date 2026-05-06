const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DATE_FMT_FULL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const RELATIVE = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

export function formatArticleDate(iso: string | null | undefined): string {
  if (!iso) return "Date inconnue";
  const d = parseLocalDateTime(iso);
  if (!d) return "Date inconnue";
  return DATE_FMT.format(d);
}

export function formatArticleDateFull(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseLocalDateTime(iso);
  if (!d) return "";
  return DATE_FMT_FULL.format(d);
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseLocalDateTime(iso);
  if (!d) return "";
  const diffMs = d.getTime() - Date.now();
  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 60) return RELATIVE.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return RELATIVE.format(days, "day");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return RELATIVE.format(months, "month");
  const years = Math.round(months / 12);
  return RELATIVE.format(years, "year");
}

// Spring serializes LocalDateTime without timezone (e.g. 2025-11-25T18:32:14).
// Parsing such a string with new Date() works in modern engines but treats it
// as local time; we keep that behavior intentionally for FR locale.
function parseLocalDateTime(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function clamp(s: string, max: number): string {
  if (!s) return s;
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
