import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { PawField } from '../components/PawField'
import { Icon } from '../components/Icon'
import { PHOTO_CREDITS, SEASONAL_CARE, THREATS } from '../data/care'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const SEVERITY = [
  {
    label: 'Every day',
    value: 'Preventable',
    text: 'Most injuries on this page are caused by ordinary human choices, not natural disaster.',
  },
  {
    label: 'Fastest killers',
    value: 'Heat · traffic · poison',
    text: 'These three can kill within hours. Knowing what to do in the first ten minutes matters.',
  },
  {
    label: 'Longest shadow',
    value: 'Cruelty · trade',
    text: 'Illegal wildlife trade and organised cruelty leave harm that outlives the individual animal.',
  },
]

const FIRST_AID = [
  {
    title: 'Keep yourself safe first',
    text: 'An injured animal may bite or scratch out of fear. Use a towel, a box or a blanket as a barrier. Never put your face close to a frightened dog, cat or wild animal.',
  },
  {
    title: 'Call before you move',
    text: 'Suspected spinal injury, a fractured limb or a collapsed animal should be assessed by a rescuer. Call a local rescue or vet and follow their instructions.',
  },
  {
    title: 'Cover, warm, shade',
    text: 'Keep the animal warm and quiet. Shade it from the sun, or move it gently onto a firm surface if it is in traffic. Do not give food or water to an unconscious animal.',
  },
  {
    title: 'Document and report',
    text: 'Take clear photos and note the location. For cruelty, file a written complaint with the police or SPCA. For wildlife, call the forest department before intervening.',
  },
]

export default function Threats() {
  useDocumentTitle('What harms animals')

  return (
    <>
      <section className="threat-hero">
        <PawField variant="dark" />
        <div className="container threat-hero-inner">
          <div className="threat-hero-copy">
            <p className="eyebrow eyebrow-light">What harms animals</p>
            <h1>The danger is rarely nature. It is usually us.</h1>
            <p className="threat-hero-lead">
              Traffic, garbage, heat, fireworks, poison, cruelty and illegal wildlife trade hurt animals every single
              day. None of it is inevitable. Here is what causes the harm — and what actually reduces it.
            </p>
            <div className="threat-hero-actions">
              <Link className="btn btn-accent btn-lg" to="/care">
                <Icon name="paw" size={18} /> Learn species care
              </Link>
              <Link className="btn btn-outline-light btn-lg" to="/report">
                <Icon name="camera" size={18} /> Report cruelty
              </Link>
            </div>
            <ul className="threat-hero-points">
              <li>
                <Icon name="check" size={15} /> 10 common threats
              </li>
              <li>
                <Icon name="check" size={15} /> Practical prevention
              </li>
              <li>
                <Icon name="check" size={15} /> First-aid basics
              </li>
            </ul>
          </div>

          <div className="threat-hero-media">
            <img
              className="threat-hero-main"
              src="/images/animals/monkey.jpg"
              alt="A monkey sitting on a wall near human habitation"
              width="900"
              height="596"
            />
            <img
              className="threat-hero-small"
              src="/images/animals/kingfisher.jpg"
              alt="A kingfisher perched above water"
              width="900"
              height="601"
            />
            <span className="threat-hero-tag">
              <Icon name="shield" size={16} /> Prevention beats rescue
            </span>
          </div>
        </div>
      </section>

      <section className="section threat-stats-section">
        <div className="container threat-stats">
          {SEVERITY.map((item) => (
            <article className="threat-stat" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="The ten biggest threats"
            title="What hurts animals — and what you can do about it."
            subtitle="Each card names the harm plainly, then gives the action that makes a real difference. Start with the one you can change today."
          />
          <div className="threat-grid">
            {THREATS.map((threat, index) => (
              <article className={`threat-card card threat-${threat.tone}`} key={threat.id}>
                <div className="threat-card-head">
                  <span className="threat-icon">
                    <Icon name={threat.icon} size={24} />
                  </span>
                  <span className="threat-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{threat.title}</h3>
                <div className="threat-block">
                  <span className="threat-label">
                    <Icon name="alert" size={13} /> How it harms
                  </span>
                  <p>{threat.impact}</p>
                </div>
                <div className="threat-block threat-help">
                  <span className="threat-label">
                    <Icon name="check" size={13} /> What helps
                  </span>
                  <p>{threat.help}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature split-reverse threat-aid">
          <div className="split-copy">
            <p className="eyebrow">First response</p>
            <h2>The first ten minutes can decide whether an animal survives.</h2>
            <p>
              You do not need to be a vet to help. You need to stay calm, keep the animal safe and reach someone who
              can treat it. These four steps apply to almost every emergency.
            </p>
            <ol className="aid-steps">
              {FIRST_AID.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
            <Link className="btn btn-primary" to="/emergency">
              Find emergency help <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="split-media threat-aid-media">
            <img
              src="/images/animals/dog-golden.jpg"
              alt="A puppy resting safely on a soft surface"
              loading="lazy"
              width="900"
              height="1443"
            />
            <span className="feature-chip">
              <Icon name="heart" size={15} /> Calm, cover, call
            </span>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Seasonal threats"
            title="The risk changes with the calendar."
            subtitle="Heatstroke in May, leptospirosis in August, fireworks in November. Plan for the season before it arrives."
            action={
              <Link to="/care" className="btn btn-ghost btn-sm">
                Seasonal care plans <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <div className="season-grid season-grid-threats">
            {SEASONAL_CARE.map((season) => (
              <article className={`season-card card season-${season.tone}`} key={season.id}>
                <div className="season-head">
                  <span className="season-icon">
                    <Icon name={season.icon} size={22} />
                  </span>
                  <div>
                    <h3>{season.label}</h3>
                    <p>{season.months}</p>
                  </div>
                </div>
                <p className="season-summary">{season.warning}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container threat-pledge">
          <div className="threat-pledge-copy">
            <p className="eyebrow">A small pledge</p>
            <h2>Five things almost anyone can do this week.</h2>
            <ul className="pledge-list">
              <li>
                <Icon name="check" size={16} /> Put out a heavy water bowl in shade.
              </li>
              <li>
                <Icon name="check" size={16} /> Slow down in lanes where street animals live.
              </li>
              <li>
                <Icon name="check" size={16} /> Bin plastic and sharp food waste properly.
              </li>
              <li>
                <Icon name="check" size={16} /> Keep festival sweets and fireworks away from animals.
              </li>
              <li>
                <Icon name="check" size={16} /> Speak up — report cruelty instead of scrolling past.
              </li>
            </ul>
            <div className="threat-pledge-actions">
              <Link className="btn btn-accent" to="/report">
                <Icon name="camera" size={17} /> File a cruelty report
              </Link>
              <Link className="btn btn-ghost" to="/directory">
                Find a local responder <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
          <aside className="threat-credits">
            <p className="eyebrow">Image credits</p>
            <p>
              Wildlife and companion-animal photographs come from Wikimedia Commons and Unsplash. Wikimedia images keep
              their original attribution and share-alike terms.
            </p>
            <details>
              <summary>
                <span>View all credits</span>
                <Icon name="chevronDown" size={16} />
              </summary>
              <ul>
                {PHOTO_CREDITS.map((credit) => (
                  <li key={credit.file}>
                    <strong>{credit.title}</strong> — {credit.author} ({credit.license}, {credit.source})
                  </li>
                ))}
              </ul>
            </details>
          </aside>
        </div>
      </section>
    </>
  )
}
