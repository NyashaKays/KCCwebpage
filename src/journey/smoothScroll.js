// Smooth scrolling (Lenis) kept in sync with GSAP ScrollTrigger.
// Call initSmoothScroll() once at app start; it returns a cleanup fn.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HEADER_OFFSET = -90 // your sticky header is 86px tall

let lenis = null

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmoothScroll() {
  // People who ask for reduced motion keep normal native scrolling.
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    lerp: 0.1, // lower = floatier, higher = snappier
    anchors: { offset: HEADER_OFFSET }, // makes your existing #hash nav links smooth
  })

  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

// Scroll to an element or selector, smoothly if Lenis is running.
export function scrollToTarget(target, offset = HEADER_OFFSET) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4 })
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export { gsap, ScrollTrigger }
