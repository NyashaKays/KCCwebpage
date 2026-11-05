// "Design your cottage": pick an exterior, bedrooms, garage and timing,
// see the home change, then send the choices to the team in one tap.
import React, { useState } from 'react'

const EMAIL = 'Scott@fc-inc.com'

export const EXTERIORS = [
  { id: 'blue', label: 'Classic blue', note: 'White trim & covered porch', image: '/assets/home-1.webp' },
  { id: 'gray', label: 'Modern gray', note: 'Stone accents & front garage', image: '/assets/home-2.webp' },
  { id: 'yellow', label: 'Butter yellow', note: 'Two-story with shutters', image: '/assets/home-3.webp' },
]

const GROUPS = [
  { key: 'beds', label: 'Bedrooms', options: ['2 bedrooms', '3 bedrooms'] },
  { key: 'garage', label: 'Garage', options: ['With garage', 'No garage', 'Not sure yet'] },
  { key: 'timing', label: 'When would you like to move?', options: ['As soon as possible', 'In 3–6 months', 'In 6–12 months', 'Just exploring'] },
]

export default function CottagePicker() {
  const [exterior, setExterior] = useState(EXTERIORS[0])
  const [picks, setPicks] = useState({ beds: '3 bedrooms', garage: 'Not sure yet', timing: 'Just exploring' })

  const garageText = { 'With garage': 'with garage', 'No garage': 'no garage', 'Not sure yet': 'garage undecided' }[picks.garage]
  const summary = `${picks.beds}, ${exterior.label.toLowerCase()} exterior, ${garageText}`
  const subject = `KCC home inquiry: ${summary}`
  const body = [
    'Hi Fortune Companies team,',
    '',
    "I'm interested in a home at Kokomo Cottage Community. Here's what I'm looking for:",
    '',
    `• Exterior style: ${exterior.label} (${exterior.note})`,
    `• Bedrooms: ${picks.beds}`,
    `• Garage: ${picks.garage}`,
    `• Move-in timing: ${picks.timing}`,
    '',
    'Could you share current availability, pricing and next steps?',
    '',
    'Thank you,',
  ].join('\n')
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div className="kcc-picker">
      <div className="kcc-picker-stage">
        {EXTERIORS.map((x) => (
          <img
            key={x.id}
            src={x.image}
            alt={x.id === exterior.id ? `${x.label} cottage exterior (illustrative)` : ''}
            aria-hidden={x.id !== exterior.id}
            className={x.id === exterior.id ? 'is-on' : ''}
          />
        ))}
        <span className="kcc-picker-tag">{summary}</span>
      </div>

      <div className="kcc-picker-controls">
        <fieldset>
          <legend>Exterior style</legend>
          <div className="kcc-swatches">
            {EXTERIORS.map((x) => (
              <label key={x.id} className={`kcc-swatch sw-${x.id} ${x.id === exterior.id ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="kcc-exterior"
                  checked={x.id === exterior.id}
                  onChange={() => setExterior(x)}
                />
                <span className="kcc-swatch-dot" aria-hidden="true" />
                <span>
                  <strong>{x.label}</strong>
                  <small>{x.note}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {GROUPS.map((g) => (
          <fieldset key={g.key}>
            <legend>{g.label}</legend>
            <div className="kcc-chips">
              {g.options.map((o) => (
                <label key={o} className={`kcc-chip ${picks[g.key] === o ? 'is-on' : ''}`}>
                  <input
                    type="radio"
                    name={`kcc-${g.key}`}
                    checked={picks[g.key] === o}
                    onChange={() => setPicks((p) => ({ ...p, [g.key]: o }))}
                  />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <a className="button kcc-picker-send" href={mailto}>
          Ask about this home
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M4 12h15M13 5l7 7-7 7" />
          </svg>
        </a>
        <small className="kcc-picker-note">
          Opens an email to the KCC team with your choices filled in. Images are illustrative; exteriors, layouts and
          options vary by property.
        </small>
      </div>
    </div>
  )
}
