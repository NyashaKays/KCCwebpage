# KCC journey components

Makes moving through kcc.fortunearchitecture.com feel like walking through the community:
an arrival zoom, a "walk down the street", an interactive plan, and a "you are here" mini-map.

## Install

```bash
npm install gsap lenis
```

Copy this `journey/` folder into `src/`. Everything is plain React + CSS (no Tailwind or UI kit needed).

## Wire it up (about 15 minutes)

See `App.example.jsx` (next to this folder in the zip) for the full picture. In short:

1. **Smooth scrolling + reveals**, in `App.jsx`:
   ```jsx
   import { initSmoothScroll, initReveal } from './journey'
   useEffect(() => initSmoothScroll(), [])
   useEffect(() => initReveal(), [])
   ```
   Your existing `#community`, `#living` … nav links become smooth automatically.
   If you already have a reveal-on-scroll effect, remove it and put `data-reveal` on the
   elements instead. This fixes the blank sections that appear when scrolling fast.

2. **Arrival zoom** on the hero: add `ref={heroRef}` to `<section className="hero">` and call
   `useArrival(heroRef)`. It uses your existing `.hero-bg` and `.hero-copy`.

3. **Street walk**: add `<StreetWalk houses={[...]} />` between the story and living sections.
   Each house is `{ label, sub, image, href }`. Pins and scrolls sideways on screens 900px+;
   swipeable row on phones.

4. **Interactive plan**: in the neighborhood section, replace
   `<button className="plan"><img src="/assets/kcc-flyer.png" …/></button>` with `<CommunityPlan />`.
   Keep your "Enlarge plan" and "Download the flyer" buttons for the full flyer.

5. **Mini-map**: add `<MiniMap />` once, outside `<main>`.

## Calibrate the hotspots

The lot rectangles in `planData.js` were traced by eye and need tightening:

1. Run the site and open it with `?calibrate` (e.g. `localhost:5173/?calibrate`).
2. Drag a box over a lot on the plan. The `rect: {…}` line is copied to your clipboard.
3. Paste it into that hotspot in `planData.js`. Repeat per lot.

Also fill in each hotspot's `beds`, `sqft`, `image`, and `summary` once confirmed. Fields you leave
out simply don't show on the card. Move the mini-map dots with each stop's `point` the same way.

## Strongly recommended: export the plan on its own

The plan currently comes from inside the flyer (an SVG viewBox crops it out). Exporting the plan as
its own high-res image (2000px+ wide) will look much sharper. Then update `PLAN_IMAGE`, `PLAN_SIZE`,
`PLAN_VIEWBOX` (set to `[0, 0, width, height]`) and re-calibrate.

## Accessibility & performance

- `prefers-reduced-motion`: smooth scroll, pinning, zoom and pulses all switch off; content stays.
- Hotspots and mini-map stops are keyboard reachable (Tab, Enter).
- All your text stays in the HTML, so search engines still read it.
- GSAP + Lenis add roughly 45 KB gzipped.

## Next steps once this is in

- Swap the drawn tree line in `.kcc-street-back` for a real streetscape panorama.
- Room-by-room floor plans: same pattern as `CommunityPlan`, with rooms as hotspots.
- Drone footage of the site, scrubbed by scroll, in place of the arrival zoom.
- A 360° tour of the Stout Apartments linked from its hotspot.
