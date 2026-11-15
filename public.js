import { Router } from 'express'
import { ARTICLES, getArticle } from '../../src/data/articles.js'
import { MISCONCEPTIONS } from '../../src/data/misconceptions.js'
import { TRANSFORMATIONS } from '../../src/data/transformations.js'
import { DRIVES, DRIVE_TYPES } from '../../src/data/drives.js'
import { EMERGENCY_NUMBERS, EMERGENCY_STEPS, EMERGENCY_DONT } from '../../src/data/emergency.js'
import { listOrganizations, organizationCities, organizationStates } from '../db.js'
import { haversineKm, parseCoords, formatDistance } from '../utils/geo.js'

export const publicRouter = Router()

const cache = (res, seconds = 300) => res.set('Cache-Control', `public, max-age=${seconds}`)

publicRouter.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', uptimeSeconds: Math.round(process.uptime()), time: new Date().toISOString() })
})

publicRouter.get('/orgs', (req, res) => {
  const { category, city, state, q } = req.query
  const origin = parseCoords(req.query.lat, req.query.lng)
  const items = listOrganizations({
    category: typeof category === 'string' ? category : undefined,
    city: typeof city === 'string' ? city : undefined,
    state: typeof state === 'string' ? state : undefined,
    q: typeof q === 'string' ? q.slice(0, 80) : undefined,
  }).map((org) => {
    const distanceKm = origin && org.lat != null && org.lng != null ? haversineKm(origin, org) : null
    return { ...org, distanceKm, distance: formatDistance(distanceKm) }
  })

  if (origin) items.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))

  cache(res, 300)
  res.json({ items, total: items.length, origin })
})

publicRouter.get('/orgs/cities', (req, res) => {
  cache(res, 3600)
  res.json({ items: organizationCities() })
})

publicRouter.get('/orgs/states', (req, res) => {
  cache(res, 3600)
  res.json({ items: organizationStates() })
})

publicRouter.get('/articles', (req, res) => {
  cache(res)
  res.json({
    items: ARTICLES.map(({ blocks, ...rest }) => ({ ...rest, blockCount: blocks.length })),
    total: ARTICLES.length,
  })
})

publicRouter.get('/articles/:slug', (req, res) => {
  const article = getArticle(req.params.slug)
  if (!article) return res.status(404).json({ error: 'Article not found.' })
  cache(res)
  return res.json(article)
})

publicRouter.get('/myths', (req, res) => {
  cache(res)
  res.json({ items: MISCONCEPTIONS, total: MISCONCEPTIONS.length })
})

publicRouter.get('/stories', (req, res) => {
  cache(res)
  res.json({ items: TRANSFORMATIONS, total: TRANSFORMATIONS.length })
})

publicRouter.get('/drives', (req, res) => {
  cache(res, 60)
  const items = DRIVES.map((drive) => ({
    ...drive,
    typeLabel: DRIVE_TYPES.find((t) => t.id === drive.type)?.label || drive.type,
    spotsLeft: Math.max(0, drive.spots - drive.filled),
    full: drive.filled >= drive.spots,
  }))
  res.json({ items, total: items.length })
})

publicRouter.get('/emergency', (req, res) => {
  cache(res, 3600)
  res.json({ numbers: EMERGENCY_NUMBERS, steps: EMERGENCY_STEPS, donts: EMERGENCY_DONT })
})

publicRouter.get('/meta', (req, res) => {
  cache(res, 300)
  res.json({
    orgs: listOrganizations().length,
    cities: organizationCities().length,
    articles: ARTICLES.length,
    myths: MISCONCEPTIONS.length,
    stories: TRANSFORMATIONS.length,
    drives: DRIVES.length,
  })
})
