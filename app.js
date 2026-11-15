import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'
import { publicRouter } from './routes/public.js'
import { reportsRouter } from './routes/reports.js'
import { registrationsRouter } from './routes/registrations.js'
import { adminRouter } from './routes/admin.js'

export function createApp() {
  const app = express()

  const trustProxy = /^\d+$/.test(String(config.trustProxy)) ? Number(config.trustProxy) : config.trustProxy
  app.set('trust proxy', trustProxy)
  app.disable('x-powered-by')

  app.use(
    helmet({
      contentSecurityPolicy: config.isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
              fontSrc: ["'self'", 'https://fonts.gstatic.com'],
              imgSrc: ["'self'", 'data:', 'blob:'],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              upgradeInsecureRequests: null,
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  )

  app.use(
    cors({
      origin: config.isProd ? (config.corsOrigins.length ? config.corsOrigins : false) : true,
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
  )

  app.use(morgan(config.isProd ? 'combined' : 'dev', { skip: (req) => req.path === '/api/health' }))
  app.use(express.json({ limit: '64kb' }))
  app.use(express.urlencoded({ extended: false, limit: '64kb' }))

  app.use(
    '/uploads',
    express.static(config.uploadsDir, {
      maxAge: '30d',
      immutable: true,
      index: false,
      dotfiles: 'deny',
      fallthrough: false,
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Content-Disposition', 'inline')
      },
    }),
  )

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: config.globalRateLimit,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { error: 'Too many requests. Please slow down and try again shortly.' },
    }),
  )

  app.use('/api', publicRouter)
  app.use('/api/reports', reportsRouter)
  app.use('/api/registrations', registrationsRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }))

  if (config.isProd) {
    const dist = path.join(config.root, 'dist')
    if (fs.existsSync(dist)) {
      app.use(
        express.static(dist, {
          maxAge: '1h',
          index: false,
          setHeaders: (res, filePath) => {
            if (/\.(js|css|svg|woff2?|png|webp)$/.test(filePath)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            }
          },
        }),
      )
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next()
        return res.sendFile(path.join(dist, 'index.html'))
      })
    } else {
      console.warn('[startup] dist/ not found — run "npm run build" before starting in production.')
    }
  }

  app.use((req, res) => res.status(404).json({ error: 'Not found.' }))

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    let status = Number(error.status || error.statusCode) || 500
    if (error.name === 'MulterError') status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    if (error.type === 'entity.parse.failed') status = 400

    if (status >= 500) console.error('[error]', error)
    const message =
      status >= 500
        ? 'Something went wrong on our side. Please try again.'
        : error.code === 'LIMIT_FILE_SIZE'
          ? `Photo is too large. Maximum size is ${config.maxUploadMb} MB.`
          : error.message || 'Request failed.'

    res.status(status).json({ error: message })
  })

  return app
}
