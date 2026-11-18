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

## Install as an app (PWA)

TP Solver can be installed on a phone, tablet, or computer from a banner at the bottom of the page.

- `manifest.webmanifest` + `icons/` describe the app (name, colors, icons).
- `sw.js` is the service worker. It caches the app so it opens offline. **Change `CACHE = 'tp-solver-v1'` to a new version (v2, v3, ...) every time you publish changes**, otherwise installed copies may keep showing old files.
- `install.js` shows the banner. Chrome/Edge/Android get a one-tap **Install** button; iPhone/iPad Safari shows "Share -> Add to Home Screen" steps because Apple does not allow one-tap install. After the user taps **Not now**, the banner stays hidden for 7 days.
- Installing needs HTTPS (GitHub Pages is fine) or `localhost`. All paths are relative, so it also works from a repo sub-path such as `https://<user>.github.io/<repo>/`.

## Run locally

- `npm start` serves the static app at `http://127.0.0.1:3000`.
- `npm test` runs `node --test` (there are currently no test files).
