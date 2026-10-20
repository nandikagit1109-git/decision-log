export type Outcome = "worked" | "mixed" | "didnt-work";

export const OUTCOME_LABELS: Record<Outcome, string> = {
  worked: "Worked",
  mixed: "Mixed",
  "didnt-work": "Didn't work",
};

export interface Decision {
  /** Unique id, generated with crypto.randomUUID() */
  id: string;
  title: string;
  context: string;
  /** The alternatives you weighed, one string each */
  options: string[];
  /** What you actually picked */
  choice: string;
  /** Why you picked it — the part people forget */
  reasoning: string;
  /** 1 (guessing) to 5 (certain) */
  confidence: number;
  /** When to look at it again, as "YYYY-MM-DD" */
  reviewOn: string;
  /** ISO timestamp of when the decision was logged */
  createdAt: string;
  /** Filled in once you review the outcome */
  outcome?: Outcome;
  /** One-line lesson learned */
  lesson?: string;
  /** ISO timestamp of when the outcome was recorded */
  outcomeAt?: string;
}
