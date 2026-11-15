const BASE = import.meta.env.VITE_API_BASE || '/api'

export class ApiError extends Error {
  constructor(message, status = 0, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function readError(response) {
  let payload = null
  try {
    payload = await response.json()
  } catch {
    /* non-JSON response */
  }
  return new ApiError(payload?.error || `Request failed (${response.status}).`, response.status, payload?.details || [])
}

async function get(path, { signal } = {}) {
  const response = await fetch(`${BASE}${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw await readError(response)
  return response.json()
}

async function post(path, body, { signal } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await readError(response)
  return response.json()
}

function buildQuery(params) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  }
  const string = query.toString()
  return string ? `?${string}` : ''
}

/** Multipart upload with progress, via XHR (fetch has no upload progress events). */
function upload(path, formData, { onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE}${path}`)
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      const payload = xhr.response
      if (xhr.status >= 200 && xhr.status < 300) return resolve(payload)
      return reject(new ApiError(payload?.error || `Upload failed (${xhr.status}).`, xhr.status, payload?.details || []))
    }
    xhr.onerror = () => reject(new ApiError('Network error — check your connection and try again.'))
    xhr.onabort = () => reject(new ApiError('Upload cancelled.'))
    if (signal) signal.addEventListener('abort', () => xhr.abort())
    xhr.send(formData)
  })
}

const adminHeaders = (token) => ({ Authorization: `Bearer ${token}`, Accept: 'application/json' })

async function adminGet(path, token) {
  const response = await fetch(`${BASE}${path}`, { headers: adminHeaders(token) })
  if (!response.ok) throw await readError(response)
  return response.json()
}

async function adminPatch(path, token, body) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { ...adminHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await readError(response)
  return response.json()
}

export const api = {
  health: () => get('/health'),
  meta: () => get('/meta'),
  orgs: (params, options) => get(`/orgs${buildQuery(params)}`, options),
  orgCities: () => get('/orgs/cities'),
  drives: () => get('/drives'),
  myths: () => get('/myths'),
  stories: () => get('/stories'),
  articles: () => get('/articles'),
  article: (slug) => get(`/articles/${slug}`),
  submitReport: (formData, { onProgress, signal } = {}) => upload('/reports', formData, { onProgress, signal }),
  submitRegistration: (body) => post('/registrations', body),

  admin: {
    login: (password) => post('/admin/login', { password }),
    stats: (token) => adminGet('/admin/stats', token),
    reports: (token, params) => adminGet(`/admin/reports${buildQuery(params)}`, token),
    report: (token, id) => adminGet(`/admin/reports/${id}`, token),
    updateStatus: (token, id, status) => adminPatch(`/admin/reports/${id}`, token, { status }),
    registrations: (token, params) => adminGet(`/admin/registrations${buildQuery(params)}`, token),
  },
}
