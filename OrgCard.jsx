import { CATEGORIES } from '../data/organizations'
import { Icon } from './Icon'

const CATEGORY_META = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]))

const telHref = (phone) => `tel:${phone.replace(/[^+\d]/g, '')}`

export function OrgCard({ org }) {
  const category = CATEGORY_META[org.category] || { label: org.category, icon: 'pin', singular: org.category }
  const mapsQuery = [org.name, org.area, org.city, org.state].filter(Boolean).join(', ')
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${org.name} ${org.city} contact`)}`

  return (
    <article className="org-card card">
      <div className="org-card-top">
        <span className={`badge badge-${org.category}`}>
          <Icon name={category.icon} size={13} /> {category.singular}
        </span>
        {org.distance ? (
          <span className="distance-pill">
            <Icon name="pin" size={12} /> {org.distance}
          </span>
        ) : null}
      </div>

      <h3>{org.name}</h3>
      <p className="org-location">
        <Icon name="pin" size={14} />
        {org.area ? `${org.area}, ` : ''}
        {org.city}, {org.state}
      </p>

      <div className="tag-row">
        {org.services.slice(0, 4).map((service) => (
          <span className="tag" key={service}>
            {service}
          </span>
        ))}
      </div>

      {org.notes ? <p className="org-notes">{org.notes}</p> : null}

      <div className="org-actions">
        {org.phone ? (
          <a className="btn btn-primary btn-sm" href={telHref(org.phone)}>
            <Icon name="phone" size={15} /> {org.phone}
          </a>
        ) : null}
        <a className="btn btn-ghost btn-sm" href={mapsUrl} target="_blank" rel="noreferrer">
          <Icon name="map" size={15} /> Directions
        </a>
        {org.website ? (
          <a className="btn btn-ghost btn-sm" href={org.website} target="_blank" rel="noreferrer">
            <Icon name="globe" size={15} /> Website
          </a>
        ) : (
          <a className="btn btn-ghost btn-sm" href={searchUrl} target="_blank" rel="noreferrer">
            <Icon name="search" size={15} /> Find contact
          </a>
        )}
      </div>

      {org.email ? (
        <a className="org-email" href={`mailto:${org.email}`}>
          <Icon name="mail" size={14} /> {org.email}
        </a>
      ) : null}

      {org.verified ? (
        <span className="verified-note">
          <Icon name="check" size={13} /> Official contact verified
        </span>
      ) : null}
    </article>
  )
}
