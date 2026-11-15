import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { registrationSchema, formatIssues } from '../services/validation.js'
import { createRegistration } from '../db.js'
import { hashIp } from '../utils/security.js'
import { notifyNewRegistration } from '../services/mailer.js'
import { DRIVES } from '../../src/data/drives.js'

export const registrationsRouter = Router()

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: config.registrationRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many registrations from this network. Please try again later.' },
})

registrationsRouter.post('/', registrationLimiter, (req, res, next) => {
  try {
    const parsed = registrationSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(422).json({ error: 'Please check the form and try again.', details: formatIssues(parsed.error) })
    }

    const data = parsed.data
    if (data.honeypot) return res.status(400).json({ error: 'Invalid submission.' })

    if (data.driveId) {
      const drive = DRIVES.find((d) => d.id === data.driveId)
      if (!drive) return res.status(422).json({ error: 'That drive is no longer available.' })
      if (drive.filled >= drive.spots) {
        return res.status(409).json({
          error: 'This drive is full. Choose another date, or register as a general volunteer and we will contact you.',
        })
      }
    }

    const { id, reference } = createRegistration({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      activities: data.activities,
      availability: data.availability,
      experience: data.experience || null,
      message: data.message || null,
      driveId: data.driveId || null,
      ipHash: hashIp(req.ip),
    })

    notifyNewRegistration({ ...data, id, reference }).catch((error) =>
      console.error('[mail] registration notification failed:', error.message),
    )

    return res.status(201).json({
      ok: true,
      id,
      reference,
      message: 'You are registered. A coordinator will contact you before the drive.',
    })
  } catch (error) {
    return next(error)
  }
})
