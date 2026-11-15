import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '..')

const num = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const list = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
const dataDir = path.resolve(ROOT, process.env.DATA_DIR || 'server/data')

const adminPassword = process.env.ADMIN_PASSWORD || (isProd ? '' : 'rescue-beacon-dev')
const adminSecret = process.env.ADMIN_SECRET || ''
const ipHashSalt = process.env.IP_HASH_SALT || ''

if (isProd) {
  if (!adminPassword || adminPassword === 'rescue-beacon-dev' || adminPassword.includes('change-me')) {
    throw new Error('ADMIN_PASSWORD must be set to a strong, non-placeholder value in production.')
  }
  if (adminSecret.length < 32 || adminSecret.includes('change-me')) {
    throw new Error('ADMIN_SECRET must be at least 32 random characters (not the .env.example placeholder).')
  }
  if (ipHashSalt.length < 16 || ipHashSalt.includes('change-me')) {
    throw new Error('IP_HASH_SALT must be a unique random string of 16+ characters in production.')
  }
}

export const config = {
  env,
  isProd,
  root: ROOT,
  port: num(process.env.PORT, 4100),
  host: process.env.HOST || '0.0.0.0',
  trustProxy: process.env.TRUST_PROXY ?? 'loopback',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || '',

  dataDir,
  uploadsDir: path.join(dataDir, 'uploads'),
  dbPath: path.join(dataDir, 'rescue-beacon.db'),

  adminPassword,
  adminSecret: adminSecret || 'insecure-development-secret-change-me-now-0000',
  adminTokenTtlHours: num(process.env.ADMIN_TOKEN_TTL_HOURS, 12),
  maxUploadMb: num(process.env.MAX_UPLOAD_MB, 8),

  corsOrigins: list(process.env.CORS_ORIGINS),
  globalRateLimit: num(process.env.GLOBAL_RATE_LIMIT, 400),
  reportRateLimit: num(process.env.REPORT_RATE_LIMIT, 10),
  registrationRateLimit: num(process.env.REGISTRATION_RATE_LIMIT, 20),

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: num(process.env.SMTP_PORT, 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Rescue Beacon <no-reply@rescuebeacon.local>',
    notifyTo: process.env.NOTIFY_EMAIL || '',
  },

  ipHashSalt: ipHashSalt || 'rescue-beacon-ip-salt',
}
