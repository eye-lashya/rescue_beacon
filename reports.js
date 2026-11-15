import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { reportSchema, formatIssues } from '../services/validation.js'
import { handlePhotoUpload } from '../middleware/upload.js'
import { createReport, getReport } from '../db.js'
import { hashIp } from '../utils/security.js'
import { notifyNewReport } from '../services/mailer.js'

export const reportsRouter = Router()

const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: config.reportRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many reports from this network. Please try again later — or call 112 if an animal is in immediate danger.',
  },
})

const removeFile = (file) => {
  if (file?.path) fs.rmSync(file.path, { force: true })
}

reportsRouter.post('/', reportLimiter, handlePhotoUpload, (req, res, next) => {
  try {
    const parsed = reportSchema.safeParse(req.body)
    if (!parsed.success) {
      removeFile(req.file)
      return res.status(422).json({ error: 'Please check the form and try again.', details: formatIssues(parsed.error) })
    }

    const data = parsed.data
    if (data.honeypot) {
      removeFile(req.file)
      return res.status(400).json({ error: 'Invalid submission.' })
    }

    const { id, reference } = createReport({
      category: data.category,
      animalType: data.animalType,
      severity: data.severity,
      description: data.description,
      locationText: data.locationText,
      lat: data.latitude ?? null,
      lng: data.longitude ?? null,
      photoPath: req.file ? req.file.path : null,
      photoOriginalName: req.file ? req.file.originalname.slice(0, 180) : null,
      name: data.name || null,
      phone: data.phone || null,
      email: data.email || null,
      ipHash: hashIp(req.ip),
    })

    const report = getReport(id)
    notifyNewReport(report).catch((error) => console.error('[mail] report notification failed:', error.message))

    return res.status(201).json({
      ok: true,
      id,
      reference,
      photoUrl: req.file ? `/uploads/${path.basename(req.file.path)}` : null,
      message: 'Report received. Rescuers will review it and use your details if they need more information.',
    })
  } catch (error) {
    removeFile(req.file)
    return next(error)
  }
})
