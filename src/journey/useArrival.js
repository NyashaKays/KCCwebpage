// "Arrive from downtown": as the visitor starts scrolling, the hero
// image slowly pushes in (like walking toward the house) and the
// headline drifts up and fades. Attach to your existing hero.
//
//   const heroRef = useRef(null)
//   useArrival(heroRef)              // hero element
//   <section className="hero" ref={heroRef}>  (uses your .hero-bg and .hero-copy)
import { useLayoutEffect } from 'react'
import { gsap, prefersReducedMotion } from './smoothScroll'

export default function useArrival(heroRef, { image = '.hero-bg', copy = '.hero-copy' } = {}) {
  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 },
      })
      tl.to(image, { scale: 1.18, yPercent: 6, ease: 'none', transformOrigin: '50% 60%' }, 0)
      if (hero.querySelector(copy)) {
        tl.to(copy, { yPercent: -30, opacity: 0, ease: 'none' }, 0)
      }
    }, hero)

    return () => ctx.revert()
  }, [heroRef, image, copy])
}
