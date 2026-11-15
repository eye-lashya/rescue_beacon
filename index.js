import { createApp } from './app.js'
import { config } from './config.js'
import { closeDb } from './db.js'

const app = createApp()
const server = app.listen(config.port, config.host, () => {
  console.log(`\n  Rescue Beacon API`)
  console.log(`  ─────────────────────────────────────────`)
  console.log(`  Environment : ${config.env}`)
  console.log(`  Listening   : http://${config.host}:${config.port}`)
  console.log(`  Database    : ${config.dbPath}`)
  console.log(`  Uploads     : ${config.uploadsDir}`)
  console.log(`  Email alerts: ${config.smtp.host && config.smtp.notifyTo ? 'enabled' : 'disabled'}`)
  console.log(`  ─────────────────────────────────────────\n`)
})

let shuttingDown = false
const shutdown = (signal) => {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`\n[shutdown] ${signal} received — closing server…`)
  const timer = setTimeout(() => {
    console.error('[shutdown] Forcing exit after timeout.')
    process.exit(1)
  }, 10_000)
  timer.unref()
  server.close(() => {
    closeDb()
    clearTimeout(timer)
    console.log('[shutdown] Closed cleanly.')
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason))
