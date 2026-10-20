import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CONTACT_EMAIL } from "../site-config";

export default function Privacy() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="page-narrow">
        <h1>Privacy, in plain language</h1>
        <p className="section-lead">Last updated: October 2026.</p>

        <h2>The short version</h2>
        <p>
          The app stores your decisions <strong>in your own browser</strong>. There is no account,
          no server-side database, and nothing you write in the app is ever transmitted to us. The
          only way we receive anything from you is if you choose to send it through the contact
          form or by email.
        </p>

        <h2>What the app stores, and where</h2>
        <p>
          Your decisions (titles, context, options, reasoning, confidence, review dates, outcomes
          and lessons) are saved in your browser's localStorage under the key{" "}
          <code>decision-log.decisions.v1</code>. That data stays on this device and this browser
          profile. It is not backed up, not synced, and not visible to us.
        </p>

        <h2>What we never collect</h2>
        <ul>
          <li>We don't have accounts, so there are no names, logins or passwords.</li>
          <li>We don't see your decisions — they never leave your browser.</li>
          <li>
            No analytics or tracking cookies are loaded in this version of the site. If analytics
            are ever added, they will require your consent first and this page will say so.
          </li>
          <li>
            If the app ever shows a supportive message about sensitive thoughts, that check runs
            entirely in your browser. The text you wrote is not stored, sent, or shared anywhere.
          </li>
        </ul>

        <h2>The contact form</h2>
        <p>
          If you use the feedback form, the fields you fill in (your name, email and message) are
          sent to us so we can reply. We use your email only to answer you — it is not added to any
          mailing list, and we don't sell or share it. Ask us to delete your message at any time and
          we will.
        </p>

        <h2>How to delete everything</h2>
        <ul>
          <li>Individual decisions: open the app, expand a decision, and press Delete.</li>
          <li>
            Everything at once: open your browser settings → site data → remove the data stored for
            this site. This deletes all decisions permanently.
          </li>
          <li>Messages you sent us: email {CONTACT_EMAIL} and we'll delete them.</li>
        </ul>

        <h2>Retention</h2>
        <p>
          Your decisions are retained until <em>you</em> delete them — we hold no copy. Messages
          you send us are kept only as long as needed to reply and follow up.
        </p>

        <h2>AI disclosure</h2>
        <p>
          This app was built with the help of AI coding tools. The running app contains no AI
          features: nothing you type is processed by an AI model, and no third-party AI service
          receives your data.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about any of this: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
