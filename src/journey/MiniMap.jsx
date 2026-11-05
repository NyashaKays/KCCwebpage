// "You are here" mini-map, pinned to a corner of the screen.
// Watches the page sections listed in JOURNEY_STOPS and moves a dot
// across the plan as the visitor scrolls. Clicking a stop jumps there.
import React, { useEffect, useState } from 'react'
import { PLAN_IMAGE, PLAN_SIZE, PLAN_VIEWBOX, JOURNEY_STOPS } from './planData'
import { scrollToTarget } from './smoothScroll'

export default function MiniMap({ stops: allStops = JOURNEY_STOPS, hideOn = '.hero' }) {
  const [stops, setStops] = useState(allStops)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false) // expanded state on small screens

  // Only keep stops whose section actually exists on this page.
  useEffect(() => {
    setStops(allStops.filter((s) => document.querySelector(s.selector)))
  }, [allStops])

  // Which section is in the middle of the screen?
  useEffect(() => {
    const els = stops.map((s) => document.querySelector(s.selector))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const i = els.indexOf(entry.target)
          if (i !== -1) setIndex(i)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' } // a thin band across the middle
    )
    els.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [stops])

  // Stay out of the way while the hero is on screen.
  useEffect(() => {
    const hero = hideOn && document.querySelector(hideOn)
    if (!hero) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0.35 })
    io.observe(hero)
    return () => io.disconnect()
  }, [hideOn])

  const stop = stops[index] ?? stops[0]
  const [vx, vy, vw, vh] = PLAN_VIEWBOX
  if (!stop) return null

  return (
    <aside
      className={`kcc-minimap ${visible ? 'is-visible' : ''} ${open ? 'is-open' : ''}`}
      aria-label="Where you are in the community"
    >
      <button
        type="button"
        className="kcc-minimap-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="kcc-minimap-dot-icon" aria-hidden="true" />
        <span className="kcc-minimap-place">{stop.place}</span>
      </button>

      <div className="kcc-minimap-panel">
        <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} aria-hidden="true">
          <image href={PLAN_IMAGE} width={PLAN_SIZE.width} height={PLAN_SIZE.height} />
          {/* the walked path so far */}
          <polyline
            className="kcc-minimap-path"
            points={stops
              .slice(0, index + 1)
              .map((s) => `${s.point.x},${s.point.y}`)
              .join(' ')}
          />
          {stops.map((s, i) => (
            <circle
              key={s.selector}
              className={`kcc-minimap-stop ${i <= index ? 'is-passed' : ''}`}
              cx={s.point.x}
              cy={s.point.y}
              r="7"
            />
          ))}
          {/* the moving "you are here" dot (CSS transform animates it) */}
          <g className="kcc-minimap-you" style={{ transform: `translate(${stop.point.x}px, ${stop.point.y}px)` }}>
            <circle className="kcc-minimap-pulse" r="16" />
            <circle r="9" />
          </g>
        </svg>

        <ol className="kcc-minimap-stops">
          {stops.map((s, i) => (
            <li key={s.selector}>
              <button
                type="button"
                className={i === index ? 'is-current' : ''}
                aria-current={i === index ? 'location' : undefined}
                onClick={() => {
                  scrollToTarget(s.selector)
                  setOpen(false)
                }}
              >
                {s.place}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
