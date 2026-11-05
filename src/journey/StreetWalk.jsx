// "Walk down the street": the section pins in place and a row of
// cottage façades slides sideways as the visitor scrolls down, with a
// slower background layer for depth. On phones and for reduced motion
// it falls back to a normal swipeable row (scroll-snap).
//
// Day to dusk: as you walk, the sky darkens, porch lights come on and
// fireflies appear. The lamp button switches dusk on or off anywhere.
import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from './smoothScroll'

// [left %, top %, delay s]
const FIREFLIES = [[8, 30, 0], [17, 55, 1.2], [28, 38, 2.4], [41, 62, 0.6], [52, 28, 1.8], [61, 50, 3], [72, 35, 0.9], [83, 58, 2.1], [91, 32, 1.5], [36, 70, 2.7]]

export default function StreetWalk({ title = 'Take a walk down the street', houses = [], id = 'street' }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const backRef = useRef(null)
  const [dusk, setDusk] = useState(false)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = trackRef.current
        const distance = () => track.scrollWidth - window.innerWidth

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        tl.to(track, { x: () => -distance(), ease: 'none' }, 0)
        // background moves at a third of the speed → depth
        tl.to(backRef.current, { x: () => -distance() / 3, ease: 'none' }, 0)
        // the sun sets over the second half of the walk
        tl.fromTo(sectionRef.current, { '--dusk': 0 }, { '--dusk': 1, ease: 'power1.in' }, 0)

        // each house lifts slightly as it reaches the centre of the screen
        gsap.utils.toArray('.kcc-street-house', track).forEach((house) => {
          gsap.fromTo(
            house,
            { y: 30, opacity: 0.55 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: house,
                containerAnimation: tl,
                start: 'left 85%',
                end: 'center 55%',
                scrub: true,
              },
            }
          )
        })
      })
    }, sectionRef)

    // images change the track width once they load
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('load', onLoad)
      ctx.revert()
    }
  }, [houses.length])

  return (
    <section
      className={`kcc-street ${dusk ? 'is-dusk' : ''}`}
      id={id}
      ref={sectionRef}
      style={{ '--dusk-force': dusk ? 1 : 0 }}
    >
      <div className="kcc-street-back" ref={backRef} aria-hidden="true" />
      <div className="kcc-street-sky" aria-hidden="true" />
      <div className="kcc-fireflies" aria-hidden="true">
        {FIREFLIES.map(([l, t, d], i) => (
          <span key={i} style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${d}s` }} />
        ))}
      </div>
      <div className="kcc-street-head">
        <div>
          <p className="kcc-eyebrow">The cottages</p>
          <h2>{title}</h2>
        </div>
        <button
          type="button"
          className="kcc-dusk-toggle"
          aria-pressed={dusk}
          onClick={() => setDusk((d) => !d)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {dusk ? <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-12.8L17 7m-10 10-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /> : <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />}
          </svg>
          {dusk ? 'Back to daytime' : 'Turn on the porch lights'}
        </button>
      </div>
      <ul className="kcc-street-track" ref={trackRef}>
        {houses.map((h, i) => (
          <li className="kcc-street-house" key={`${i}-${h.label}`}>
            <a href={h.href ?? '#contact'}>
              <img src={h.image} alt={h.alt ?? h.label} loading="lazy" />
              <span className="kcc-street-sign">
                <strong>{h.label}</strong>
                {h.sub && <span>{h.sub}</span>}
              </span>
            </a>
          </li>
        ))}
        <li className="kcc-street-end" aria-hidden="true" />
      </ul>
      <div className="kcc-street-ground" aria-hidden="true" />
    </section>
  )
}
