// ─────────────────────────────────────────────────────────────
// Community plan data
//
// All coordinates are in PIXELS OF THE PLAN IMAGE, so they stay
// correct at any display size.
//
// The plan lives inside the flyer (kcc-flyer.png, 1023×1537);
// PLAN_VIEWBOX crops the plan area out with an SVG viewBox.
// To fine-tune any rectangle, open the page with ?calibrate in the
// URL and drag a box over a lot (see CommunityPlan.jsx).
// ─────────────────────────────────────────────────────────────

export const PLAN_IMAGE = '/assets/kcc-flyer.png'
export const PLAN_SIZE = { width: 1023, height: 1537 }

// [x, y, width, height] of the plan area inside the flyer
export const PLAN_VIEWBOX = [415, 80, 596, 682]

// kind: 'cottage' | 'duplex' | 'property' | 'green' | 'trail'
// Add beds / sqft / image per property as you confirm them.
// Anything left out simply isn't shown on the card.
export const HOTSPOTS = [
  {
    id: 'trail',
    name: 'Cloverleaf Trail',
    kind: 'trail',
    rect: { x: 440, y: 108, w: 566, h: 14 },
    summary: 'Trail access along the north edge of the community.',
    href: '#neighborhood',
  },
  {
    id: 'lots-1-4',
    name: 'Cottage lots 1–4',
    kind: 'cottage',
    rect: { x: 662, y: 270, w: 114, h: 36 },
    summary: 'New cottage homes facing the interior street.',
    beds: '2–3 bed',
    sqft: '1,000–1,471 sq ft',
    image: '/assets/home-1.webp',
    href: '#living',
  },
  {
    id: 'lots-9-16',
    name: 'Cottage lots 9–16',
    kind: 'cottage',
    rect: { x: 546, y: 366, w: 318, h: 36 },
    summary: 'A row of porches along the central street.',
    beds: '2–3 bed',
    sqft: '1,000–1,471 sq ft',
    image: '/assets/home-2.webp',
    href: '#living',
  },
  {
    id: 'armstrong',
    name: '104–106 N. Armstrong',
    kind: 'duplex',
    rect: { x: 836, y: 170, w: 63, h: 96 },
    summary: 'Homes on N. Armstrong Street.',
    image: '/assets/home-3.webp',
    href: '#living',
  },
  {
    id: 'webster',
    name: '612 & 616 N. Webster',
    kind: 'cottage',
    rect: { x: 529, y: 421, w: 62, h: 106 },
    summary: 'Homes facing N. Webster Street.',
    image: '/assets/home-3.webp',
    href: '#living',
  },
  {
    id: 'jefferson-404',
    name: '404 W. Jefferson',
    kind: 'property',
    rect: { x: 690, y: 438, w: 85, h: 192 },
    summary: 'Ask the team about this property.',
    href: '#contact',
  },
  {
    id: 'jefferson-302',
    name: '302 W. Jefferson',
    kind: 'cottage',
    rect: { x: 897, y: 369, w: 64, h: 57 },
    summary: 'Home on the east side of the plan.',
    href: '#living',
  },
  {
    id: 'jefferson-308-312',
    name: '308–312 W. Jefferson',
    kind: 'cottage',
    rect: { x: 872, y: 451, w: 57, h: 180 },
    summary: 'Homes along the east side, near N. Washington Street.',
    href: '#living',
  },
  {
    id: 'south-1-2',
    name: 'South lots 1–2',
    kind: 'cottage',
    rect: { x: 511, y: 677, w: 53, h: 44 },
    summary: 'Homes south of W. Jefferson Street.',
    href: '#living',
  },
]

// ─────────────────────────────────────────────────────────────
// Journey stops: one per page section, in scroll order.
// `selector` finds the section; `point` is where the "you are here"
// dot sits on the plan; `place` is the street-sign name.
// Sections that don't exist on the page are skipped automatically.
// ─────────────────────────────────────────────────────────────
export const JOURNEY_STOPS = [
  { selector: '.hero',         place: 'Arriving at W. Jefferson',  point: { x: 985, y: 672 } },
  { selector: '#community',    place: 'Along W. Jefferson Street',  point: { x: 840, y: 668 } },
  { selector: '#street',       place: 'Walking the cottage row',    point: { x: 660, y: 345 } },
  { selector: '#living',       place: 'At cottage lots 1–4',        point: { x: 720, y: 318 } },
  { selector: '#neighborhood', place: 'Overlooking the plan',       point: { x: 640, y: 560 } },
  { selector: '.everyday',     place: 'Out on the trail',           point: { x: 720, y: 115 } },
  { selector: '#faqs',         place: 'On a front porch',           point: { x: 605, y: 410 } },
  { selector: '#contact',      place: 'Heading to 329 N. Main',     point: { x: 1000, y: 700 } },
]
