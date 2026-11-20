# TP Solver

TP Solver is a static transportation-problem learning app (Least Cost Method). The solver is the source of truth for the displayed costs, supply, demand, allocations, and total cost.

On **New Problem**, choose **Costs and shipment quantities** for the usual complete plan entry, or **Costs only** to show the cost matrix without shipment boxes. Shipment-plan calculation is disabled in Costs-only mode.

## TP Buddy assistant (Noupe)

The chat assistant is a [Noupe](https://www.noupe.com/) embed. It is loaded by a single script tag at the end of `index.html`:

```html
<script src='https://www.noupe.com/embed/01a1ecc50bb87000892cdfa5bdd40705f197.js'></script>
```

- No API key, Vercel function, or backend is needed. Nothing in this repo calls an AI provider.
- The assistant's knowledge and behavior (answering questions about the Least Cost Method) are configured in your Noupe dashboard, not in this code. Add the Least Cost Method steps, the dummy row/column rules, degeneracy, and sample problems to its knowledge base/instructions there.
- Noupe cannot see the solver's current matrix or results, so it answers from its own knowledge base only. Remind students to verify calculations against TP Solver.
- The assistant requires an internet connection; the solver itself works offline.
- `buddy-theme.js` recolors the TP Buddy chat button from bright blue to the app's dark blue (`#0b2a6b`). It can only restyle a widget that lives in this page. If Noupe shows its chat inside its own iframe, browsers block that, so set the widget color to `#0b2a6b` in the Noupe dashboard instead (the script then simply does nothing).

## Install as an app (PWA)

TP Solver can be installed on a phone, tablet, or computer from a dark-blue banner at the top of the page.

- `manifest.webmanifest` + `icons/` describe the app (name, colors, icons).
- `sw.js` is the service worker. It caches the app so it opens offline. **Change the `CACHE = 'tp-solver-vN'` number (v7 -> v8, ...) every time you publish changes**, otherwise installed copies may keep showing old files.
- `install.js` shows the banner. Chrome/Edge/Android get a one-tap **Install** button; iPhone/iPad Safari shows "Share -> Add to Home Screen" steps because Apple does not allow one-tap install. After the user taps the **×**, the banner stays hidden for 7 days.
- Installing needs HTTPS (GitHub Pages is fine) or `localhost`. All paths are relative, so it also works from a repo sub-path such as `https://<user>.github.io/<repo>/`.

## Phones, tablets and the installed app

- **Menu:** on screens narrower than 992px the menu opens from a sticky **Menu** bar that stays at the top while scrolling. The menu has a close **x**, and also closes when you tap outside it, press Escape, swipe it left, or choose a page. The icons are inline SVG, so the buttons never go blank if the icon font has not loaded.
- **iPhone notch and home bar:** the layout uses `env(safe-area-inset-*)` and `viewport-fit=cover`, so nothing sits under the status bar or the home indicator when the app is installed. A dark-blue strip is drawn behind the status bar so the clock and battery stay readable.
- **Calculator:** it can no longer be dragged or saved where it cannot be tapped. It stays inside the safe screen, below the status bar, install banner and menu bar, and is pulled back on screen after a rotation or if an old saved position was off-limits. On phones and tablets it starts closed (just the small button).
- **Footer:** shows "All rights reserved" and the creator credit, in English, Tagalog and Taglish. Edit the texts `footerRights` and `footerCredit` in `app.js`.

## Practice Mode extras

All of these live in `practice-extra.js` and share the same points balance as the classic practice problems. Everything is saved on the student's own device (`localStorage`).

- **My Progress**: stat tiles (activities completed, fastest solve, average score, day streak) and a line graph. Choose *Activities per day*, *Solve time per activity* or *Score per activity*, filter by activity type, hover for details, or switch to a table. Finished classic problems, guided problems and quizzes are all recorded. Students who already solved classic problems keep their history on the graph.
- **Guided problems**: the matrix is pre-filled. *Fill in the blanks* hides 2 / 3 / 4 shipment cells (easy / medium / hard) that the student works out from the row and column totals, with a Hint button. *Find the total cost* shows the full Least Cost plan and the student only enters the total cost, with an optional step-by-step helper.
- **Quick quiz**: 5 questions per round, mixed, calculations only, or concepts only. Calculation questions use fresh random numbers every time (9 types); there are 18 concept questions.
- **More stories**: the classic Practice problems now draw from 5 easy, 5 medium and 8 hard word-problem stories (English, Tagalog and Taglish).

## Run locally

- `npm start` serves the static app at `http://127.0.0.1:3000`.
- `npm test` runs `node --test` (there are currently no test files).
