import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { config } from './config.js'
import { ORGANIZATIONS } from '../src/data/organizations.js'

fs.mkdirSync(config.uploadsDir, { recursive: true })

export const db = new Database(config.dbPath)
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    animal_type TEXT NOT NULL,
    severity INTEGER NOT NULL,
    description TEXT NOT NULL,
    location_text TEXT NOT NULL,
    lat REAL,
    lng REAL,
    photo_path TEXT,
    photo_original_name TEXT,
    reporter_name TEXT,
    reporter_phone TEXT,
    reporter_email TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    ip_hash TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_reports_created ON reports (created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    activities TEXT NOT NULL,
    availability TEXT NOT NULL,
    experience TEXT,
    message TEXT,
    drive_id TEXT,
    consent INTEGER NOT NULL DEFAULT 1,
    ip_hash TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_registrations_created ON registrations (created_at DESC);

  CREATE TABLE IF NOT EXISTS orgs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    area TEXT,
    lat REAL,
    lng REAL,
    phone TEXT,
    email TEXT,
    website TEXT,
    services TEXT NOT NULL DEFAULT '[]',
    notes TEXT,
    verified INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_orgs_city ON orgs (city);
  CREATE INDEX IF NOT EXISTS idx_orgs_category ON orgs (category);
`)

// Keep the directory in sync with src/data/organizations.js on every boot.
const upsertOrg = db.prepare(`
  INSERT INTO orgs (id, name, category, city, state, area, lat, lng, phone, email, website, services, notes, verified)
  VALUES (@id, @name, @category, @city, @state, @area, @lat, @lng, @phone, @email, @website, @services, @notes, @verified)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    category = excluded.category,
    city = excluded.city,
    state = excluded.state,
    area = excluded.area,
    lat = excluded.lat,
    lng = excluded.lng,
    phone = excluded.phone,
    email = excluded.email,
    website = excluded.website,
    services = excluded.services,
    notes = excluded.notes,
    verified = excluded.verified
`)

db.transaction(() => {
  for (const org of ORGANIZATIONS) {
    upsertOrg.run({
      id: org.id,
      name: org.name,
      category: org.category,
      city: org.city,
      state: org.state,
      area: org.area || null,
      lat: org.lat ?? null,
      lng: org.lng ?? null,
      phone: org.phone || null,
      email: org.email || null,
      website: org.website || null,
      services: JSON.stringify(org.services || []),
      notes: org.notes || null,
      verified: org.verified ? 1 : 0,
    })
  }
})()

const makeReference = (prefix) =>
  `${prefix}-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

const insertReportStatement = db.prepare(`
  INSERT INTO reports
    (reference, category, animal_type, severity, description, location_text, lat, lng,
     photo_path, photo_original_name, reporter_name, reporter_phone, reporter_email, ip_hash, created_at, updated_at)
  VALUES
    (@reference, @category, @animalType, @severity, @description, @locationText, @lat, @lng,
     @photoPath, @photoOriginalName, @name, @phone, @email, @ipHash, @createdAt, @createdAt)
`)

export function createReport(input) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = makeReference('RB')
    try {
      const info = insertReportStatement.run({ ...input, reference, createdAt: new Date().toISOString() })
      return { id: Number(info.lastInsertRowid), reference }
    } catch (error) {
      if (error.code !== 'SQLITE_CONSTRAINT_UNIQUE') throw error
    }
  }
  throw new Error('Could not allocate a report reference.')
}

const serializeReport = (row) => {
  if (!row) return null
  const { photo_path: photoPath, ip_hash: _ipHash, ...rest } = row
  return { ...rest, photoUrl: photoPath ? `/uploads/${path.basename(photoPath)}` : null }
}

const parseOrg = (row) => (row ? { ...row, services: JSON.parse(row.services || '[]'), verified: Boolean(row.verified) } : null)
const parseRegistration = (row) =>
  row ? { ...row, activities: JSON.parse(row.activities || '[]'), availability: JSON.parse(row.availability || '[]'), consent: Boolean(row.consent) } : null

export function listReports({ status, limit = 50, offset = 0 } = {}) {
  const where = status ? 'WHERE status = ?' : ''
  const params = status ? [status] : []
  const items = db
    .prepare(`SELECT * FROM reports ${where} ORDER BY datetime(created_at) DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset)
    .map(serializeReport)
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM reports ${where}`).get(...params)
  return { items, total }
}

export function getReport(id) {
  return serializeReport(db.prepare('SELECT * FROM reports WHERE id = ?').get(id) || null)
}

const ALLOWED_STATUSES = new Set(['new', 'in_review', 'resolved', 'closed'])

export function updateReportStatus(id, status) {
  if (!ALLOWED_STATUSES.has(status)) return null
  const result = db
    .prepare('UPDATE reports SET status = ?, updated_at = ? WHERE id = ?')
    .run(status, new Date().toISOString(), id)
  return result.changes ? getReport(id) : null
}

export function reportCounts() {
  const rows = db.prepare('SELECT status, COUNT(*) AS count FROM reports GROUP BY status').all()
  const counts = { new: 0, in_review: 0, resolved: 0, closed: 0 }
  for (const row of rows) counts[row.status] = row.count
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0)
  const { recent } = db
    .prepare("SELECT COUNT(*) AS recent FROM reports WHERE datetime(created_at) >= datetime('now', '-7 days')")
    .get()
  counts.last7Days = recent
  return counts
}

const insertRegistrationStatement = db.prepare(`
  INSERT INTO registrations
    (reference, name, email, phone, city, activities, availability, experience, message, drive_id, consent, ip_hash, created_at)
  VALUES
    (@reference, @name, @email, @phone, @city, @activities, @availability, @experience, @message, @driveId, 1, @ipHash, @createdAt)
`)

export function createRegistration(input) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = makeReference('VB')
    try {
      const info = insertRegistrationStatement.run({
        ...input,
        reference,
        activities: JSON.stringify(input.activities),
        availability: JSON.stringify(input.availability),
        createdAt: new Date().toISOString(),
      })
      return { id: Number(info.lastInsertRowid), reference }
    } catch (error) {
      if (error.code !== 'SQLITE_CONSTRAINT_UNIQUE') throw error
    }
  }
  throw new Error('Could not allocate a registration reference.')
}

export function listRegistrations({ limit = 50, offset = 0 } = {}) {
  const items = db
    .prepare('SELECT * FROM registrations ORDER BY datetime(created_at) DESC, id DESC LIMIT ? OFFSET ?')
    .all(limit, offset)
    .map(parseRegistration)
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM registrations').get()
  return { items, total }
}

export function listOrganizations({ category, city, state, q } = {}) {
  const clauses = []
  const params = []
  if (category) {
    clauses.push('category = ?')
    params.push(category)
  }
  if (city) {
    clauses.push('city = ?')
    params.push(city)
  }
  if (state) {
    clauses.push('state = ?')
    params.push(state)
  }
  if (q) {
    clauses.push('(name LIKE ? OR city LIKE ? OR area LIKE ? OR services LIKE ?)')
    const like = `%${q}%`
    params.push(like, like, like, like)
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  return db
    .prepare(`SELECT * FROM orgs ${where} ORDER BY name COLLATE NOCASE ASC`)
    .all(...params)
    .map(parseOrg)
}

export function organizationCities() {
  return db.prepare('SELECT DISTINCT city FROM orgs ORDER BY city COLLATE NOCASE ASC').all().map((r) => r.city)
}

export function organizationStates() {
  return db.prepare('SELECT DISTINCT state FROM orgs ORDER BY state COLLATE NOCASE ASC').all().map((r) => r.state)
}

export function adminStats() {
  const reports = reportCounts()
  const { total: registrations } = db.prepare('SELECT COUNT(*) AS total FROM registrations').get()
  const { total: organizations } = db.prepare('SELECT COUNT(*) AS total FROM orgs').get()
  return { reports, registrations, organizations }
}

export function closeDb() {
  try {
    db.close()
  } catch {
    /* already closed */
  }
}
