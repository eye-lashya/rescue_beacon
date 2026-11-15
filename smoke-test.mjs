#!/usr/bin/env node
/**
 * End-to-end smoke test for the Rescue Beacon API.
 *
 * Starts an isolated server on a free port with a throwaway SQLite database,
 * exercises the public + admin flows, then shuts everything down. It never
 * touches server/data, so it is safe to run against a development machine.
 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import net from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ADMIN_PASSWORD = 'smoke-test-password'
const ADMIN_SECRET = 'smoke-test-secret-with-at-least-32-characters'
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const freePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })

const dataDir = await mkdtemp(join(tmpdir(), 'rescue-beacon-smoke-'))
const port = await freePort()
const base = `http://127.0.0.1:${port}`

const logs = []
const server = spawn(process.execPath, ['server/index.js'], {
  cwd: ROOT,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(port),
    DATA_DIR: dataDir,
    ADMIN_PASSWORD,
    ADMIN_SECRET,
    IP_HASH_SALT: 'smoke-test-salt',
    GLOBAL_RATE_LIMIT: '1000',
    SMTP_HOST: '',
    NOTIFY_EMAIL: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})
server.stdout.on('data', (chunk) => logs.push(String(chunk)))
server.stderr.on('data', (chunk) => logs.push(String(chunk)))

async function request(path, { token, ...options } = {}) {
  const headers = { Accept: 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${base}${path}`, { ...options, headers })
  const text = await response.text()
  let body = text
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    /* CSV or other non-JSON response */
  }
  return { status: response.status, body, headers: response.headers, text }
}

function check(label) {
  console.log(`  ✓ ${label}`)
}

let exitCode = 0
try {
  // Wait for the server to accept connections.
  let ready = false
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (server.exitCode != null) break
    try {
      const health = await request('/api/health')
      if (health.status === 200 && health.body?.ok) {
        ready = true
        break
      }
    } catch {
      /* not listening yet */
    }
    await sleep(100)
  }
  assert.ok(ready, `Server did not become ready.\n${logs.join('')}`)
  check('GET /api/health')

  const meta = await request('/api/meta')
  assert.equal(meta.status, 200)
  assert.ok(meta.body.orgs >= 30, 'expected seeded organisations')
  assert.ok(meta.body.articles >= 6)
  check(`GET /api/meta (${meta.body.orgs} orgs, ${meta.body.articles} articles)`)

  const orgs = await request('/api/orgs?lat=12.9716&lng=77.5946')
  assert.equal(orgs.status, 200)
  assert.ok(orgs.body.items.length > 0)
  assert.ok(orgs.body.items[0].distanceKm >= 0)
  for (let i = 1; i < orgs.body.items.length; i += 1) {
    assert.ok(orgs.body.items[i - 1].distanceKm <= orgs.body.items[i].distanceKm, 'orgs must be distance-sorted')
  }
  check('GET /api/orgs sorts by distance')

  const articles = await request('/api/articles')
  assert.equal(articles.status, 200)
  const article = await request(`/api/articles/${articles.body.items[0].slug}`)
  assert.equal(article.status, 200)
  assert.ok(Array.isArray(article.body.blocks) && article.body.blocks.length > 0)
  check('GET /api/articles and article detail')

  const emergency = await request('/api/emergency')
  assert.equal(emergency.status, 200)
  assert.ok(emergency.body.numbers.some((number) => number.number === '112'))
  check('GET /api/emergency exposes 112')

  const invalid = await request('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'nonsense' }),
  })
  assert.equal(invalid.status, 422)
  check('POST /api/reports rejects invalid payloads')

  const form = new FormData()
  form.set('category', 'injury')
  form.set('animalType', 'dog')
  form.set('severity', '2')
  form.set('description', 'Smoke test: a limping dog near the market needs a welfare check.')
  form.set('locationText', 'Smoke Test Junction, Bengaluru')
  form.set('latitude', '12.9716')
  form.set('longitude', '77.5946')
  form.set('name', 'Smoke Tester')
  form.set('phone', '+919876543210')
  form.set('email', 'smoke@example.com')
  form.set('photo', new Blob([PNG], { type: 'image/png' }), 'pixel.png')

  const created = await request('/api/reports', { method: 'POST', body: form })
  assert.equal(created.status, 201, JSON.stringify(created.body))
  assert.match(created.body.reference, /^RB-\d{4}-[A-F0-9]{6}$/)
  assert.match(created.body.photoUrl, /^\/uploads\/.+\.png$/)
  check(`POST /api/reports created ${created.body.reference}`)

  const photo = await fetch(`${base}${created.body.photoUrl}`)
  assert.equal(photo.status, 200)
  assert.ok((photo.headers.get('content-type') || '').startsWith('image/png'))
  check('Uploaded photo is served from /uploads')

  const wrongLogin = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'not-the-password' }),
  })
  assert.equal(wrongLogin.status, 401)

  const login = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  })
  assert.equal(login.status, 200)
  assert.ok(login.body.token)
  const token = login.body.token
  check('Admin login rejects bad passwords and issues a token')

  const unauthorised = await request('/api/admin/stats')
  assert.equal(unauthorised.status, 401)
  check('Admin routes require a bearer token')

  const stats = await request('/api/admin/stats', { token })
  assert.equal(stats.status, 200)
  assert.ok(stats.body.reports.total >= 1)
  assert.ok(stats.body.registrations >= 0)
  assert.ok(stats.body.organizations >= 30)
  check('GET /api/admin/stats')

  const list = await request('/api/admin/reports?status=new', { token })
  assert.equal(list.status, 200)
  const report = list.body.items.find((item) => item.reference === created.body.reference)
  assert.ok(report, 'new report should be listed')
  assert.equal(report.photoUrl, created.body.photoUrl)
  assert.ok(!('photo_path' in report), 'absolute photo paths must never leak')
  assert.ok(!('ip_hash' in report), 'reporter IP hashes must never leak')
  check('Admin report list is sanitised')

  const patched = await request(`/api/admin/reports/${report.id}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'resolved' }),
  })
  assert.equal(patched.status, 200)
  assert.equal(patched.body.status, 'resolved')
  check('PATCH /api/admin/reports/:id updates status')

  const reportCsv = await request('/api/admin/reports/export', { token })
  assert.equal(reportCsv.status, 200)
  assert.ok((reportCsv.headers.get('content-type') || '').includes('text/csv'))
  assert.ok(reportCsv.text.includes('reference,created_at,status'))
  assert.ok(reportCsv.text.includes(created.body.reference))
  check('CSV export includes the new report')

  const registration = await request('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoke Tester',
      email: 'smoke@example.com',
      phone: '+919876543210',
      city: 'Bengaluru',
      activities: ['feeding', 'transport'],
      availability: ['Saturday'],
      experience: 'None yet',
      message: 'Automated smoke test registration.',
      driveId: 'drive-blr-nov7',
      consent: true,
    }),
  })
  assert.equal(registration.status, 201, JSON.stringify(registration.body))
  assert.match(registration.body.reference, /^VB-\d{4}-[A-F0-9]{6}$/)
  check(`POST /api/registrations created ${registration.body.reference}`)

  const noConsent = await request('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoke Tester',
      email: 'smoke@example.com',
      phone: '+919876543210',
      city: 'Bengaluru',
      activities: ['feeding'],
      availability: ['Saturday'],
      consent: false,
    }),
  })
  assert.equal(noConsent.status, 422)
  check('Registrations require consent')

  const volunteers = await request('/api/admin/registrations', { token })
  assert.equal(volunteers.status, 200)
  assert.ok(volunteers.body.items.some((item) => item.reference === registration.body.reference))
  check('Admin registration list')

  const volunteerCsv = await request('/api/admin/registrations/export', { token })
  assert.equal(volunteerCsv.status, 200)
  assert.ok(volunteerCsv.text.includes(registration.body.reference))
  check('CSV export includes the new registration')

  const missing = await request('/api/does-not-exist')
  assert.equal(missing.status, 404)
  check('Unknown API routes return 404')

  console.log('\nAll smoke tests passed.\n')
} catch (error) {
  exitCode = 1
  console.error('\nSmoke test failed:', error.message)
  if (logs.length) console.error('\nServer log:\n' + logs.join('').slice(-4000))
} finally {
  if (server.exitCode == null) {
    server.kill('SIGTERM')
    await Promise.race([once(server, 'exit'), sleep(4000)])
    if (server.exitCode == null) server.kill('SIGKILL')
  }
  await rm(dataDir, { recursive: true, force: true })
}

process.exit(exitCode)
