import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { config } from '../config.js'

const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
])

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploadsDir),
  filename: (req, file, cb) => {
    const ext = ALLOWED.get(file.mimetype) || ''
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`)
  },
})

const uploader = multer({
  storage,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1, fields: 20 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      const error = new Error('Only JPEG, PNG or WebP images can be uploaded.')
      error.status = 415
      return cb(error)
    }
    return cb(null, true)
  },
})

/** Verify the file's magic bytes so a renamed non-image cannot slip through. */
function verifySignature(req, res, next) {
  if (!req.file) return next()
  try {
    const fd = fs.openSync(req.file.path, 'r')
    const header = Buffer.alloc(12)
    fs.readSync(fd, header, 0, 12, 0)
    fs.closeSync(fd)
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
    const isPng = header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    const isWebp = header.subarray(0, 4).toString('ascii') === 'RIFF' && header.subarray(8, 12).toString('ascii') === 'WEBP'
    if (!isJpeg && !isPng && !isWebp) {
      fs.rmSync(req.file.path, { force: true })
      const error = new Error('The uploaded file is not a valid image.')
      error.status = 415
      return next(error)
    }
    return next()
  } catch (error) {
    fs.rmSync(req.file?.path || '', { force: true })
    return next(error)
  }
}

export const handlePhotoUpload = [uploader.single('photo'), verifySignature]
