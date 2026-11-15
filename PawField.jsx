import { Icon } from './Icon'

const PAWS = [
  { top: '9%', left: '4%', size: 74, rotate: -18, delay: '0s', duration: '9s', opacity: 0.1 },
  { top: '66%', left: '6%', size: 44, rotate: 14, delay: '-2.4s', duration: '8s', opacity: 0.08 },
  { top: '17%', left: '88%', size: 62, rotate: 24, delay: '-4.1s', duration: '10s', opacity: 0.09 },
  { top: '76%', left: '84%', size: 92, rotate: -10, delay: '-1.2s', duration: '9s', opacity: 0.07 },
  { top: '37%', left: '49%', size: 36, rotate: 8, delay: '-5.6s', duration: '11s', opacity: 0.05 },
  { top: '5%', left: '62%', size: 48, rotate: -24, delay: '-3.3s', duration: '8.5s', opacity: 0.07 },
  { top: '86%', left: '38%', size: 58, rotate: 16, delay: '-6.2s', duration: '10.5s', opacity: 0.06 },
  { top: '48%', left: '93%', size: 40, rotate: -14, delay: '-0.8s', duration: '7.5s', opacity: 0.1 },
]

/**
 * Decorative paw prints that spring gently in a hero or section background.
 * Purely presentational: hidden from assistive tech and disabled for
 * reduced-motion users.
 */
export function PawField({ variant = 'light', className = '' }) {
  return (
    <div className={`paw-field paw-field-${variant} ${className}`.trim()} aria-hidden="true">
      {PAWS.map((paw, index) => (
        <span
          className="paw-print"
          key={index}
          style={{
            '--paw-top': paw.top,
            '--paw-left': paw.left,
            '--paw-rotate': `${paw.rotate}deg`,
            '--paw-delay': paw.delay,
            '--paw-duration': paw.duration,
            '--paw-opacity': paw.opacity,
          }}
        >
          <Icon name="paw" size={paw.size} strokeWidth={1.15} />
        </span>
      ))}
    </div>
  )
}
