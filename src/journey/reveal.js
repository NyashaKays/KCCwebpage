// Reveal-on-scroll that never leaves blank sections.
// Elements with data-reveal start visible; only once this runs does the
// page opt into hiding them, and each is revealed slightly BEFORE it
// enters the screen so fast scrolling doesn't outrun the animation.
export function initReveal(root = document) {
  if (!('IntersectionObserver' in window)) return () => {}

  const els = [...root.querySelectorAll('[data-reveal]')]
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('is-revealed')
          io.unobserve(e.target)
        }
      })
    },
    { rootMargin: '0px 0px 20% 0px' } // trigger 20% of a screen early
  )

  // anything already on screen or above it shows immediately
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-revealed')
    else io.observe(el)
  })
  document.documentElement.classList.add('js-reveal-ready')

  return () => {
    io.disconnect()
    document.documentElement.classList.remove('js-reveal-ready')
  }
}
