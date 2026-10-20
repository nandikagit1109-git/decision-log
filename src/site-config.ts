/**
 * One place for every "copy" value that appears in more than one page, so the
 * promises we make to users are easy to change in exactly one spot.
 */

/** Response-time promise shown next to the form AND on the thank-you page. */
export const RESPONSE_TIME_PROMISE = "We reply within 2 business days.";

/** Public contact address, shown in the footer and the privacy policy. */
export const CONTACT_EMAIL = "hello@decisionlog.example";

/**
 * Formspree endpoint for the feedback form, e.g.
 * https://formspree.io/f/xyzabc. Set it as VITE_FEEDBACK_ENDPOINT in
 * `.env.local` (dev) or in Vercel → Settings → Environment Variables.
 * When it is missing, the form falls back to opening the visitor's email app.
 */
export const FEEDBACK_ENDPOINT: string = import.meta.env.VITE_FEEDBACK_ENDPOINT ?? "";

/** Base URL of the deployed site, used for canonical + Open Graph tags. */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
