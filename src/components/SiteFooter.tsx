import { CONTACT_EMAIL } from "../site-config";

/** Footer with the trust/disclosure lines required by the spec. */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/app">App</a>
          <a href="/privacy">Privacy</a>
          <a href="/#feedback">Feedback</a>
        </div>

        <p className="footer-note">
          <strong>Your decisions stay in this browser.</strong> Nothing you write in the app is
          sent to a server — see the <a href="/privacy">privacy policy</a>.
        </p>

        <p className="footer-note">
          This app was built with AI coding tools. It contains no AI features that read or process
          your decisions.
        </p>

        <p className="footer-note">
          Questions or feedback: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> · ©{" "}
          {year} Decision Log
        </p>
      </div>
    </footer>
  );
}
