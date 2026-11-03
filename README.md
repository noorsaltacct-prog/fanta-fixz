# Fata Fixz

Static site for Fata Fixz mobile mechanic. No build step.

## Files
- `index.html` page markup
- `styles.css` all styles (colors/fonts are CSS variables at the top)
- `script.js` service explorer, quote flow, copy buttons
- `assets/` logo and favicon
- `vercel.json` Vercel config

## Deploy
1. Push this folder to a GitHub repo.
2. Vercel: Add New Project, import the repo, Framework Preset "Other", no build command, output directory blank (root).
3. Deploy.

## Edit
- Phone number: search `725-233-4259` in `index.html` and `script.js`, and `+17252334259` in both.
- Services: `SV` array at the top of `script.js` (and the ticket list in `index.html`).
