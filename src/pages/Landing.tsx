import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FeedbackForm from "../components/FeedbackForm";
import { track } from "../lib/analytics";

const FAQS = [
  {
    q: "Where is my data stored?",
    a: "In your browser, on this device — using a browser feature called localStorage. Nothing you write is ever uploaded to a server. That also means it doesn't sync between devices, and clearing your browser data deletes it.",
  },
  {
    q: "Is it free?",
    a: "Yes — completely free, with no account, no trial, and no paid tier.",
  },
  {
    q: "Can I export it?",
    a: "Not yet with a button — but your data is plain JSON sitting in your browser's localStorage, so nothing is locked in. A proper export button is on the roadmap.",
  },
  {
    q: "Does it use AI?",
    a: "The app was built with the help of AI coding tools, but the app itself has no AI features. Nothing you write is sent to an AI model or any other server — the only exception is the contact form below, which emails your message to us if you choose to use it.",
  },
  {
    q: "Who can see my decisions?",
    a: "Only you, in the browser where you logged them. There are no accounts, no sharing, and no admin view. If you want a decision gone, delete it in the app (or clear the site's data in your browser settings).",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <SiteHeader />

      <main>
        {/* ---------- Hero: CTA visible without scrolling, desktop and mobile ---------- */}
        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow">Free · No account · Private by design</p>
            <h1>Remember why you decided.</h1>
            <p className="hero-sub">
              Tools, hires, pricing, trips, purchases — Decision Log captures the reasoning while
              it's fresh, then reminds you to check how it turned out.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary btn-lg"
                href="/app"
                onClick={() => track("cta_click", { where: "hero" })}
              >
                Start logging decisions
              </a>
              <a className="btn btn-lg" href="#how">
                See how it works
              </a>
            </div>
            <p className="hero-note">
              Your decisions stay in this browser — nothing is sent to a server.
            </p>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section className="section-wrap" aria-label="What it does">
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Capture the reasoning</h3>
              <p>
                Context, the options you weighed, the choice, and why — plus how confident you
                felt at the time.
              </p>
            </article>
            <article className="feature-card">
              <h3>Review on a schedule</h3>
              <p>
                Give each decision a review date. When it arrives, it moves to “Due for review”
                so past-you talks to future-you.
              </p>
            </article>
            <article className="feature-card">
              <h3>Learn what worked</h3>
              <p>
                Mark outcomes as worked, mixed, or didn't work, and leave a one-line lesson you'll
                actually remember.
              </p>
            </article>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="section-wrap" id="how">
          <h2 className="section-title">How it works</h2>
          <ol className="steps">
            <li>
              <span className="step-num">1</span>
              <div>
                <h3>Write the decision down</h3>
                <p>Thirty seconds while it's fresh: what, why, and how sure you are.</p>
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <h3>Set a review date</h3>
                <p>A month, a quarter, a year — whenever the outcome should be visible.</p>
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <h3>Close the loop</h3>
                <p>When the date arrives, mark the outcome and write the lesson you learned.</p>
              </div>
            </li>
          </ol>
          <div className="centered">
            <a
              className="btn btn-primary btn-lg"
              href="/app"
              onClick={() => track("cta_click", { where: "how" })}
            >
              Start logging decisions
            </a>
          </div>
        </section>

        {/* ---------- Reviews: no invented testimonials ---------- */}
        <section className="section-wrap" aria-label="Reviews">
          <div className="reviews-prompt">
            <h2 className="section-title">Reviews</h2>
            <p>
              We don't publish invented testimonials. If you've used Decision Log, be our first
              reviewer — it takes a minute and shapes what we build next.
            </p>
            <a className="btn btn-primary" href="#feedback">
              Be our first reviewer
            </a>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="section-wrap" id="faq">
          <h2 className="section-title">Questions people actually ask</h2>
          <div className="faq">
            {FAQS.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>
                  {item.q}
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- Feedback / contact ---------- */}
        <section className="section-wrap" id="feedback">
          <h2 className="section-title">Send feedback or ask anything</h2>
          <p className="section-lead">
            Bugs, ideas, or “I wish it did X” — it all goes straight to us.
          </p>
          <FeedbackForm />
        </section>
      </main>

      <SiteFooter />

      {/* ---------- Sticky mobile CTA (<768px only, via CSS) ---------- */}
      <div className="sticky-cta">
        <a
          className="btn btn-primary"
          href="/app"
          onClick={() => track("cta_click", { where: "sticky" })}
        >
          Start logging decisions
        </a>
      </div>
    </div>
  );
}
