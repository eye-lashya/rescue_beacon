import { useCallback, useEffect, useState } from 'react'
import { Link } from '../components/TransitionLink'
import { Icon } from '../components/Icon'
import { ErrorNotice, EmptyState, Spinner } from '../components/Feedback'
import { api, ApiError } from '../lib/api'
import {
  REPORT_CATEGORY_LABELS,
  ANIMAL_LABELS,
  SEVERITY,
  STATUS_LABELS,
  formatDateTime,
} from '../lib/format'
import { VOLUNTEER_ROLES, DRIVES } from '../data/drives'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const TOKEN_KEY = 'rescue-beacon-admin-token'
const STATUSES = ['new', 'in_review', 'resolved', 'closed']
const PAGE_SIZE = 25

const ROLE_LABELS = Object.fromEntries(VOLUNTEER_ROLES.map((role) => [role.id, role.label]))
const DRIVE_TITLES = Object.fromEntries(DRIVES.map((drive) => [drive.id, drive.title]))

function AdminTopbar({ signedIn, onSignOut }) {
  return (
    <header className="admin-topbar">
      <div className="container admin-topbar-inner">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">
            <img src="/logo-mark.png" alt="" width="32" height="32" decoding="async" />
          </span>
          Rescue Beacon <span className="admin-brand-tag">Coordinator</span>
        </Link>
        <div className="admin-topbar-actions">
          <Link to="/" className="btn btn-ghost btn-sm">
            <Icon name="external" size={15} /> View site
          </Link>
          {signedIn ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onSignOut}>
              <Icon name="logout" size={15} /> Sign out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

function LoginScreen({ onSignIn, password, setPassword, signingIn, error }) {
  return (
    <div className="admin-login-wrap">
      <form className="admin-login card" onSubmit={onSignIn}>
        <span className="admin-login-icon">
          <Icon name="lock" size={26} />
        </span>
        <p className="eyebrow">Restricted</p>
        <h1>Coordinator sign-in</h1>
        <p className="muted">
          Review incoming cruelty reports, update case status and export volunteer registrations.
        </p>

        <label className="field">
          <span>Admin password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>

        {error ? (
          <p className="field-error" role="alert">
            <Icon name="alert" size={14} /> {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary btn-block" disabled={signingIn}>
          {signingIn ? (
            <>
              <span className="spinner spinner-tiny" /> Signing in…
            </>
          ) : (
            <>
              <Icon name="lock" size={16} /> Sign in
            </>
          )}
        </button>

        <p className="admin-login-hint">
          Credentials are configured with <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> on the server.
        </p>
      </form>
    </div>
  )
}

function StatCard({ label, value, hint, tone = '' }) {
  return (
    <div className={`stat-card card ${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint ? <span className="stat-hint">{hint}</span> : null}
    </div>
  )
}

function ReportCase({ report, onStatusChange, busy }) {
  const severity = SEVERITY[report.severity] || SEVERITY[2]
  const contact = [report.reporter_name, report.reporter_phone, report.reporter_email].filter(Boolean)

  return (
    <article className={`case-card card sev-border-${report.severity}`}>
      <div className="case-head">
        <div className="case-ref">
          <span className={`severity-dot severity-${report.severity}`} aria-hidden="true" />
          <strong>{report.reference}</strong>
          <span className="muted">{formatDateTime(report.created_at)}</span>
        </div>
        <label className="case-status">
          <span className="visually-hidden">Update status for {report.reference}</span>
          <select
            value={report.status}
            disabled={busy}
            onChange={(event) => onStatusChange(report, event.target.value)}
          >
            {STATUSES.map((status) => (
              <option value={status} key={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="case-grid">
        <div>
          <div className="case-tags">
            <span className="badge badge-soft">{REPORT_CATEGORY_LABELS[report.category] || report.category}</span>
            <span className="badge badge-soft">{ANIMAL_LABELS[report.animal_type] || report.animal_type}</span>
            <span className={`badge badge-sev-${report.severity}`}>{severity.label}</span>
          </div>

          <h3 className="case-location">
            <Icon name="pin" size={16} /> {report.location_text}
          </h3>

          {report.lat != null && report.lng != null ? (
            <a
              className="text-link case-coords"
              href={`https://www.google.com/maps/search/?api=1&query=${report.lat},${report.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              {report.lat.toFixed(5)}, {report.lng.toFixed(5)} — open in Maps <Icon name="external" size={13} />
            </a>
          ) : null}

          <p className="case-description">{report.description}</p>

          <div className="case-contact">
            {contact.length ? (
              <>
                {report.reporter_name ? (
                  <span>
                    <Icon name="users" size={14} /> {report.reporter_name}
                  </span>
                ) : null}
                {report.reporter_phone ? (
                  <a href={`tel:${report.reporter_phone.replace(/[^+\d]/g, '')}`}>
                    <Icon name="phone" size={14} /> {report.reporter_phone}
                  </a>
                ) : null}
                {report.reporter_email ? (
                  <a href={`mailto:${report.reporter_email}`}>
                    <Icon name="mail" size={14} /> {report.reporter_email}
                  </a>
                ) : null}
              </>
            ) : (
              <span className="muted">
                <Icon name="eye" size={14} /> Anonymous report
              </span>
            )}
          </div>
        </div>

        <div className="case-photo">
          {report.photoUrl ? (
            <a href={report.photoUrl} target="_blank" rel="noreferrer" title="Open full photo">
              <img src={report.photoUrl} alt={`Photo attached to ${report.reference}`} loading="lazy" />
            </a>
          ) : (
            <span className="case-photo-empty">
              <Icon name="camera" size={22} /> No photo
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function RegistrationCase({ registration }) {
  return (
    <article className="case-card card">
      <div className="case-head">
        <div className="case-ref">
          <strong>{registration.reference}</strong>
          <span className="muted">{formatDateTime(registration.created_at)}</span>
        </div>
        <span className="badge badge-soft">
          <Icon name="users" size={13} /> Volunteer
        </span>
      </div>

      <h3 className="case-location">
        {registration.name} <span className="muted">· {registration.city}</span>
      </h3>

      <div className="case-contact">
        <a href={`tel:${registration.phone.replace(/[^+\d]/g, '')}`}>
          <Icon name="phone" size={14} /> {registration.phone}
        </a>
        <a href={`mailto:${registration.email}`}>
          <Icon name="mail" size={14} /> {registration.email}
        </a>
        {registration.drive_id ? (
          <span>
            <Icon name="calendar" size={14} /> {DRIVE_TITLES[registration.drive_id] || registration.drive_id}
          </span>
        ) : (
          <span className="muted">
            <Icon name="calendar" size={14} /> General volunteer
          </span>
        )}
      </div>

      <div className="tag-row">
        {registration.activities.map((activity) => (
          <span className="tag" key={activity}>
            {ROLE_LABELS[activity] || activity}
          </span>
        ))}
        {registration.availability.map((slot) => (
          <span className="tag tag-outline" key={slot}>
            {slot}
          </span>
        ))}
      </div>

      {registration.experience ? (
        <p className="case-description">
          <strong>Experience:</strong> {registration.experience}
        </p>
      ) : null}
      {registration.message ? (
        <p className="case-description">
          <strong>Message:</strong> {registration.message}
        </p>
      ) : null}
    </article>
  )
}

export default function Admin() {
  useDocumentTitle('Coordinator dashboard')

  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [password, setPassword] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [tab, setTab] = useState('reports')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [reportTotal, setReportTotal] = useState(0)
  const [registrations, setRegistrations] = useState([])
  const [registrationTotal, setRegistrationTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [exporting, setExporting] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const signOut = useCallback((message = '') => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setStats(null)
    setReports([])
    setRegistrations([])
    setReportTotal(0)
    setRegistrationTotal(0)
    setError(null)
    if (message) setLoginError(message)
  }, [])

  const handleError = useCallback(
    (requestError) => {
      if (requestError instanceof ApiError && requestError.status === 401) {
        signOut('Your session has expired. Please sign in again.')
        return
      }
      setError(requestError)
    },
    [signOut],
  )

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    setLoading(true)
    setError(null)

    const listRequest =
      tab === 'reports'
        ? api.admin.reports(token, {
            limit: PAGE_SIZE,
            offset: 0,
            status: statusFilter === 'all' ? undefined : statusFilter,
          })
        : api.admin.registrations(token, { limit: PAGE_SIZE, offset: 0 })

    Promise.all([api.admin.stats(token), listRequest])
      .then(([statsData, list]) => {
        if (cancelled) return
        setStats(statsData)
        if (tab === 'reports') {
          setReports(list.items)
          setReportTotal(list.total)
        } else {
          setRegistrations(list.items)
          setRegistrationTotal(list.total)
        }
      })
      .catch((requestError) => {
        if (!cancelled) handleError(requestError)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, tab, statusFilter, refreshKey, handleError])

  const signIn = async (event) => {
    event.preventDefault()
    setSigningIn(true)
    setLoginError('')
    try {
      const data = await api.admin.login(password)
      sessionStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setPassword('')
    } catch (requestError) {
      setLoginError(requestError.message || 'Sign in failed.')
    } finally {
      setSigningIn(false)
    }
  }

  const changeStatus = async (report, status) => {
    setBusyId(report.id)
    setError(null)
    try {
      const updated = await api.admin.updateStatus(token, report.id, status)
      setReports((current) =>
        statusFilter !== 'all' && status !== statusFilter
          ? current.filter((item) => item.id !== report.id)
          : current.map((item) => (item.id === report.id ? updated : item)),
      )
      if (statusFilter !== 'all' && status !== statusFilter) setReportTotal((total) => Math.max(0, total - 1))
      api.admin.stats(token).then(setStats).catch(() => {})
    } catch (requestError) {
      handleError(requestError)
    } finally {
      setBusyId(null)
    }
  }

  const loadMore = async () => {
    setLoadingMore(true)
    setError(null)
    try {
      if (tab === 'reports') {
        const list = await api.admin.reports(token, {
          limit: PAGE_SIZE,
          offset: reports.length,
          status: statusFilter === 'all' ? undefined : statusFilter,
        })
        setReports((current) => [...current, ...list.items])
        setReportTotal(list.total)
      } else {
        const list = await api.admin.registrations(token, { limit: PAGE_SIZE, offset: registrations.length })
        setRegistrations((current) => [...current, ...list.items])
        setRegistrationTotal(list.total)
      }
    } catch (requestError) {
      handleError(requestError)
    } finally {
      setLoadingMore(false)
    }
  }

  const exportCsv = async (kind) => {
    setExporting(kind)
    setError(null)
    try {
      const response = await fetch(`/api/admin/${kind}/export`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 401) {
        signOut('Your session has expired. Please sign in again.')
        return
      }
      if (!response.ok) throw new Error('Export failed. Please try again.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rescue-beacon-${kind}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setExporting('')
    }
  }

  if (!token) {
    return (
      <div className="admin-shell">
        <AdminTopbar signedIn={false} onSignOut={() => signOut()} />
        <LoginScreen
          onSignIn={signIn}
          password={password}
          setPassword={setPassword}
          signingIn={signingIn}
          error={loginError}
        />
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <AdminTopbar signedIn onSignOut={() => signOut()} />

      <main className="container admin-main">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Coordinator dashboard</p>
            <h1>Case dashboard</h1>
            <p className="muted">
              Signed in as coordinator. Reports are shown newest first — update status as cases move forward.
            </p>
          </div>
          <div className="admin-heading-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
            >
              <Icon name="refresh" size={15} /> Refresh
            </button>
            <button
              type="button"
              className="btn btn-soft btn-sm"
              onClick={() => exportCsv('reports')}
              disabled={exporting === 'reports'}
            >
              <Icon name="download" size={15} /> {exporting === 'reports' ? 'Exporting…' : 'Export reports'}
            </button>
          </div>
        </div>

        {stats ? (
          <div className="stat-grid">
            <StatCard label="New reports" value={stats.reports.new} hint="Awaiting triage" tone="is-accent" />
            <StatCard label="In review" value={stats.reports.in_review} hint="Being handled" />
            <StatCard label="Resolved" value={stats.reports.resolved} hint="Closed successfully" tone="is-success" />
            <StatCard label="Last 7 days" value={stats.reports.last7Days} hint="New reports" />
            <StatCard label="Volunteers" value={stats.registrations} hint="Total registrations" />
            <StatCard label="Directory" value={stats.organizations} hint="Listed places" />
          </div>
        ) : null}

        <div className="admin-tabs" role="tablist" aria-label="Dashboard sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'reports'}
            className={`admin-tab ${tab === 'reports' ? 'is-active' : ''}`}
            onClick={() => setTab('reports')}
          >
            <Icon name="file" size={16} /> Reports
            <span className="admin-tab-count">{stats?.reports.total ?? reportTotal}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'registrations'}
            className={`admin-tab ${tab === 'registrations' ? 'is-active' : ''}`}
            onClick={() => setTab('registrations')}
          >
            <Icon name="users" size={16} /> Volunteers
            <span className="admin-tab-count">{stats?.registrations ?? registrationTotal}</span>
          </button>
        </div>

        {error ? <ErrorNotice error={error} title="Dashboard request failed" /> : null}

        {tab === 'reports' ? (
          <>
            <div className="chip-row chip-row-tight admin-filters" role="group" aria-label="Filter reports by status">
              <button
                type="button"
                className={`chip ${statusFilter === 'all' ? 'is-active' : ''}`}
                aria-pressed={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              {STATUSES.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={`chip ${statusFilter === status ? 'is-active' : ''}`}
                  aria-pressed={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="admin-loading">
                <Spinner label="Loading reports" />
                <p className="muted">Loading reports…</p>
              </div>
            ) : null}

            {!loading && reports.length === 0 ? (
              <EmptyState icon="file" title="No reports in this view">
                New reports will appear here as soon as someone submits the public form.
              </EmptyState>
            ) : null}

            <div className="case-list">
              {reports.map((report) => (
                <ReportCase
                  report={report}
                  key={report.id}
                  onStatusChange={changeStatus}
                  busy={busyId === report.id}
                />
              ))}
            </div>

            {!loading && reports.length < reportTotal ? (
              <div className="admin-load-more">
                <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <span className="spinner spinner-tiny" /> Loading…
                    </>
                  ) : (
                    <>
                      <Icon name="plus" size={15} /> Load {Math.min(PAGE_SIZE, reportTotal - reports.length)} more
                    </>
                  )}
                </button>
                <span className="muted small">
                  Showing {reports.length} of {reportTotal}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="admin-subhead">
              <p className="muted">Registrations for weekend drives and general volunteering.</p>
              <button
                type="button"
                className="btn btn-soft btn-sm"
                onClick={() => exportCsv('registrations')}
                disabled={exporting === 'registrations'}
              >
                <Icon name="download" size={15} />{' '}
                {exporting === 'registrations' ? 'Exporting…' : 'Export volunteers'}
              </button>
            </div>

            {loading ? (
              <div className="admin-loading">
                <Spinner label="Loading volunteers" />
                <p className="muted">Loading registrations…</p>
              </div>
            ) : null}

            {!loading && registrations.length === 0 ? (
              <EmptyState icon="users" title="No volunteer registrations yet">
                The registration form on the Get involved page writes here.
              </EmptyState>
            ) : null}

            <div className="case-list">
              {registrations.map((registration) => (
                <RegistrationCase registration={registration} key={registration.id} />
              ))}
            </div>

            {!loading && registrations.length < registrationTotal ? (
              <div className="admin-load-more">
                <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <span className="spinner spinner-tiny" /> Loading…
                    </>
                  ) : (
                    <>
                      <Icon name="plus" size={15} /> Load{' '}
                      {Math.min(PAGE_SIZE, registrationTotal - registrations.length)} more
                    </>
                  )}
                </button>
                <span className="muted small">
                  Showing {registrations.length} of {registrationTotal}
                </span>
              </div>
            ) : null}
          </>
        )}

        <p className="admin-footnote">
          <Icon name="lock" size={14} /> Admin tokens expire after 12 hours (configurable via{' '}
          <code>ADMIN_TOKEN_TTL_HOURS</code>). Report photos are stored privately under{' '}
          <code>server/data/uploads</code> and served only from this site.
        </p>
      </main>
    </div>
  )
}
