import type { Decision, Outcome } from "./types";
import { addDays, todayISO } from "./date";

/**
 * All persistence lives in this file. The rest of the app only calls
 * loadDecisions() / saveDecisions(), so swapping localStorage for a real
 * database later means changing just these two functions.
 */

const STORAGE_KEY = "decision-log.decisions.v1";

export function newId(): string {
  return crypto.randomUUID();
}

export function loadDecisions(): Decision[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDecisions();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedDecisions();
    return parsed.map(normalize).filter((d): d is Decision => d !== null);
  } catch {
    // Corrupted or unavailable storage: start fresh rather than crash.
    return seedDecisions();
  }
}

export function saveDecisions(decisions: Decision[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // Storage full or blocked (private browsing). The app still works in memory.
  }
}

/** Fills in missing fields so an older save never breaks the UI. */
function normalize(value: unknown): Decision | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== "string") return null;

  let outcome: Outcome | undefined;
  if (v.outcome === "worked" || v.outcome === "mixed" || v.outcome === "didnt-work") {
    outcome = v.outcome;
  }

  return {
    id: typeof v.id === "string" ? v.id : newId(),
    title: v.title,
    context: typeof v.context === "string" ? v.context : "",
    options: Array.isArray(v.options)
      ? v.options.filter((o): o is string => typeof o === "string")
      : [],
    choice: typeof v.choice === "string" ? v.choice : "",
    reasoning: typeof v.reasoning === "string" ? v.reasoning : "",
    confidence:
      typeof v.confidence === "number" ? Math.min(5, Math.max(1, Math.round(v.confidence))) : 3,
    reviewOn: typeof v.reviewOn === "string" ? v.reviewOn : addDays(todayISO(), 30),
    createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString(),
    outcome,
    lesson: typeof v.lesson === "string" ? v.lesson : undefined,
    outcomeAt: typeof v.outcomeAt === "string" ? v.outcomeAt : undefined,
  };
}

/** Three realistic samples so the Due for review tab has something on day one. */
function seedDecisions(): Decision[] {
  const now = Date.now();
  const day = 86_400_000;
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

  return [
    {
      id: newId(),
      title: "Price the Pro plan at $19 instead of $29",
      context:
        "First paid tier for the side project. No data on what people would actually pay, launch is two weeks out.",
      options: ["$9/month", "$19/month", "$29/month"],
      choice: "$19/month",
      reasoning:
        "Cheaper than every competitor we found, and $19 felt like an impulse buy for a solo developer while $29 felt like a decision they'd have to justify.",
      confidence: 4,
      reviewOn: addDays(todayISO(), 214),
      createdAt: iso(365 * day),
      outcome: "mixed",
      lesson: "Signups doubled but support load tripled — the low price attracted people who weren't a fit.",
      outcomeAt: iso(40 * day),
    },
    {
      id: newId(),
      title: "Switch team chat from Slack to Discord",
      context:
        "Paying $87/month for Slack on a student budget. Everyone on the team already has Discord open all day.",
      options: ["Stay on Slack free tier", "Move to Discord", "Move to Telegram"],
      choice: "Discord",
      reasoning:
        "Free at our size, screen sharing is fine for standups, and the only real loss is Slack's search — which we barely use.",
      confidence: 4,
      reviewOn: addDays(todayISO(), -90),
      createdAt: iso(120 * day),
    },
    {
      id: newId(),
      title: "Hire a contractor for the landing page instead of doing it in-house",
      context: "Launch is in three weeks and neither of us is a designer.",
      options: ["Do it in-house", "Hire a contractor", "Buy a template"],
      choice: "Hire a contractor",
      reasoning:
        "Two weeks of our time is worth more than the $1,200 quote, and the template route always ends up looking like a template.",
      confidence: 3,
      reviewOn: todayISO(),
      createdAt: iso(30 * day),
    },
  ];
}
