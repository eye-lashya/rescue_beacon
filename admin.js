import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { adminLoginSchema, statusSchema, formatIssues } from '../services/validation.js'
import { issueAdminToken, verifyAdminToken, safeEqual, csvEscape } from '../utils/security.js'
import { listReports, getReport, updateReportStatus, listRegistrations, adminStats } from '../db.js'
import { config } from '../config.js'

export const adminRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Try again in 15 minutes.' },
})

adminRouter.post('/login', loginLimiter, (req, res) => {
  const parsed = adminLoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(422).json({ error: 'Enter your password.' })
  if (!safeEqual(parsed.data.password, config.adminPassword)) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }
  return res.json(issueAdminToken())
})

adminRouter.use((req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
  return next()
})

const paging = (query) => {
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 50))
  const offset = Math.max(0, Number.parseInt(query.offset, 10) || 0)
  return { limit, offset }
}

adminRouter.get('/stats', (req, res) => {
  res.json(adminStats())
})

adminRouter.get('/reports', (req, res) => {
  const status = ['new', 'in_review', 'resolved', 'closed'].includes(req.query.status) ? req.query.status : undefined
  const { limit, offset } = paging(req.query)
  res.json(listReports({ status, limit, offset }))
})

adminRouter.get('/reports/export', (req, res) => {
  const { items } = listReports({ limit: 5000, offset: 0 })
  const columns = ['reference', 'created_at', 'status', 'category', 'animal_type', 'severity', 'location_text', 'lat', 'lng', 'reporter_name', 'reporter_phone', 'reporter_email', 'description', 'photoUrl']
  const rows = [columns.join(',')]
  for (const item of items) rows.push(columns.map((key) => csvEscape(item[key])).join(','))
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="rescue-beacon-reports-${new Date().toISOString().slice(0, 10)}.csv"`)
  res.send(rows.join('\n'))
})

adminRouter.get('/reports/:id', (req, res) => {
  const report = getReport(Number(req.params.id))
  if (!report) return res.status(404).json({ error: 'Report not found.' })
  return res.json(report)
})

adminRouter.patch('/reports/:id', (req, res) => {
  const parsed = statusSchema.safeParse(req.body)
  if (!parsed.success) return res.status(422).json({ error: 'Invalid status.', details: formatIssues(parsed.error) })
  const report = updateReportStatus(Number(req.params.id), parsed.data.status)
  if (!report) return res.status(404).json({ error: 'Report not found.' })
  return res.json(report)
})

adminRouter.get('/registrations', (req, res) => {
  const { limit, offset } = paging(req.query)
  res.json(listRegistrations({ limit, offset }))
})

adminRouter.get('/registrations/export', (req, res) => {
  const { items } = listRegistrations({ limit: 5000, offset: 0 })
  const columns = ['reference', 'created_at', 'name', 'email', 'phone', 'city', 'activities', 'availability', 'drive_id', 'experience', 'message']
  const rows = [columns.join(',')]
  for (const item of items) {
    rows.push(
      columns
        .map((key) => csvEscape(Array.isArray(item[key]) ? item[key].join('; ') : item[key]))
        .join(','),
    )
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="rescue-beacon-volunteers-${new Date().toISOString().slice(0, 10)}.csv"`)
  res.send(rows.join('\n'))
})
