export function SectionHeading({ eyebrow, title, subtitle, align = 'left', action }) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-center' : ''}`}>
      <div className="section-heading-text">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  )
}
