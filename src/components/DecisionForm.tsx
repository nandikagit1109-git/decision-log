import { useState, type FormEvent } from "react";
import type { Decision } from "../types";
import { newId } from "../storage";
import { addDays, formatLong, todayISO } from "../date";

interface Props {
  /** Present when editing an existing decision. */
  initial?: Decision;
  onSave: (decision: Decision) => void;
  onCancel: () => void;
}

const CONFIDENCE_LABELS = ["Guessing", "Lean", "Fairly sure", "Confident", "Certain"];

export default function DecisionForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [context, setContext] = useState(initial?.context ?? "");
  const [options, setOptions] = useState<string[]>(initial?.options ?? ["", ""]);
  const [choice, setChoice] = useState(initial?.choice ?? "");
  const [reasoning, setReasoning] = useState(initial?.reasoning ?? "");
  const [confidence, setConfidence] = useState(initial?.confidence ?? 3);
  const [reviewOn, setReviewOn] = useState(initial?.reviewOn ?? addDays(todayISO(), 30));
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give it a short title so you'll recognise it later.");
      return;
    }
    if (!choice.trim()) {
      setError("Write the choice you actually made — even if it feels obvious now.");
      return;
    }
    onSave({
      id: initial?.id ?? newId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      title: title.trim(),
      context: context.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      choice: choice.trim(),
      reasoning: reasoning.trim(),
      confidence,
      reviewOn,
      outcome: initial?.outcome,
      lesson: initial?.lesson,
      outcomeAt: initial?.outcomeAt,
    });
  }

  function setOption(index: number, value: string) {
    setOptions(options.map((o, i) => (i === index ? value : o)));
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <h2>{initial ? "Edit decision" : "New decision"}</h2>

      <label className="field">
        <span>What did you decide?</span>
        <input
          type="text"
          value={title}
          autoFocus
          maxLength={120}
          placeholder="e.g. Move analytics from Google Analytics to Plausible"
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Context</span>
          <textarea
            value={context}
            rows={4}
            placeholder="What was going on? What prompted the decision?"
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <div className="field">
          <span className="field-label">Options considered</span>
          <ul className="options-editor">
            {options.map((option, i) => (
              <li key={i}>
                <input
                  type="text"
                  value={option}
                  maxLength={120}
                  placeholder={i === 0 ? "The obvious one" : `Alternative ${i + 1}`}
                  onChange={(e) => setOption(i, e.target.value)}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Remove option ${i + 1}`}
                    onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={() => setOptions([...options, ""])}
          >
            + Add option
          </button>
        </div>
      </div>

      <label className="field">
        <span>Choice made</span>
        <input
          type="text"
          value={choice}
          maxLength={160}
          placeholder="What you actually picked"
          onChange={(e) => {
            setChoice(e.target.value);
            setError(null);
          }}
        />
      </label>

      <label className="field">
        <span>Reasoning</span>
        <textarea
          value={reasoning}
          rows={4}
          placeholder="Why this option? What did you expect to happen?"
          onChange={(e) => setReasoning(e.target.value)}
        />
      </label>

      <div className="form-grid">
        <fieldset className="confidence-picker">
          <legend>
            Confidence <span className="muted">(1 = guessing, 5 = certain)</span>
          </legend>
          <div className="conf-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={confidence === n ? "conf active" : "conf"}>
                <input
                  type="radio"
                  name="confidence"
                  value={n}
                  checked={confidence === n}
                  onChange={() => setConfidence(n)}
                />
                {n}
              </label>
            ))}
            <span className="conf-caption">{CONFIDENCE_LABELS[confidence - 1]}</span>
          </div>
        </fieldset>

        <label className="field">
          <span>Review on</span>
          <input type="date" value={reviewOn} onChange={(e) => setReviewOn(e.target.value)} />
          <small>
            It'll appear under “Due for review” on {formatLong(reviewOn) || "that date"}.
          </small>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-footer">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? "Save changes" : "Save decision"}
        </button>
      </div>
    </form>
  );
}
