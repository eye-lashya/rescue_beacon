import { z } from 'zod'
import { VOLUNTEER_ROLES } from '../../src/data/drives.js'

const optionalText = (max) =>
  z.preprocess((v) => (v == null ? '' : String(v).trim()), z.string().max(max))

const optionalEmail = z.preprocess(
  (v) => (v == null ? '' : String(v).trim()),
  z.string().max(140).refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.'),
)

const optionalPhone = z.preprocess(
  (v) => (v == null ? '' : String(v).trim()),
  z.string().max(24).refine((v) => v === '' || /^[0-9+\-\s()]{7,24}$/.test(v), 'Enter a valid phone number.'),
)

const optionalNumber = (min, max) =>
  z.preprocess((v) => {
    if (v == null || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }, z.number().min(min).max(max).optional())

export const REPORT_CATEGORIES = [
  'cruelty',
  'injury',
  'accident',
  'abandonment',
  'illegal_trade',
  'other',
]
export const ANIMAL_TYPES = ['dog', 'cat', 'cattle', 'bird', 'wildlife', 'other']

export const reportSchema = z.object({
  category: z.enum(REPORT_CATEGORIES),
  animalType: z.enum(ANIMAL_TYPES),
  severity: z.coerce.number().int().min(1).max(3),
  description: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().min(20, 'Please describe the situation in at least 20 characters.').max(2000),
  ),
  locationText: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().min(5, 'Add a landmark, area or city so rescuers can find the animal.').max(300),
  ),
  latitude: optionalNumber(-90, 90),
  longitude: optionalNumber(-180, 180),
  name: optionalText(80),
  phone: optionalPhone,
  email: optionalEmail,
  honeypot: optionalText(200),
})

export const registrationSchema = z.object({
  name: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().min(2, 'Enter your full name.').max(80),
  ),
  email: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().email('Enter a valid email address.').max(140),
  ),
  phone: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().regex(/^[0-9+\-\s()]{7,24}$/, 'Enter a valid phone number.'),
  ),
  city: z.preprocess(
    (v) => (v == null ? '' : String(v).trim()),
    z.string().min(2, 'Select your city.').max(80),
  ),
  activities: z
    .array(z.enum(VOLUNTEER_ROLES.map((r) => r.id)))
    .min(1, 'Choose at least one way to help.')
    .max(VOLUNTEER_ROLES.length),
  availability: z
    .array(z.enum(['Saturday', 'Sunday', 'Both weekend days', 'Weekday evenings']))
    .min(1, 'Tell us when you are available.'),
  experience: optionalText(500),
  message: optionalText(1000),
  driveId: optionalText(80),
  consent: z.literal(true, { error: 'Please confirm you can attend responsibly.' }),
  honeypot: optionalText(200),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
})

export const statusSchema = z.object({
  status: z.enum(['new', 'in_review', 'resolved', 'closed']),
})

export function formatIssues(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'form',
    message: issue.message,
  }))
}
