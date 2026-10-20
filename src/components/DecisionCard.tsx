import { useEffect, useRef, useState } from "react";
import type { Decision } from "../types";
import { OUTCOME_LABELS } from "../types";
import { formatLong, formatShort, isDue, relativeLabel } from "../date";

interface Props {
  decision: Decision;
  /** In the "Due for review" view the card also gets a prominent action button. */
  dueView: boolean;
  onEdit: (decision: Decision) => void;
  onDelete: (decision: Decision) => void;
  onOutcome: (decision: Decision) => void;
}

export default function DecisionCard({ decision, dueView, onEdit, onDelete, onOutcome }: Props) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measure the hidden content so we can animate the expand/collapse.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.scrollHeight));
    observer.observe(el);
    setHeight(el.scrollHeight);
    return () => observer.disconnect();
  }, []);

  // A freshly marked outcome opens the card so the lesson is visible right away.
  useEffect(() => {
    if (decision.outcomeAt) setOpen(true);
  }, [decision.outcomeAt]);

  const due = isDue(decision.reviewOn);
  const days = relativeLabel(decision.reviewOn);

  return (
    <article className={open ? "card open" : "card"}>
      <div
        className="card-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <div className="card-head-main">
          <h3>{decision.title}</h3>
          <p className="card-choice">{decision.choice}</p>
        </div>
        <div className="card-head-meta">
          {decision.outcome ? (
            <span className={`chip ${decision.outcome}`}>{OUTCOME_LABELS[decision.outcome]}</span>
          ) : due ? (
            <span className={days === "Due today" || days.startsWith("in") ? "chip due" : "chip overdue"}>
              {days}
            </span>
          ) : (
            <span className="chip upcoming">Review {formatShort(decision.reviewOn)}</span>
          )}

          <Confidence value={decision.confidence} />

          {dueView && !decision.outcome && (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onOutcome(decision);
              }}
            >
              Mark outcome
            </button>
          )}

          <span className="chev" aria-hidden="true">
            ▾
          </span>
        </div>
      </div>

      <div className="expand" style={{ height: open ? height : 0 }}>
        <div className="expand-inner" ref={innerRef} inert={!open}>
          {decision.context && (
            <section className="section">
              <h4>Context</h4>
              <p className="prose">{decision.context}</p>
            </section>
          )}

          {decision.options.length > 0 && (
            <section className="section">
              <h4>Options considered</h4>
              <ul className="options-list">
                {decision.options.map((option) => {
                  const chosen = option === decision.choice;
                  return (
                    <li key={option} className={chosen ? "chosen" : undefined}>
                      <span className="opt-mark" aria-hidden="true">
                        {chosen ? "✓" : "○"}
                      </span>
                      {option}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {decision.reasoning && (
            <section className="section">
              <h4>Reasoning</h4>
              <p className="prose">{decision.reasoning}</p>
            </section>
          )}

          {decision.outcome && (
            <div className="outcome-block">
              <div className="outcome-head">
                <span className={`chip ${decision.outcome}`}>{OUTCOME_LABELS[decision.outcome]}</span>
                <span className="outcome-date">
                  Marked {decision.outcomeAt ? formatShort(decision.outcomeAt.slice(0, 10)) : ""}
                </span>
              </div>
              {decision.lesson && <p className="lesson">"{decision.lesson}"</p>}
              <p className="outcome-next">Next review {formatLong(decision.reviewOn)}</p>
            </div>
          )}

          <div className="meta-row">
            <span>Logged {formatShort(decision.createdAt.slice(0, 10))}</span>
            <span aria-hidden="true">·</span>
            <span>
              Review {formatLong(decision.reviewOn)}
              {!decision.outcome && due && ` (${days.toLowerCase()})`}
            </span>
          </div>

          <div className="card-actions">
            <button className="btn btn-sm" onClick={() => onEdit(decision)}>
              Edit
            </button>
            {!decision.outcome && (
              <button className="btn btn-primary btn-sm" onClick={() => onOutcome(decision)}>
                Mark outcome
              </button>
            )}
            <span className="actions-spacer" />
            <button className="btn btn-quiet btn-sm danger" onClick={() => onDelete(decision)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Confidence({ value }: { value: number }) {
  return (
    <span
      className="conf-dots"
      title={`Confidence ${value} of 5`}
      aria-label={`Confidence ${value} of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "dot on" : "dot"} />
      ))}
    </span>
  );
}
