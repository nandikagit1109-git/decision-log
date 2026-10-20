# Decision Log

Record *why* you made a decision, then get reminded to check how it turned out.

Built as a proof of concept: no login, no accounts, no server. Everything lives in your
browser's localStorage.

## Run it

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## What it does

1. **Add a decision** — title, context, options considered, choice made, reasoning,
   confidence (1–5), and a review date.
2. **All decisions** — every decision, newest first, searchable across titles, options,
   reasoning and lessons.
3. **Due for review** — decisions whose review date has arrived, most overdue first.
4. **Mark an outcome** — worked / mixed / didn't work, plus a one-line lesson. Marking an
   outcome clears the due status and schedules the next check-in one year from today.

## Where the code lives

| File | What it does |
| --- | --- |
| `src/types.ts` | The `Decision` shape — one object is one decision. |
| `src/storage.ts` | Reads/writes localStorage. Swapping in a real database later means changing only this file. |
| `src/date.ts` | Plain "YYYY-MM-DD" date maths (due checks, formatting). |
| `src/App.tsx` | The whole page: tabs, search, list, and what happens when you save/delete/mark. |
| `src/components/DecisionCard.tsx` | One decision in the list; click to expand. |
| `src/components/DecisionForm.tsx` | The add/edit form. |
| `src/components/OutcomeDialog.tsx` | The "how did it turn out?" popup. |
| `src/styles.css` | All the styling, hand-written CSS, no framework. |

## Deploy

Static build — `npm run build` outputs `dist/`, which any static host can serve.

```bash
npm run build
npm run preview   # check the production build locally
```
