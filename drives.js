// Weekend volunteer drives. Dates are relative to November 2026.

export const DRIVE_TYPES = [
  { id: 'feeding', label: 'Feeding drive', icon: 'bowl', tone: 'amber' },
  { id: 'rescue', label: 'Rescue operation', icon: 'siren', tone: 'red' },
  { id: 'camp', label: 'Health camp', icon: 'stethoscope', tone: 'teal' },
  { id: 'awareness', label: 'Awareness session', icon: 'book', tone: 'blue' },
]

export const DRIVES = [
  {
    id: 'drive-blr-nov7',
    title: 'Weekend Feeding Drive — Indiranagar',
    type: 'feeding',
    date: '2026-11-07',
    time: '7:00 – 9:00 AM',
    city: 'Bengaluru',
    venue: 'Indiranagar 100 Ft Road (meet at the metro station exit)',
    spots: 20,
    filled: 12,
    description:
      'Walk a fixed route with the regular feeder team, refill water bowls and log animals that look unwell. Food and gloves are provided.',
  },
  {
    id: 'drive-mum-nov8',
    title: 'Community Dog Feeding & Water Stations',
    type: 'feeding',
    date: '2026-11-08',
    time: '6:30 – 8:30 AM',
    city: 'Mumbai',
    venue: 'Bandra West, near the Carter Road promenade',
    spots: 25,
    filled: 9,
    description:
      'Set up and refill cool water stations along the promenade, and help distribute measured meals at three fixed feeding points.',
  },
  {
    id: 'drive-che-nov14',
    title: 'ABC Camp Support — Registration Desk',
    type: 'camp',
    date: '2026-11-14',
    time: '9:00 AM – 1:00 PM',
    city: 'Chennai',
    venue: 'Guindy community hall',
    spots: 15,
    filled: 13,
    description:
      'Assist a local Animal Birth Control camp: help caregivers register animals, manage queues and prepare post-operative recovery packs.',
  },
  {
    id: 'drive-del-nov15',
    title: 'Rescue Readiness Workshop',
    type: 'awareness',
    date: '2026-11-15',
    time: '10:00 AM – 1:00 PM',
    city: 'New Delhi',
    venue: 'Community centre, Greater Kailash',
    spots: 30,
    filled: 11,
    description:
      'A hands-on session on safe handling, transport and first aid for injured street animals, led by experienced rescuers.',
  },
  {
    id: 'drive-hyd-nov21',
    title: 'Night Ambulance Support',
    type: 'rescue',
    date: '2026-11-21',
    time: '8:00 – 11:00 PM',
    city: 'Hyderabad',
    venue: 'Jubilee Hills (meeting point shared on confirmation)',
    spots: 8,
    filled: 5,
    description:
      'Ride along on night rescue calls, help with safe handling and keep the case log updated. Training is provided at the start of the shift.',
  },
  {
    id: 'drive-jai-nov28',
    title: 'Winter Shelter Preparation',
    type: 'rescue',
    date: '2026-11-28',
    time: '9:00 AM – 12:00 PM',
    city: 'Jaipur',
    venue: 'Shelter site, Amer Road',
    spots: 18,
    filled: 4,
    description:
      'Clean and repair shelter enclosures, sort donated blankets and set up dry bedding before the cold nights arrive.',
  },
  {
    id: 'drive-kol-dec5',
    title: 'Feeding Drive + Vaccination Awareness',
    type: 'feeding',
    date: '2026-12-05',
    time: '7:00 – 9:30 AM',
    city: 'Kolkata',
    venue: 'Auckland Place, near the SPCA',
    spots: 22,
    filled: 7,
    description:
      'Feed community dogs on a fixed route and speak to residents about ABC vaccination and responsible feeding.',
  },
  {
    id: 'drive-pun-dec6',
    title: 'Street Dog Health Check Camp',
    type: 'camp',
    date: '2026-12-06',
    time: '9:00 AM – 1:00 PM',
    city: 'Pune',
    venue: 'Kothrud community ground',
    spots: 10,
    filled: 10,
    description:
      'Support a veterinary team with basic health checks, record-keeping and gentle restraint. Full — join the waitlist.',
  },
]

export const VOLUNTEER_ROLES = [
  { id: 'feeding', label: 'Weekend feeding drives', icon: 'bowl' },
  { id: 'rescue', label: 'Rescue operations', icon: 'siren' },
  { id: 'transport', label: 'Animal transport', icon: 'ambulance' },
  { id: 'medical', label: 'Medical / first aid', icon: 'stethoscope' },
  { id: 'foster', label: 'Fostering', icon: 'home' },
  { id: 'awareness', label: 'Awareness & outreach', icon: 'book' },
]

export const AVAILABILITY = ['Saturday', 'Sunday', 'Both weekend days', 'Weekday evenings']

export const VOLUNTEER_CITIES = [
  'Bengaluru',
  'Chennai',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Chandigarh',
  'Lucknow',
  'Guwahati',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Thiruvananthapuram',
  'Dehradun',
  'Coimbatore',
  'Bhubaneswar',
  'Patna',
  'Other',
]
