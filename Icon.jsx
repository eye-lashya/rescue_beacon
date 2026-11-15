const ICONS = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />,
  siren: (
    <>
      <circle cx="12" cy="13" r="5" />
      <path d="M12 2v3M5 5l2 2M19 5l-2 2M3 13h2M19 13h2M7 21h10" />
    </>
  ),
  ambulance: (
    <>
      <path d="M2 7h12v9H2zM14 10h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
      <path d="M7 10.5h3M8.5 9v3" />
    </>
  ),
  flame: <path d="M12 2s6 5.2 6 10a6 6 0 0 1-12 0c0-2 1-3.6 2-4.6 0 2 1 3 2 3 0-3 1-6 2-8.4z" />,
  shield: <path d="M12 2l8 3v6c0 5-3.4 8.4-8 11-4.6-2.6-8-6-8-11V5z" />,
  landmark: (
    <>
      <path d="M3 21h18M5 21V10M19 21V10M12 3l9 6H3zM9 21v-7M15 21v-7" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5M9 13h6M9 17h6" />
    </>
  ),
  heart: <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />,
  leaf: (
    <>
      <path d="M20 4c-8 0-14 3-14 10a5 5 0 0 0 5 5c7 0 9-6 9-15z" />
      <path d="M4 21c2-5 6-9 11-12" />
    </>
  ),
  home: <path d="M3 11l9-8 9 8M5 10v11h14V10M10 21v-6h4v6" />,
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3M6 3H4M14 3h2M10 14v1a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  bowl: <path d="M3 12h18c0 5-4 8-9 8s-9-3-9-8zM8 8c0-2 1.5-3 4-3s4 1 4 3" />,
  paw: (
    <>
      <circle cx="7" cy="7" r="1.8" />
      <circle cx="12" cy="5.4" r="1.8" />
      <circle cx="17" cy="7" r="1.8" />
      <path d="M12 21c-4 0-7-2.5-7-6 0-2.5 2-4 4-4 1.5 0 2 .5 3 .5s1.5-.5 3-.5c2 0 4 1.5 4 4 0 3.5-3 6-7 6z" />
    </>
  ),
  dog: (
    <>
      <path d="M5 9 4 3l5 2M19 9l1-6-5 2" />
      <path d="M5 9v3a7 7 0 0 0 14 0V9" />
      <path d="M9 12h.01M15 12h.01" />
      <path d="M10 16h4M12 14v2" />
    </>
  ),
  cat: (
    <>
      <path d="M5 9 3 3l6 3a8 8 0 0 1 6 0l6-3-2 6v3a7 7 0 0 1-14 0z" />
      <path d="M9 12h.01M15 12h.01" />
      <path d="M10 16h4M12 15v2" />
      <path d="M2 12h3M19 12h3" />
    </>
  ),
  bird: (
    <>
      <path d="M20 7a4 4 0 0 0-4-4c-2.8 0-5 2.2-5 5v2L3 18h9l3-3h2a4 4 0 0 0 3-8z" />
      <path d="M15 5.5h.01M9 18l-2 3M13 18l-1 3" />
    </>
  ),
  reptile: (
    <>
      <path d="M4 14c3 0 4-2 4-5s1-5 4-5 4 2 4 5-1 5-4 5H4z" />
      <path d="M4 14c0 4 3 7 7 7h5M16 21l3-2-2-3M4 14H2" />
      <path d="M12 7h.01" />
    </>
  ),
  rabbit: (
    <>
      <path d="M8 3c-1.5 2-2 4-2 6M16 3c1.5 2 2 4 2 6" />
      <path d="M6 10a6 6 0 0 0 12 0c0-1.5-1-3-3-3h-6c-2 0-3 1.5-3 3z" />
      <path d="M10 14h.01M14 14h.01M12 16v1" />
    </>
  ),
  cow: (
    <>
      <path d="M5 7 4 2l5 3M19 7l1-5-5 3" />
      <path d="M5 7v4a7 7 0 0 0 14 0V7" />
      <path d="M9 12h.01M15 12h.01M10 16h4" />
      <path d="M8 22v-3M16 22v-3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  cloudRain: (
    <>
      <path d="M7 16a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 .5 7H7z" />
      <path d="M8 19l-1 2M13 19l-1 2M18 19l-1 2" />
    </>
  ),
  snow: (
    <>
      <path d="M12 2v20M4 6l16 12M20 6L4 18" />
      <path d="M9 4l3 2 3-2M9 20l3-2 3 2" />
    </>
  ),
  spark: <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />,
  book: (
    <>
      <path d="M4 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4z" />
      <path d="M20 4h-6a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h6z" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M5 7h14M8 21h8M7 7l-3 6h6zM17 7l-3 6h6z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </>
  ),
  external: <path d="M14 3h7v7M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />,
  check: <path d="M20 6L9 17l-5-5" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2M17 4a3.5 3.5 0 0 1 0 7M22 21v-2a5 5 0 0 0-3-4.5" />
    </>
  ),
  drop: <path d="M12 2s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  syringe: <path d="M14 4l6 6M17 7l-9 9-4 1 1-4 9-9zM3 21l4-4M12 5l3 3" />,
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 9v5M12 17.5v.5" />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  upload: <path d="M12 21V9M7 14l5-5 5 5M4 3h16" />,
  refresh: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.5" />
    </>
  ),
  map: <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2zM9 3v16M15 5v16" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />,
}

export function Icon({ name, size = 20, strokeWidth = 1.8, className = '', ...rest }) {
  const content = ICONS[name] || ICONS.info
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {content}
    </svg>
  )
}
