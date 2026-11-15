export const REPORT_CATEGORY_LABELS = {
  cruelty: 'Cruelty or abuse',
  injury: 'Injured animal',
  accident: 'Road accident',
  abandonment: 'Abandoned animal',
  illegal_trade: 'Illegal trade or breeding',
  other: 'Something else',
}

export const ANIMAL_LABELS = {
  dog: 'Dog',
  cat: 'Cat',
  cattle: 'Cow / cattle',
  bird: 'Bird',
  wildlife: 'Wild animal',
  other: 'Other',
}

export const SEVERITY = {
  1: { label: 'Low', hint: 'Not in immediate danger' },
  2: { label: 'Urgent', hint: 'Needs help soon' },
  3: { label: 'Critical', hint: 'Life-threatening' },
}

export const STATUS_LABELS = {
  new: 'New',
  in_review: 'In review',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-IN', options).format(date)
}

export const formatDateTime = (value) =>
  formatDate(value, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export const titleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
