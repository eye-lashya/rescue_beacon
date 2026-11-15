import crypto from 'node:crypto'
import { config } from '../config.js'

const b64url = (buf) => Buffer.from(buf).toString('base64url')

export function hashIp(ip) {
  return crypto.createHash('sha256').update(`${config.ipHashSalt}:${ip || 'unknown'}`).digest('hex').slice(0, 32)
}

/** Constant-time comparison for two strings of arbitrary length. */
export function safeEqual(a, b) {
  const ah = crypto.createHash('sha256').update(String(a)).digest()
  const bh = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ah, bh)
}

function sign(payload) {
  return crypto.createHmac('sha256', config.adminSecret).update(payload).digest('base64url')
}

/** Minimal signed, expiring admin token (no external JWT dependency). */
export function issueAdminToken() {
  const expiresAt = Date.now() + config.adminTokenTtlHours * 60 * 60 * 1000
  const payload = b64url(JSON.stringify({ sub: 'admin', exp: expiresAt }))
  return { token: `${payload}.${sign(payload)}`, expiresAt }
}

export function verifyAdminToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data || data.sub !== 'admin' || typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

/** Escapes a value for CSV export. */
export function csvEscape(value) {
  const s = value == null ? '' : String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
