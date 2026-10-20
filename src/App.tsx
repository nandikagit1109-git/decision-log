import { useEffect, useMemo, useState } from "react";
import type { Decision, Outcome } from "./types";
import { OUTCOME_LABELS } from "./types";
import { loadDecisions, saveDecisions } from "./storage";
import { addYears, formatLong, isDue, todayISO } from "./date";
import DecisionCard from "./components/DecisionCard";
import DecisionForm from "./components/DecisionForm";
import OutcomeDialog from "./components/OutcomeDialog";

type Tab = "all" | "due";
type FormState = { mode: "new" } | { mode: "edit"; decision: Decision } | null;

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>(loadDecisions);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [outcomeFor, setOutcomeFor] = useState<Decision | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Every change to the list is written straight back to localStorage.
  useEffect(() => {
    saveDecisions(decisions);
  }, [decisions]);

  // Toasts disappear on their own so the demo stays hands-free.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const dueList = useMemo(
    () =>
      decisions
        .filter((d) => isDue(d.reviewOn))
        .sort((a, b) => a.reviewOn.localeCompare(b.reviewOn)),
    [decisions],
  );

  const newestFirst = useMemo(
    () => [...decisions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [decisions],
  );

  const trimmedQuery = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const base = tab === "due" ? dueList : newestFirst;
    if (!trimmedQuery) return base;
    return base.filter((d) =>
      [d.title, d.context, d.choice, d.reasoning, d.lesson ?? "", ...d.options]
        .join(" ")
        .toLowerCase()
        .includes(trimmedQuery),
    );
  }, [tab, dueList, newestFirst, trimmedQuery]);

  function handleSave(decision: Decision) {
    const editing = decisions.some((d) => d.id === decision.id);
    setDecisions((ds) =>
      editing ? ds.map((d) => (d.id === decision.id ? decision : d)) : [decision, ...ds],
    );
    setForm(null);
    setToast(
      editing
        ? "Decision updated."
        : `Saved — we'll remind you on ${formatLong(decision.reviewOn)}.`,
    );
  }

  function handleOutcome(decision: Decision, outcome: Outcome, lesson: string) {
    const updated: Decision = {
      ...decision,
      outcome,
      lesson,
      outcomeAt: new Date().toISOString(),
      // Marking an outcome clears "due" and schedules the next check-in a year out.
      reviewOn: addYears(todayISO(), 1),
    };
    setDecisions((ds) => ds.map((d) => (d.id === decision.id ? updated : d)));
    setOutcomeFor(null);
    setToast(`Marked "${OUTCOME_LABELS[outcome]}" — next review ${formatLong(updated.reviewOn)}.`);
  }

  function handleDelete(decision: Decision) {
    if (!window.confirm(`Delete "${decision.title}"? This can't be undone.`)) return;
    setDecisions((ds) => ds.filter((d) => d.id !== decision.id));
    setToast("Decision deleted.");
  }

  // Search only belongs to the "All" view, so switching tabs resets it —
  // otherwise a stale query would silently filter the Due list.
  function switchTab(next: Tab) {
    setTab(next);
    setQuery("");
  }

  function handleEdit(decision: Decision) {
    setForm({ mode: "edit", decision });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h1>Decision Log</h1>
              <p className="brand-sub">
                {decisions.length} decision{decisions.length === 1 ? "" : "s"} recorded
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <nav className="tabs" aria-label="Views">
              <button
                className={tab === "all" ? "tab active" : "tab"}
                onClick={() => switchTab("all")}
                aria-current={tab === "all"}
              >
                All decisions
              </button>
              <button
                className={tab === "due" ? "tab active" : "tab"}
                onClick={() => switchTab("due")}
                aria-current={tab === "due"}
              >
                Due for review
                {dueList.length > 0 && <span className="tab-count">{dueList.length}</span>}
              </button>
            </nav>
            <button
              className="btn btn-primary"
              onClick={() => setForm({ mode: "new" })}
            >
              + New decision
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {form && (
          <DecisionForm
            key={form.mode === "edit" ? form.decision.id : "new"}
            initial={form.mode === "edit" ? form.decision : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
          />
        )}

        {tab === "all" && (
          <div className="search-row">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="search"
              type="text"
              placeholder="Search titles, options, reasoning, lessons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search decisions"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        )}

        {tab === "due" && (
          <p className="view-note">
            {dueList.length === 0
              ? "Nothing waiting — every decision has been reviewed."
              : `${dueList.length} decision${dueList.length === 1 ? "" : "s"} whose review date has arrived. Mark how each one turned out.`}
          </p>
        )}

        <div className="list">
          {visible.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              dueView={tab === "due"}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOutcome={setOutcomeFor}
            />
          ))}
        </div>

        {visible.length === 0 && tab === "due" && (
          <div className="empty">
            <h3>Nothing due for review</h3>
            <p>When a decision's review date arrives, it shows up here.</p>
          </div>
        )}

        {visible.length === 0 && tab === "all" && trimmedQuery && (
          <div className="empty">
            <h3>No matches</h3>
            <p>
              Nothing matches "{query.trim()}". Try a different word — search covers titles,
              options, reasoning and lessons.
            </p>
          </div>
        )}

        {visible.length === 0 && tab === "all" && !trimmedQuery && (
          <div className="empty">
            <h3>No decisions yet</h3>
            <p>Write down your first one while the reasoning is still fresh.</p>
            <button className="btn btn-primary" onClick={() => setForm({ mode: "new" })}>
              + Add your first decision
            </button>
          </div>
        )}
      </main>

      {outcomeFor && (
        <OutcomeDialog
          decision={outcomeFor}
          onSave={(outcome, lesson) => handleOutcome(outcomeFor, outcome, lesson)}
          onClose={() => setOutcomeFor(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
