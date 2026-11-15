import { useState } from 'react'
import { Icon } from './Icon'

export function MythCard({ myth }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="myth-card-slot">
      <button
        type="button"
        className={`myth-card ${open ? 'is-open' : ''}`}
        aria-pressed={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="visually-hidden">
          {open
            ? `Myth: ${myth.myth}. Fact: ${myth.fact} ${myth.source ? `Source: ${myth.source}.` : ''} Activate to hide the facts.`
            : `Myth: ${myth.myth}. Activate to reveal the facts.`}
        </span>
        <span className="myth-inner" aria-hidden="true">
          <span className="myth-face myth-front">
            <span className="myth-media">
              <img src={myth.image} alt={myth.imageAlt || ''} loading="lazy" decoding="async" />
            </span>
            <span className="myth-eyebrow">
              <Icon name={myth.icon || 'paw'} size={15} /> {myth.category}
            </span>
            <span className="myth-quote">“{myth.myth}”</span>
            <span className="myth-hint">
              Tap to see the facts <Icon name="arrowRight" size={15} />
            </span>
          </span>
          <span className="myth-face myth-back">
            <span className="myth-watermark" aria-hidden="true">
              <Icon name={myth.icon || 'paw'} size={150} />
            </span>
            <span className="myth-eyebrow">
              <Icon name="spark" size={15} /> Actually…
            </span>
            <span className="myth-fact">{myth.fact}</span>
            {myth.source ? <span className="myth-source">{myth.source}</span> : null}
          </span>
        </span>
      </button>
    </div>
  )
}
