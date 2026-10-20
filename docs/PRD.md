# Decision Log — PRD & Spec

Proof of concept: a small web app that records why a decision was made and
reminds you to review it later. Built as a one-afternoon PoC.

- **Audience:** individuals and small teams who forget the reasoning behind past
  choices (tools picked, hires, pricing, trips, purchases).
- **Principle:** cut anything not needed for the core flow or the pages below.

---

## 1. Core flow (the priority — must work end to end)

| # | Requirement | Status |
| --- | --- | --- |
| 1 | Add a decision: title, context, options considered, choice made, reasoning, confidence (1–5), review date | ✅ |
| 2 | See all decisions in a list, searchable by text (titles, options, reasoning, lessons) | ✅ |
| 3 | "Due for review" view: decisions whose review date has arrived | ✅ |
| 4 | Mark an outcome (worked / mixed / didn't work) + one-line lesson learned | ✅ |

Constraints: no login, no accounts, no paid APIs, local data only, clean SPA UI
that looks good in a screen recording, runs with `npm install && npm run dev`.

## 2. Structure

| # | Requirement | Status |
| --- | --- | --- |
| S1 | `/` landing page | ✅ |
| S2 | `/app` application | ✅ |
| S3 | `/thank-you` page | ✅ |
| S4 | `/privacy` page | ✅ |

**Implementation note:** each page is its own static `.html` file (multi-page
Vite build), so titles and Open Graph tags are real HTML that social scrapers
can read without running JavaScript. `vercel.json` + a dev middleware map the
clean URLs (`/app` → `app.html` etc.). One React entry picks the component from
the pathname.

## 3. Landing page

| # | Requirement | Status |
| --- | --- | --- |
| L1 | CTA above the fold ("Start logging decisions"), desktop + mobile | ✅ hero CTA, hero height tuned for 360px viewports |
| L2 | Sticky mobile CTA: fixed bottom bar below 768px | ✅ `.sticky-cta`, CSS-only, no animation |
| L3 | Responsive, tested at 360 / 768 / 1280, no horizontal scrolling | ✅ verified in browser at all three widths |
| L4 | 5 FAQs as accordion | ✅ native `<details>` (keyboard/AT friendly) |
| L5 | Reviews: no invented testimonials; "Be our first reviewer" prompt linking to the feedback form | ✅ `.reviews-prompt` → `#feedback` |

## 4. Feedback / contact form

| # | Requirement | Status |
| --- | --- | --- |
| F1 | Validation: required, email format, length limits, inline errors, disabled submit while sending, plus a second handler-side validation pass | ✅ `validate()` runs on submit before sending |
| F2 | Redirect to `/thank-you` after submit | ✅ |
| F3 | Response-time promise near the form **and** on the thank-you page, from one constant | ✅ `RESPONSE_TIME_PROMISE` in `src/site-config.ts` |

**Delivery decision:** Vercel does not offer a native forms product (verified
against current docs — Vercel points to third-party backends). Chosen:
**Formspree free** (server-side validation, spam filtering, email delivery),
configured via `VITE_FEEDBACK_ENDPOINT`. Without an endpoint the form falls back
to the visitor's email app, so it works with zero services.

## 5. SEO & sharing

| # | Requirement | Status |
| --- | --- | --- |
| Q1 | Unique titles + meta descriptions per page | ✅ real HTML per page |
| Q2 | Favicon (SVG + PNG fallback), "Page name \| Decision Log" titles | ✅ `favicon.svg` + `favicon-32.png`, generated from one source |
| Q3 | Open Graph (title/description/image/url/type) + Twitter card, 1200×630 image | ✅ `og-image.png` generated from `public/og.svg` |
| Q4 | Alt text on meaningful images, empty alt on decorative ones | ✅ (all current graphics are inline SVG marked `aria-hidden`) |

`og:url` / canonical use `VITE_SITE_URL` — set it in Vercel env vars to the
final domain before the public launch.

## 6. Trust & disclosure

| # | Requirement | Status |
| --- | --- | --- |
| T1 | Plain-language privacy policy: what's collected, where stored, retention, how to delete, contact | ✅ `/privacy` |
| T2 | Data disclosure near the app and the form | ✅ `.data-notice` in the app, hero note + form fine print |
| T3 | AI disclosure: built with AI tools; no AI features processing user data | ✅ footer + privacy page |
| T4 | GA4 behind consent, measurement ID from env var, track CTA + form submits | ⏸ **cut by owner decision** (cut list #1). Tracking call sites exist as no-ops in `src/lib/analytics.ts` so GA4 is a ~15-minute addition later. |

## 7. Safety

| # | Requirement | Status |
| --- | --- | --- |
| X1 | Self-harm response: calm, non-judgmental message with configurable helplines (Tele-MANAS 14416, 988); does not block saving; flagged text never stored/sent beyond the user's own local data; never sent to analytics | ✅ `src/lib/safety.ts` — local keyword check in the decision form and the feedback form; `HELPLINES` is one editable array |

## 8. Polish & storage

| # | Requirement | Status |
| --- | --- | --- |
| P1 | Loading splash on first load, <1s, no layout jump | ✅ inline splash in each HTML, fades after first paint |
| D1 | Storage: **Option A — browser only**, stated in the privacy policy | ✅ owner decision; no bucket, no sync, no attachments |

## 9. Cut order (if time runs short)

1. GA4 — ✅ cut by owner decision
2. Sticky mobile CTA animations — ✅ never added (bar is static)
3. Reviews section — ✅ prompt-only per requirement L5
4. Option B storage — ✅ owner chose Option A

## 10. Technical spec

| Concern | Choice |
| --- | --- |
| Stack | Vite 7 + React 19 + TypeScript (strict), hand-written CSS |
| Routing | Multi-page build: `index.html`, `app.html`, `thank-you.html`, `privacy.html` → clean URLs via `vercel.json` rewrites (prod) and a Vite dev middleware |
| Persistence | `localStorage` key `decision-log.decisions.v1`, isolated behind `src/storage.ts` |
| Dates | Plain `YYYY-MM-DD` strings; due = `reviewOn <= today` (see `src/date.ts`) |
| Outcome saved | Sets outcome + lesson, clears due status, schedules next review 1 year out |
| Config constants | `src/site-config.ts`: `RESPONSE_TIME_PROMISE`, `CONTACT_EMAIL`, `FEEDBACK_ENDPOINT`, `SITE_URL` |
| Analytics | `src/lib/analytics.ts` no-op stub (GA4 deferred) |
| Safety | `src/lib/safety.ts`, local-only, configurable `HELPLINES` |
| Deploy | Vercel (static). Build: `npm run build` → `dist/` |

### File map

```
index.html / app.html / thank-you.html / privacy.html   per-page meta + splash
src/main.tsx            entry: picks page by pathname, hides splash
src/site-config.ts      all shared copy/constants
src/App.tsx             the Decision Log app (core flow)
src/pages/Landing.tsx   hero, features, how-it-works, reviews, FAQ, form
src/pages/ThankYou.tsx  confirmation + response promise
src/pages/Privacy.tsx   privacy policy
src/components/         DecisionCard, DecisionForm, OutcomeDialog,
                        FeedbackForm, SiteHeader, SiteFooter
src/lib/safety.ts       self-harm response (local-only)
src/lib/analytics.ts    GA4-ready no-op stub
src/storage.ts          all localStorage I/O (swap point for a DB)
src/date.ts             date maths
scripts/generate-assets.mjs  OG image + PNG favicon from SVG
```

## 11. Verification checklist

- [x] `npm run build` (strict typecheck + production bundle) passes
- [x] Core flow exercised in a browser: add → search → due → mark outcome → delete → reload persists
- [x] No console errors on any page
- [x] Tested at 360 / 768 / 1280: no horizontal scroll; hero CTA above the fold at all three;
      sticky bar fixed at 360 (hidden at ≥768)
- [x] Feedback form: empty submit → 3 inline errors; bad email → format error; valid submit →
      redirects to /thank-you (which shows the response-time promise, noindex)
- [x] FAQ: 5 items, closed by default, answers reveal on open
- [x] Safety: distress phrase → calm notice shown, Save stayed enabled, save succeeded,
      network log shows only localhost requests (nothing left the browser)
- [x] Privacy page carries all 8 required sections incl. AI + no-analytics disclosure
- [x] Splash renders and removes itself (timer fallback fixed a background-tab bug where
      requestAnimationFrame never fired and the splash blocked all clicks)
- [x] Deployed URL loads with correct content types and titles: all four routes return 200
      (`text/html`), PNGs return `image/png`, unique titles per page, OG tags carry the real
      `https://decision-log-beige.vercel.app` URL, React renders on the live origin, console clean
- [x] `VITE_SITE_URL` set in Vercel (production env var) and redeployed
- [ ] `VITE_FEEDBACK_ENDPOINT` (Formspree) — owner action: create the free Formspree form, then
      add the endpoint as `VITE_FEEDBACK_ENDPOINT` in Vercel → Settings → Environment Variables
      and redeploy. Until then the form falls back to the visitor's email app.
- [ ] Replace `CONTACT_EMAIL` in `src/site-config.ts` (currently `hello@decisionlog.example`)
