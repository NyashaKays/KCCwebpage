// "Step inside": the proposed floor plan as a clickable house.
// Switch floors, tap a room to spotlight it and read its size, or take
// the guided walk from the front porch upstairs, room by room.
// Room rectangles are in pixels of floorplan.png (1024×652); fine-tune
// them with ?calibrate in the URL, like the community plan.
import React, { useMemo, useState } from 'react'

const IMG = '/assets/floorplan.png'
const IMG_SIZE = { width: 1024, height: 652 }

export const FLOORS = {
  first: { label: '1st floor', area: '608 sq ft', viewBox: [0, 92, 512, 560] },
  second: { label: '2nd floor', area: '863 sq ft', viewBox: [512, 92, 512, 560] },
}

// order = the guided walk
export const ROOMS = [
  { id: 'porch', floor: 'first', name: 'Front porch', size: 'Covered entry',
    note: 'Every cottage starts with a porch: a place to sit, wave to neighbors, and come home to.',
    rect: { x: 202, y: 566, w: 296, h: 78 } },
  { id: 'living', floor: 'first', name: 'Living room', size: "13' 5\" × 15' 6\"",
    note: 'Step through the front door into the main living space, open to the kitchen beyond.',
    rect: { x: 274, y: 300, w: 214, h: 262 } },
  { id: 'kitchen', floor: 'first', name: 'Kitchen & dining', size: "13' 5\" × 11' 6\"",
    note: 'An open kitchen with room for a dining table, flowing straight from the living room.',
    image: '/assets/kitchen.webp',
    rect: { x: 274, y: 128, w: 214, h: 172 } },
  { id: 'half-bath', floor: 'first', name: 'Half bath', size: 'Ground floor',
    note: 'A half bath off the hallway, handy for guests.',
    rect: { x: 108, y: 128, w: 96, h: 106 } },
  { id: 'garage', floor: 'first', name: 'One-car garage', size: "12' × 20'",
    note: 'Attached one-car garage on this design. Parking and garage options vary by property.',
    rect: { x: 6, y: 236, w: 194, h: 328 } },
  { id: 'mech', floor: 'first', name: 'Mechanical', size: 'Furnace & water heater',
    note: 'Utilities tucked away beside the garage.',
    rect: { x: 6, y: 128, w: 100, h: 106 } },
  { id: 'primary', floor: 'second', name: 'Primary bedroom', size: "12' 0\" × 12' 5\"",
    note: 'Upstairs, the primary bedroom has its own bathroom and closet.',
    rect: { x: 536, y: 240, w: 192, h: 324 } },
  { id: 'primary-bath', floor: 'second', name: 'Primary bath', size: 'En suite',
    note: 'A private bathroom attached to the primary bedroom.',
    rect: { x: 536, y: 128, w: 152, h: 110 } },
  { id: 'bed2', floor: 'second', name: 'Bedroom 2', size: "9' 1\" × 12' 2\"",
    note: 'A bright second bedroom at the front corner of the house.',
    rect: { x: 866, y: 128, w: 152, h: 192 } },
  { id: 'bath2', floor: 'second', name: 'Shared bath', size: 'Between bedrooms 2 & 3',
    note: 'A full bathroom shared by the two secondary bedrooms.',
    rect: { x: 866, y: 322, w: 152, h: 86 } },
  { id: 'bed3', floor: 'second', name: 'Bedroom 3', size: "13' 5\" × 9' 0\"",
    note: 'The third bedroom works as a kids’ room, guest room, or home office.',
    rect: { x: 842, y: 410, w: 176, h: 154 } },
]

export default function FloorPlanExplorer() {
  const [floor, setFloor] = useState('first')
  const [roomId, setRoomId] = useState('porch')
  const calibrate = useMemo(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('calibrate'),
    []
  )

  const room = ROOMS.find((r) => r.id === roomId)
  const step = ROOMS.indexOf(room)
  const [vx, vy, vw, vh] = FLOORS[floor].viewBox
  const rooms = ROOMS.filter((r) => r.floor === floor)

  const go = (r) => {
    setRoomId(r.id)
    setFloor(r.floor)
  }
  const switchFloor = (f) => {
    setFloor(f)
    if (room.floor !== f) setRoomId(ROOMS.find((r) => r.floor === f).id)
  }

  return (
    <div className="kcc-fp">
      <div className="kcc-fp-stage">
        <div className="kcc-fp-floors" role="tablist" aria-label="Choose a floor">
          {Object.entries(FLOORS).map(([key, f]) => (
            <button
              key={key}
              role="tab"
              aria-selected={floor === key}
              className={floor === key ? 'is-on' : ''}
              onClick={() => switchFloor(key)}
            >
              {f.label} <small>{f.area}</small>
            </button>
          ))}
        </div>

        <svg
          viewBox={`${vx} ${vy} ${vw} ${vh}`}
          className={calibrate ? 'is-calibrating' : ''}
          role="img"
          aria-label={`${FLOORS[floor].label} plan. Select a room.`}
          onClick={(e) => {
            if (!calibrate) return
            const svg = e.currentTarget
            const pt = svg.createSVGPoint()
            pt.x = e.clientX
            pt.y = e.clientY
            const p = pt.matrixTransform(svg.getScreenCTM().inverse())
            console.log('[KCC floor plan] point', Math.round(p.x), Math.round(p.y))
          }}
        >
          <defs>
            <mask id="kcc-fp-spot">
              <rect x={vx} y={vy} width={vw} height={vh} fill="white" />
              {room.floor === floor && (
                <rect x={room.rect.x} y={room.rect.y} width={room.rect.w} height={room.rect.h} rx="4" fill="black" />
              )}
            </mask>
          </defs>
          <rect x={vx} y={vy} width={vw} height={vh} fill="#fff" />
          <image href={IMG} width={IMG_SIZE.width} height={IMG_SIZE.height} />
          {/* everything except the chosen room is softly dimmed */}
          <rect className="kcc-fp-dim" x={vx} y={vy} width={vw} height={vh} mask="url(#kcc-fp-spot)" />
          {rooms.map((r) => (
            <g
              key={r.id}
              className={`kcc-fp-room ${r.id === roomId ? 'is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${r.name}, ${r.size}`}
              aria-pressed={r.id === roomId}
              onClick={() => go(r)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  go(r)
                }
              }}
            >
              <rect x={r.rect.x} y={r.rect.y} width={r.rect.w} height={r.rect.h} rx="4" />
            </g>
          ))}
        </svg>
        <p className="kcc-fp-caption">Proposed 2-story design · 3 bed · 2.5 bath · 1,471 sq ft</p>
      </div>

      <aside className="kcc-fp-panel" aria-live="polite">
        <p className="kcc-fp-step">
          Room {step + 1} of {ROOMS.length} · {FLOORS[room.floor].label}
        </p>
        <h3>{room.name}</h3>
        <p className="kcc-fp-size">{room.size}</p>
        {room.image && <img src={room.image} alt={`${room.name} (illustrative)`} loading="lazy" />}
        <p>{room.note}</p>
        <div className="kcc-fp-nav">
          <button type="button" disabled={step === 0} onClick={() => go(ROOMS[step - 1])}>
            ← Back
          </button>
          <button
            type="button"
            className="is-primary"
            onClick={() => go(ROOMS[(step + 1) % ROOMS.length])}
          >
            {step === ROOMS.length - 1 ? 'Start again' : ROOMS[step + 1].floor !== room.floor ? 'Head upstairs ↑' : 'Next room →'}
          </button>
        </div>
        <small>Illustrative plan. Layouts, dimensions and features vary by property; confirm with the team.</small>
      </aside>
    </div>
  )
}
