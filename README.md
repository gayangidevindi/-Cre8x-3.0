# Orbital — Cre8x 3.0, Round 01

A single mobile-first app for planning, following and finishing a journey across the
2100 city network: smart-road pods, autonomous buses, maglev lines and sky shuttles.

## Screens
1. **Plan** (`/`) — search, plain-language trip entry, mode filters, saved trips.
2. **Route details** (`/journey`) — step-by-step legs, live delay alert, one-tap smart rebooking, alternatives.
3. **Live map** (`/track`) — animated vehicle on an SVG map, plain-language status, list view for anyone who does not read maps.
4. **Comfort** (`/settings`) — text size, high contrast, reduced motion, spoken updates, simple mode, and reduced information density. Saved to the device.

## Accessibility decisions built into the flow
- Every control is at least a 56px touch target; one primary action per screen.
- Text scale (100–160%) drives a single `--scale` token, so no layout breaks or truncation.
- "Simple mode" removes secondary content from every screen, not a toggle that only changes colours.
- Every map has an equivalent list view; every live update is announced via `aria-live` and optional speech.
- High-contrast theme replaces the palette, not just the text colour.
- Microcopy is plain language: "Stay on until Bolgoda Lagoon Gardens", not "Alight at interchange 2".
- Color statuses pair their colour with a check or alert icon.
- Keyboard-only flow: press Tab from the skip link, enter the two places, Tab to **Find my routes**, then Tab through the Copilot, route explanation, alternatives, and **Start this journey**. On the Live screen, Tab reaches map/list, screen explanation, and **I have arrived**; focus remains visible throughout.
- Copilot understands requests such as "I am running late", "avoid crowds", and "keep it step-free" on-device.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Deploy free
- **Vercel** — import the repo, framework auto-detected, deploy.
- **Netlify** — build `npm run build`, publish directory `out`.
- **GitHub Pages** — push `out/` (add a `.nojekyll` file) to the `gh-pages` branch.

Test in a mobile view (375×812) before submitting screenshots.
