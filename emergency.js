// Emergency numbers for India.
// The national numbers below are standard, government-operated lines that work
// everywhere in India. Always verify local lines before publishing.

export const EMERGENCY_NUMBERS = [
  {
    id: 'er',
    number: '112',
    tel: '112',
    label: 'Emergency Response',
    description: 'All-in-one emergency line — police, ambulance and fire.',
    icon: 'siren',
    tone: 'danger',
    verified: true,
    primary: true,
  },
  {
    id: 'ambulance',
    number: '108',
    tel: '108',
    label: 'Ambulance',
    description: 'Free emergency ambulance in most states — for critically injured animals too.',
    icon: 'ambulance',
    tone: 'danger',
    verified: true,
  },
  {
    id: 'fire',
    number: '101',
    tel: '101',
    label: 'Fire Services',
    description: 'Fires, animal trapped in a building, heat-stroke rescues.',
    icon: 'flame',
    verified: true,
  },
  {
    id: 'police',
    number: '100',
    tel: '100',
    label: 'Police',
    description: 'Report active cruelty, animal transport violations or attacks on people.',
    icon: 'shield',
    verified: true,
  },
  {
    id: 'awbi',
    number: '0129-2555700',
    tel: '+911292555700',
    label: 'Animal Welfare Board of India',
    description: 'National statutory body — cruelty complaints & recognised AWOs.',
    icon: 'landmark',
    tone: 'brand',
    verified: true,
    note: 'Mon–Fri, 9:00 AM – 5:30 PM · support@awbi.gov.in',
  },
]

export const EMERGENCY_STEPS = [
  {
    title: 'Make sure you are safe first',
    body: 'Never put yourself in the middle of an attack or an armed/angry crowd. Observe from a safe distance and note details.',
    icon: 'shield',
  },
  {
    title: 'Call the right line',
    body: 'Life-threatening emergency or crime in progress → 112. Critically injured animal → 108 ambulance or a local NGO from the directory.',
    icon: 'phone',
  },
  {
    title: 'Capture evidence safely',
    body: 'Time, location, photos or a short video from a safe distance. Evidence is what makes a cruelty complaint stick.',
    icon: 'camera',
  },
  {
    title: 'Report it in writing',
    body: 'File a report with us and with the local police — cruelty is an offence under the Prevention of Cruelty to Animals Act, 1960.',
    icon: 'file',
  },
]

export const EMERGENCY_DONT = [
  'Do not crowd or provoke a frightened, injured animal — it may bite out of fear.',
  'Do not move a spine-injured animal unless there is fire or traffic danger.',
  'Do not pour water on an unconscious animal or force-feed it.',
  'Do not chase or throw stones at street dogs — it teaches fear and aggression.',
  'Do not ignore a bite — wash for 15 minutes with soap and running water and start rabies PEP the same day.',
]
