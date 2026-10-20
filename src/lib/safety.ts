/**
 * Safety module (requirement 17).
 *
 * The decision fields can hold heavy, personal thoughts. This does a local,
 * keyword-based check for self-harm / suicide language and returns a calm,
 * non-judgmental response with helplines.
 *
 * Hard rules, by design:
 *  - It NEVER blocks or alters what the user saves.
 *  - It runs entirely in this browser. Nothing is stored, sent, or logged.
 *  - The helpline list is configurable (one array below).
 */

export interface Helpline {
  name: string;
  number: string;
  country: string;
  url?: string;
}

/** Configurable list — edit here to change what the message points to. */
export const HELPLINES: Helpline[] = [
  { name: "Tele-MANAS", number: "14416", country: "India" },
  { name: "988 Suicide & Crisis Lifeline", number: "988", country: "US" },
];

/**
 * Keywords are deliberately broad — a false positive just shows a gentle,
 * dismissible note, while missing someone who is struggling is far worse.
 * Matching is case-insensitive and word-bounded.
 */
const PATTERNS: RegExp[] = [
  /\bkill (my)?self\b/i,
  /\bsuicid\w*\b/i,
  /\bend (my|it all|everything)\b/i,
  /\b(want|wishing|better) to die\b/i,
  /\bno reason to live\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt myself\b/i,
  /\btake my own life\b/i,
  /\bcannot go on\b/i,
  /\bdon'?t want to (be here|wake up|exist)\b/i,
];

/** True when the text likely contains self-harm or suicide-related language. */
export function detectDistress(text: string): boolean {
  if (!text) return false;
  return PATTERNS.some((pattern) => pattern.test(text));
}

/** Scans several fields at once; true if any of them matches. */
export function detectDistressInFields(fields: Record<string, string>): boolean {
  return Object.values(fields).some(detectDistress);
}

/** The exact, non-judgmental copy shown to the user. */
export function distressMessage(): string {
  const lines = HELPLINES.map((h) => `${h.name} (${h.country}): ${h.number}`).join("  ·  ");
  return `It sounds like you might be carrying something really heavy right now. That's okay — and you don't have to carry it alone. If you'd like to talk to someone, these lines are free and confidential: ${lines}. (This note checks your text only inside your browser. Nothing was saved, sent, or shared.)`;
}
