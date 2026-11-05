// "Walk down the street": the section pins in place and a row of
// cottage façades slides sideways as the visitor scrolls down, with a
// slower background layer for depth. On phones and for reduced motion
// it falls back to a normal swipeable row (scroll-snap).
import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from './smoothScroll'

export default function StreetWalk({ title = 'Take a walk down the street', houses = [], id = 'street' }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const backRef = useRef(null)

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
    <section className="kcc-street" id={id} ref={sectionRef}>
      <div className="kcc-street-back" ref={backRef} aria-hidden="true" />
      <div className="kcc-street-head">
        <p className="kcc-eyebrow">The cottages</p>
        <h2>{title}</h2>
      </div>
      <ul className="kcc-street-track" ref={trackRef}>
        {houses.map((h) => (
          <li className="kcc-street-house" key={h.label}>
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
