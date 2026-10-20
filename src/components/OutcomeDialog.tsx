import { useEffect, useState, type FormEvent } from "react";
import type { Decision, Outcome } from "../types";
import { OUTCOME_LABELS } from "../types";

interface Props {
  decision: Decision;
  onSave: (outcome: Outcome, lesson: string) => void;
  onClose: () => void;
}

const OUTCOMES: Outcome[] = ["worked", "mixed", "didnt-work"];

export default function OutcomeDialog({ decision, onSave, onClose }: Props) {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [lesson, setLesson] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!outcome) {
      setError("Pick how it turned out.");
      return;
    }
    if (!lesson.trim()) {
      setError("Add a one-line lesson — that's the part you'll forget.");
      return;
    }
    onSave(outcome, lesson.trim());
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="outcome-title" onSubmit={submit}>
        <h2 id="outcome-title">How did it turn out?</h2>
        <p className="dialog-sub">{decision.title}</p>

        <fieldset className="outcome-picker">
          <legend>Outcome</legend>
          <div className="outcome-row">
            {OUTCOMES.map((o) => (
              <label key={o} className={`outcome-opt ${o}${outcome === o ? " active" : ""}`}>
                <input
                  type="radio"
                  name="outcome"
                  value={o}
                  checked={outcome === o}
                  onChange={() => {
                    setOutcome(o);
                    setError(null);
                  }}
                />
                {OUTCOME_LABELS[o]}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>
            Lesson learned <em className="muted">(one line)</em>
          </span>
          <input
            type="text"
            value={lesson}
            maxLength={140}
            autoFocus
            placeholder="e.g. The cheap plan attracted users who needed the most support"
            onChange={(e) => {
              setLesson(e.target.value);
              setError(null);
            }}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <p className="dialog-note">
          Saving clears it from “Due for review” and schedules the next check-in one year from
          today.
        </p>

        <div className="form-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save outcome
          </button>
        </div>
      </form>
    </div>
  );
}
