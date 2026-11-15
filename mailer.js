import nodemailer from 'nodemailer'
import path from 'node:path'
import { config } from '../config.js'

let transporter = null
if (config.smtp.host) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  })
}

export const mailerConfigured = Boolean(transporter && config.smtp.notifyTo)

const severityLabel = { 1: 'Low', 2: 'Urgent', 3: 'Critical' }

export async function notifyNewReport(report) {
  if (!mailerConfigured) return
  const lines = [
    `Reference: ${report.reference}`,
    `Category: ${report.category}`,
    `Animal: ${report.animal_type}`,
    `Severity: ${severityLabel[report.severity] || report.severity}`,
    `Location: ${report.location_text}`,
    report.lat != null && report.lng != null ? `Coordinates: ${report.lat}, ${report.lng}` : null,
    report.reporter_name ? `Reporter: ${report.reporter_name}` : null,
    report.reporter_phone ? `Phone: ${report.reporter_phone}` : null,
    report.reporter_email ? `Email: ${report.reporter_email}` : null,
    '',
    report.description,
  ].filter(Boolean)

  const attachments = []
  if (report.photoUrl) {
    attachments.push({
      filename: report.photo_original_name || path.basename(report.photoUrl),
      path: path.join(config.uploadsDir, path.basename(report.photoUrl)),
    })
  }

  await transporter.sendMail({
    from: config.smtp.from,
    to: config.smtp.notifyTo,
    subject: `[Rescue Beacon] ${severityLabel[report.severity] || ''} ${report.category} report — ${report.reference}`,
    text: lines.join('\n'),
    attachments,
  })
}

export async function notifyNewRegistration(registration) {
  if (!mailerConfigured) return
  const lines = [
    `Reference: ${registration.reference}`,
    `Name: ${registration.name}`,
    `Email: ${registration.email}`,
    `Phone: ${registration.phone}`,
    `City: ${registration.city}`,
    `Activities: ${registration.activities.join(', ')}`,
    `Availability: ${registration.availability.join(', ')}`,
    registration.drive_id ? `Drive: ${registration.drive_id}` : null,
    registration.experience ? `Experience: ${registration.experience}` : null,
    registration.message ? `Message: ${registration.message}` : null,
  ].filter(Boolean)

  await transporter.sendMail({
    from: config.smtp.from,
    to: config.smtp.notifyTo,
    subject: `[Rescue Beacon] Volunteer registration — ${registration.reference}`,
    text: lines.join('\n'),
  })
}
