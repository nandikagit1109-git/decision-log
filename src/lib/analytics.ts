/**
 * Analytics stub (requirement 16, deferred by choice).
 *
 * GA4 was deliberately cut from this build. To add it later:
 *  1. Load the GA4 snippet AFTER consent, with the measurement ID from an
 *     env var — never hardcoded.
 *  2. Replace the body of `track` with gtag("event", name, params).
 *  3. Add GA4 to the privacy policy and the consent banner.
 *
 * Until then every call is a no-op, so the call sites (CTA clicks, form
 * submits) are already in place and adding GA4 is a small change.
 */

type EventName = "cta_click" | "form_submit";

export function track(_name: EventName, _params?: Record<string, string>): void {
  // Intentionally empty — no analytics are loaded in this build.
}
