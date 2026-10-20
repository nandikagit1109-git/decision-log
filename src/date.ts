/**
 * Tiny date helpers. Everything is stored as a plain "YYYY-MM-DD" string so the
 * data stays readable in localStorage and never shifts across time zones.
 */

export function todayISO(): string {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parse(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function addDays(iso: string, days: number): string {
  const p = parse(iso);
  if (!p) return iso;
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day + days));
  return d.toISOString().slice(0, 10);
}

export function addYears(iso: string, years: number): string {
  const p = parse(iso);
  if (!p) return iso;
  const d = new Date(Date.UTC(p.year + years, p.month - 1, p.day));
  // Clamp Feb 29 -> Feb 28 in non-leap years.
  if (d.getUTCMonth() !== p.month - 1) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}

/** Whole days from today until `iso`. Negative = in the past. */
export function daysUntil(iso: string): number {
  const p = parse(iso);
  const t = parse(todayISO());
  if (!p || !t) return 0;
  const target = Date.UTC(p.year, p.month - 1, p.day);
  const now = Date.UTC(t.year, t.month - 1, t.day);
  return Math.round((target - now) / 86_400_000);
}

/** A decision is due the moment its review date is today or earlier. */
export function isDue(iso: string): boolean {
  return daysUntil(iso) <= 0;
}

export function formatShort(iso: string): string {
  const p = parse(iso);
  if (!p) return "";
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatLong(iso: string): string {
  const p = parse(iso);
  if (!p) return "";
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "3 days overdue" / "Due today" / "in 12 days" */
export function relativeLabel(iso: string): string {
  const days = daysUntil(iso);
  if (days < 0) return `${-days} day${-days === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `in ${days} day${days === 1 ? "" : "s"}`;
}
