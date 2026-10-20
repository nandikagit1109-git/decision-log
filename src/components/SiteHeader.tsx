import { track } from "../lib/analytics";

/** Sticky top bar used on the landing, thank-you and privacy pages. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/">
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
          <span className="brand-name">Decision Log</span>
        </a>
        <nav className="site-nav" aria-label="Site">
          <a href="/#how">How it works</a>
          <a href="/#faq">FAQ</a>
          <a href="/privacy">Privacy</a>
          <a
            className="btn btn-primary"
            href="/app"
            onClick={() => track("cta_click", { where: "header" })}
          >
            Open the app
          </a>
        </nav>
      </div>
    </header>
  );
}
