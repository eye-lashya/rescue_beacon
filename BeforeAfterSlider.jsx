import { useState } from 'react'

export function BeforeAfterSlider({ before, after, name = 'the animal', className = '' }) {
  const [position, setPosition] = useState(50)

  return (
    <figure
      className={`ba-slider ${className}`}
      style={{ '--pos': `${position}%` }}
    >
      <img className="ba-image" src={after} alt={`${name} after recovery`} loading="lazy" />
      <div className="ba-before-layer">
        <img className="ba-image" src={before} alt={`${name} before rescue`} loading="lazy" />
      </div>

      <span className="ba-tag ba-tag-before">Before</span>
      <span className="ba-tag ba-tag-after">After</span>

      <div className="ba-divider" aria-hidden="true">
        <span className="ba-handle">
          <span>‹</span>
          <span>›</span>
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`Compare before and after photos of ${name}. Use the arrow keys to move the divider.`}
        className="ba-range"
      />
    </figure>
  )
}
