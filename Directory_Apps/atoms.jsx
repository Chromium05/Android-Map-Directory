/* global React */

// ─────────────────────────────────────────────────────────────
// Shared atoms: icons, photo placeholder, status pill
// Used by Home screen AND Style guide.
// ─────────────────────────────────────────────────────────────

const Icon = {
  search: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  pin: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/>
      <circle cx="12" cy="10" r="2.6"/>
    </svg>
  ),
  pinFill: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 22s7.5-6.6 7.5-11.6A7.5 7.5 0 1 0 4.5 10.4C4.5 15.4 12 22 12 22Z"/>
      <circle cx="12" cy="10" r="2.6" fill="#fff"/>
    </svg>
  ),
  home: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 11 12 4l8 7"/><path d="M5.5 10v9.5h13V10"/>
    </svg>
  ),
  homeFill: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 3.2 3.6 10.6V20a1 1 0 0 0 1 1H10v-6h4v6h5.4a1 1 0 0 0 1-1v-9.4Z"/>
    </svg>
  ),
  map: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/>
      <path d="M9 4v16M15 6v16"/>
    </svg>
  ),
  info: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>
    </svg>
  ),
  chev: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  ),
  arrow: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  star: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="m12 3.5 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8L6.7 20l1-6-4.4-4.2 6-.9Z"/>
    </svg>
  ),
  sliders: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" {...p}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8"/>
      <circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>
    </svg>
  ),
  locate: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
  ),
};

// Category glyphs — campus unit types — simple, geometric, single-stroke
const Glyph = {
  all: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" {...p}>
      <circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/>
      <circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/>
    </svg>
  ),
  // Departemen — pillar / academic building
  dept: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 9 12 4l9 5"/>
      <path d="M5 10v8M19 10v8M3 19h18"/>
      <path d="M9 11v6M15 11v6"/>
    </svg>
  ),
  // Kesehatan — medical cross
  kesehatan: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  // Vokasi — wrench / applied
  vokasi: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 6a3.5 3.5 0 1 0 3.5 4l2.5 2.5-3 3L15 13a3.5 3.5 0 1 1-.5-7Z"/>
      <path d="M11 11 4 18l2 2 7-7"/>
    </svg>
  ),
  // PAA — document / form / academic admin
  paa: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
      <path d="M14 3v5h5"/>
      <path d="M8 12h8M8 15h8M8 18h5"/>
    </svg>
  ),
  // Kemahasiswaan — group / people
  kemahasiswaan: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="9" r="3"/>
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/>
      <circle cx="17" cy="8" r="2.4"/>
      <path d="M14.5 14.5c1 0 6 0 6.5 5.5"/>
    </svg>
  ),
  // Lab — flask
  lab: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 3h4"/>
      <path d="M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3"/>
      <path d="M7.5 14h9"/>
    </svg>
  ),
};

// Striped photo placeholder — labeled, monospace caption
function PhotoSlot({ w='100%', h=120, label='foto tempat', radius=14, tone='warm' }) {
  const stripe = tone === 'warm'
    ? 'repeating-linear-gradient(135deg, oklch(0.92 0.012 90) 0 6px, oklch(0.955 0.008 90) 6px 12px)'
    : 'repeating-linear-gradient(135deg, oklch(0.9 0.02 150) 0 6px, oklch(0.94 0.015 150) 6px 12px)';
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, background: stripe,
      border: '1px solid var(--hairline)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'oklch(0.55 0.01 95)', fontFamily: 'var(--font-mono)',
      fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase',
    }}>{label}</div>
  );
}

// Status pill — "Buka" / "Tutup" / "Tutup 30m lagi"
function StatusPill({ status='open', label }) {
  const map = {
    open:    { c: 'var(--open)',    t: 'Buka' },
    closed:  { c: 'var(--closed)',  t: 'Tutup' },
    soon:    { c: 'var(--warning)', t: 'Tutup 30m' },
  };
  const s = map[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, color: s.c,
      fontFamily: 'var(--font-sans)', letterSpacing: 0.1,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999, background: s.c,
        boxShadow: status === 'open' ? `0 0 0 3px ${'color-mix(in oklab, var(--open) 22%, transparent)'}` : 'none',
      }}/>
      {label ?? s.t}
    </span>
  );
}

// Distance — monospace, lowercase units
function Distance({ value, unit }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', letterSpacing: 0 }}>
      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
      <span style={{ opacity: 0.7 }}> {unit}</span>
    </span>
  );
}

// Floor + building badge — emphasises which room within which building
function FloorBadge({ building, floor, compact = false }) {
  if (compact) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'var(--ink-2)',
      }}>
        <Icon.pin width={11} height={11} style={{ color: 'var(--route-ink)' }}/>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{building}</span>
        <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600,
          color: 'var(--route-ink)', letterSpacing: 0.2 }}>{floor}</span>
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'stretch',
      borderRadius: 8, overflow: 'hidden',
      border: '1px solid var(--hairline-2)',
      fontSize: 11, lineHeight: 1,
    }}>
      <span style={{
        background: 'var(--paper-2)', color: 'var(--ink)',
        padding: '6px 9px', fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        <Icon.pin width={11} height={11} style={{ color: 'var(--route-ink)' }}/>
        {building}
      </span>
      <span style={{
        background: 'var(--ink)', color: 'var(--paper)',
        padding: '6px 9px', fontFamily: 'var(--font-mono)', fontWeight: 700,
        letterSpacing: 0.3, display: 'inline-flex', alignItems: 'center',
      }}>{floor}</span>
    </span>
  );
}

Object.assign(window, { Icon, Glyph, PhotoSlot, StatusPill, Distance, FloorBadge });
