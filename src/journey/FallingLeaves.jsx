// A few leaves drifting through a section, autumn only (Sep–Nov).
// Decorative: hidden from screen readers, off for reduced motion.
import React from 'react'

const LEAVES = [
  { left: 6, delay: 0, dur: 16, size: 22, hue: '#c8102e', rot: 20 },
  { left: 18, delay: 6, dur: 19, size: 16, hue: '#9b0c23', rot: -30 },
  { left: 33, delay: 2.5, dur: 14, size: 18, hue: '#d9822b', rot: 60 },
  { left: 49, delay: 9, dur: 18, size: 24, hue: '#c8102e', rot: -10 },
  { left: 63, delay: 4, dur: 15, size: 15, hue: '#111111', rot: 40 },
  { left: 77, delay: 11, dur: 20, size: 20, hue: '#9b0c23', rot: -50 },
  { left: 90, delay: 1.5, dur: 17, size: 17, hue: '#d9822b', rot: 15 },
]

export default function FallingLeaves({ months = [8, 9, 10] }) {
  if (!months.includes(new Date().getMonth())) return null
  return (
    <div className="kcc-leaves" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur}s`,
            '--leaf-rot': `${l.rot}deg`,
          }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 24 24">
            <path
              fill={l.hue}
              d="M12 2c3 3 7 4 9 3-1 4-2 8-6 11 1 2 1 4 0 6l-3-4-3 4c-1-2-1-4 0-6C5 13 4 9 3 5c2 1 6 0 9-3Z"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}
