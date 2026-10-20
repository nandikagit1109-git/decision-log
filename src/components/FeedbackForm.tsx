import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL, FEEDBACK_ENDPOINT, RESPONSE_TIME_PROMISE } from "../site-config";
import { detectDistressInFields, distressMessage } from "../lib/safety";
import { track } from "../lib/analytics";

/**
 * Feedback form (requirements 5–8).
 *
 * Validation runs twice on purpose: once as you type (fast inline errors) and
 * again in `submit` right before sending — never trust the first pass alone.
 *
 * Delivery: if FEEDBACK_ENDPOINT (Formspree) is configured we POST JSON to it.
 * Without an endpoint we fall back to opening the visitor's email app, so the
 * form still works with zero third-party services.
 */

const LIMITS = { name: 80, email: 120, message: 2000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please tell us what to call you.";
  else if (values.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (!values.email.trim()) errors.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "That doesn't look like an email address.";
  else if (values.email.length > LIMITS.email) errors.email = "That email is too long.";

  if (!values.message.trim()) errors.message = "Tell us what's on your mind.";
  else if (values.message.trim().length < 10) errors.message = "A little more detail, please.";
  else if (values.message.length > LIMITS.message)
    errors.message = `Keep it under ${LIMITS.message} characters.`;

  return errors;
}

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [distress, setDistress] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const values = { name, email, message };
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setFormError(null);

    const finish = () => {
      track("form_submit", { via: FEEDBACK_ENDPOINT ? "formspree" : "mailto" });
      window.location.assign("/thank-you");
    };

    if (!FEEDBACK_ENDPOINT) {
      // No backend configured: hand off to the visitor's email app.
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Decision Log feedback",
      )}&body=${encodeURIComponent(body)}`;
      finish();
      return;
    }

    setSending(true);
    fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        finish();
      })
      .catch(() => {
        setSending(false);
        setFormError(
          `Something went wrong while sending. Please email us directly at ${CONTACT_EMAIL}.`,
        );
      });
  }

  return (
    <form className="feedback-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="fb-name">Name</label>
        <input
          id="fb-name"
          type="text"
          value={name}
          maxLength={LIMITS.name}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "fb-name-error" : undefined}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && (
          <p className="field-error" id="fb-name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="fb-email">Email</label>
        <input
          id="fb-email"
          type="email"
          value={email}
          maxLength={LIMITS.email}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "fb-email-error" : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email && (
          <p className="field-error" id="fb-email-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="fb-message">Message</label>
        <textarea
          id="fb-message"
          value={message}
          rows={5}
          maxLength={LIMITS.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "fb-message-error" : undefined}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors((prev) => ({ ...prev, message: undefined }));
            setDistress(detectDistressInFields({ message: e.target.value }));
          }}
        />
        {errors.message && (
          <p className="field-error" id="fb-message-error">
            {errors.message}
          </p>
        )}
      </div>

      {distress && (
        <p className="distress-note" role="note">
          {distressMessage()}
        </p>
      )}

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Sending…" : "Send feedback"}
        </button>
        <span className="promise">{RESPONSE_TIME_PROMISE}</span>
      </div>

      <p className="fine-print">
        We only use your email to reply. Your message goes to {CONTACT_EMAIL} — it is not added to
        any list. <a href="/privacy">Privacy policy</a>
      </p>
    </form>
  );
}
