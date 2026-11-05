// Interactive community plan: the plan image with clickable hotspots.
//
//   <CommunityPlan />                      basic use
//   <CommunityPlan onSelect={h => ...} />  handle clicks yourself
//
// Calibrate mode: open the page with ?calibrate in the URL, then drag a
// box over any lot on the plan. The rectangle is logged to the console
// and copied to your clipboard, ready to paste into planData.js.
import React, { useMemo, useRef, useState } from 'react'
import { PLAN_IMAGE, PLAN_SIZE, PLAN_VIEWBOX, HOTSPOTS } from './planData'
import { scrollToTarget } from './smoothScroll'

const KIND_LABEL = {
  cottage: 'Cottage home',
  duplex: 'Duplex',
  apartment: 'Apartments',
  property: 'Property',
  green: 'Green space',
  trail: 'Trail',
}

function toSvgPoint(svg, e) {
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: Math.round(p.x), y: Math.round(p.y) }
}

export default function CommunityPlan({ onSelect, hotspots = HOTSPOTS, className = '' }) {
  const svgRef = useRef(null)
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState(null) // calibrate-mode rectangle

  const calibrate = useMemo(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('calibrate'),
    []
  )

  const [vx, vy, vw, vh] = PLAN_VIEWBOX
  const active = hotspots.find((h) => h.id === activeId)

  const choose = (h) => {
    if (onSelect) onSelect(h)
    else if (h.href) scrollToTarget(h.href)
  }

  // On touch screens there is no hover, so the first tap opens the card
  // and the card's button (or a second tap) goes to the place.
  const touchRef = useRef({ type: 'mouse', openedId: null })
  const onHotspotClick = (h) => {
    const t = touchRef.current
    if (t.type === 'touch' && t.openedId !== h.id) {
      t.openedId = h.id
      setActiveId(h.id)
      return
    }
    choose(h)
  }

  // Card position as a percentage of the visible plan
  let cardStyle
  if (active) {
    const cx = ((active.rect.x + active.rect.w / 2 - vx) / vw) * 100
    const top = ((active.rect.y + active.rect.h - vy) / vh) * 100
    const flipUp = top > 62
    cardStyle = {
      left: `${Math.min(Math.max(cx, 22), 78)}%`,
      top: flipUp ? undefined : `${top}%`,
      bottom: flipUp ? `${100 - ((active.rect.y - vy) / vh) * 100}%` : undefined,
    }
  }

  // ── calibrate mode handlers ──
  const onPointerDown = (e) => {
    if (!calibrate) return
    const p = toSvgPoint(svgRef.current, e)
    setDraft({ x0: p.x, y0: p.y, x: p.x, y: p.y, w: 0, h: 0 })
  }
  const onPointerMove = (e) => {
    if (!calibrate || !draft) return
    const p = toSvgPoint(svgRef.current, e)
    setDraft((d) => ({
      ...d,
      x: Math.min(d.x0, p.x),
      y: Math.min(d.y0, p.y),
      w: Math.abs(p.x - d.x0),
      h: Math.abs(p.y - d.y0),
    }))
  }
  const onPointerUp = () => {
    if (!calibrate || !draft) return
    const out = `rect: { x: ${draft.x}, y: ${draft.y}, w: ${draft.w}, h: ${draft.h} },`
    console.log('[KCC plan]', out)
    navigator.clipboard?.writeText(out).catch(() => {})
    setDraft((d) => ({ ...d, done: true }))
  }

  return (
    <div className={`kcc-plan ${calibrate ? 'is-calibrating' : ''} ${className}`}>
      <svg
        ref={svgRef}
        viewBox={PLAN_VIEWBOX.join(' ')}
        role="img"
        aria-label="Interactive community plan. Select a home or place to learn more."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <image
          href={PLAN_IMAGE}
          width={PLAN_SIZE.width}
          height={PLAN_SIZE.height}
          onClick={() => {
            touchRef.current.openedId = null
            setActiveId(null)
          }}
        />

        {!calibrate &&
          hotspots.map((h) => (
            <g
              key={h.id}
              className={`kcc-hotspot kind-${h.kind} ${activeId === h.id ? 'is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${h.name}. ${KIND_LABEL[h.kind] ?? ''}`}
              onPointerDown={(e) => (touchRef.current.type = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActiveId(h.id)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setActiveId(null)}
              onFocus={() => setActiveId(h.id)}
              onClick={() => onHotspotClick(h)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  choose(h)
                }
              }}
            >
              <rect x={h.rect.x} y={h.rect.y} width={h.rect.w} height={h.rect.h} rx="3" />
              <circle
                className="kcc-hotspot-pin"
                cx={h.rect.x + h.rect.w / 2}
                cy={h.rect.y + h.rect.h / 2}
                r="5"
              />
            </g>
          ))}

        {calibrate && draft && (
          <rect className="kcc-draft" x={draft.x} y={draft.y} width={draft.w} height={draft.h} />
        )}
      </svg>

      {active && (
        <div className="kcc-plan-card" style={cardStyle} aria-live="polite">
          {active.image && <img src={active.image} alt="" loading="lazy" />}
          <div className="kcc-plan-card-body">
            <span className="kcc-plan-card-kind">{KIND_LABEL[active.kind]}</span>
            <strong>{active.name}</strong>
            {active.summary && <p>{active.summary}</p>}
            {(active.beds || active.sqft) && (
              <p className="kcc-plan-card-meta">{[active.beds, active.sqft].filter(Boolean).join(' · ')}</p>
            )}
            {active.href && (
              <button type="button" className="kcc-plan-card-cta" onClick={() => choose(active)}>
                Go there →
              </button>
            )}
          </div>
        </div>
      )}

      {calibrate && (
        <p className="kcc-calibrate-note">
          Calibrate mode: drag a box over a lot. The rect is copied to your clipboard and logged to the console.
          {draft?.done && ` Last: x ${draft.x}, y ${draft.y}, w ${draft.w}, h ${draft.h}`}
        </p>
      )}
    </div>
  )
}
