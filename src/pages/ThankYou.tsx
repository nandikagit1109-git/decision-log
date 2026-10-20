import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CONTACT_EMAIL, RESPONSE_TIME_PROMISE } from "../site-config";

export default function ThankYou() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="page-narrow">
        <h1>Thank you — message received.</h1>
        <p className="section-lead">
          Your note is on its way to us. {RESPONSE_TIME_PROMISE} If it's urgent, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
        </p>
        <p>
          If your email app didn't open on the previous screen, nothing was sent — please email us
          at the address above instead.
        </p>
        <div className="centered-left">
          <a className="btn btn-primary" href="/app">
            Start logging decisions
          </a>
          <a className="btn" href="/">
            Back to home
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
