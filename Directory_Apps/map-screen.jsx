/* global React, Icon, Glyph, StatusPill, Distance, FloorBadge, UNITS, CATEGORIES, PhoneShell, H_BottomTab */

// ─────────────────────────────────────────────────────────────
// Map Screen — peta direktori
// Stylized campus plan with pins, callout, and bottom sheet.
// ─────────────────────────────────────────────────────────────

// Static campus plan — labelled buildings, paths, greenery.
// Designed once, fits the unit coordinates from data.jsx.
function CampusPlan() {
  const C = {
    bg:        'oklch(0.965 0.010 95)',
    green:     'oklch(0.92 0.040 145)',
    greenDk:   'oklch(0.86 0.055 145)',
    road:      'oklch(0.98 0.005 95)',
    roadEdge:  'oklch(0.89 0.010 95)',
    block:     'oklch(0.94 0.010 95)',
    blockEdge: 'oklch(0.86 0.012 95)',
    blockAct:  'oklch(0.90 0.015 95)',
    label:     'oklch(0.45 0.010 150)',
  };
  return (
    <svg viewBox="0 0 380 600" preserveAspectRatio="xMidYMid slice"
         style={{ display: 'block', width: '100%', height: '100%', background: C.bg }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="oklch(0.93 0.008 95)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="380" height="600" fill="url(#grid)"/>

      {/* Greenery blocks */}
      <rect x="14"  y="48"  width="60"  height="74"  rx="6" fill={C.green}/>
      <rect x="270" y="40"  width="98"  height="60"  rx="6" fill={C.green}/>
      <rect x="14"  y="450" width="100" height="130" rx="6" fill={C.green}/>
      <rect x="240" y="460" width="130" height="120" rx="6" fill={C.green}/>
      <circle cx="190" cy="300" r="36" fill={C.green}/>
      <circle cx="190" cy="300" r="22" fill={C.greenDk} opacity="0.6"/>

      {/* Roads — main loop */}
      <path d="M-10 165 H 390" stroke={C.road} strokeWidth="22"/>
      <path d="M-10 165 H 390" stroke={C.roadEdge} strokeWidth="1"/>
      <path d="M-10 410 H 390" stroke={C.road} strokeWidth="22"/>
      <path d="M-10 410 H 390" stroke={C.roadEdge} strokeWidth="1"/>
      <path d="M150 -10 V 610" stroke={C.road} strokeWidth="18"/>
      <path d="M150 -10 V 610" stroke={C.roadEdge} strokeWidth="1"/>
      <path d="M232 -10 V 610" stroke={C.road} strokeWidth="14"/>
      <path d="M232 -10 V 610" stroke={C.roadEdge} strokeWidth="1"/>

      {/* Pedestrian dashed paths */}
      <path d="M190 165 L 190 300 L 232 300" stroke="oklch(0.78 0.008 95)"
            strokeWidth="1.5" strokeDasharray="3 4" fill="none"/>
      <path d="M75 165 L 75 410" stroke="oklch(0.78 0.008 95)"
            strokeWidth="1.5" strokeDasharray="3 4" fill="none"/>

      {/* Building footprints — labelled */}
      {/* FK (Kedokteran) */}
      <g>
        <rect x="34" y="178" width="76" height="56" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="72" y="211" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>FK</text>
      </g>
      {/* FKM */}
      <g>
        <rect x="80" y="120" width="60" height="44" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="110" y="146" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>FKM</text>
      </g>
      {/* Pusat */}
      <g>
        <rect x="158" y="240" width="56" height="50" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="186" y="269" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>PUSAT</text>
      </g>
      {/* TI — currently the "selected" cluster, slightly darker */}
      <g>
        <rect x="234" y="180" width="74" height="80" rx="3" fill={C.blockAct} stroke="oklch(0.78 0.012 95)"/>
        <text x="271" y="225" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="700" fill="oklch(0.32 0.10 150)">GED. TI</text>
      </g>
      {/* Sipil */}
      <g>
        <rect x="280" y="270" width="74" height="44" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="317" y="296" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>SIPIL</text>
      </g>
      {/* Mesin */}
      <g>
        <rect x="280" y="324" width="74" height="44" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="317" y="350" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>MESIN</text>
      </g>
      {/* Vokasi */}
      <g>
        <rect x="148" y="340" width="80" height="60" rx="3" fill={C.block} stroke={C.blockEdge}/>
        <text x="188" y="374" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
              fontWeight="600" fill={C.label}>VOKASI</text>
      </g>

      {/* Compass / N indicator */}
      <g transform="translate(340 540)">
        <circle r="14" fill="white" stroke={C.roadEdge}/>
        <path d="M0 -8 L4 6 L0 3 L-4 6 Z" fill="oklch(0.32 0.10 150)"/>
        <text x="0" y="-16" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono"
              fontWeight="700" fill={C.label}>N</text>
      </g>
    </svg>
  );
}

// Map pin — droplet with category glyph inside
function MapPin({ u, selected, dim }) {
  const G = Glyph[u.glyph];
  if (selected) {
    return (
      <div style={{
        position: 'absolute',
        left: u.coord.x, top: u.coord.y,
        transform: 'translate(-50%, -100%)',
        filter: 'drop-shadow(0 6px 10px rgba(20,30,25,0.25))',
        zIndex: 3,
      }}>
        <svg width="46" height="56" viewBox="0 0 46 56">
          <path d="M23 1c11 0 20 8.5 20 19.5 0 8-6 16-20 33-14-17-20-25-20-33C3 9.5 12 1 23 1Z"
                fill="var(--ink)" stroke="white" strokeWidth="2"/>
          <circle cx="23" cy="20" r="13" fill="var(--paper)"/>
        </svg>
        <div style={{ position: 'absolute', left: 23, top: 20,
          transform: 'translate(-50%, -50%)', color: 'var(--ink)' }}>
          <G width={16} height={16}/>
        </div>
      </div>
    );
  }
  if (dim) {
    return (
      <div style={{
        position: 'absolute', left: u.coord.x, top: u.coord.y,
        transform: 'translate(-50%, -50%)', zIndex: 1,
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: 999,
          background: 'var(--paper)', border: '1.5px solid var(--ink-3)',
        }}/>
      </div>
    );
  }
  return (
    <div style={{
      position: 'absolute',
      left: u.coord.x, top: u.coord.y,
      transform: 'translate(-50%, -100%)',
      filter: 'drop-shadow(0 4px 6px rgba(20,30,25,0.18))',
      zIndex: 2,
    }}>
      <svg width="32" height="40" viewBox="0 0 32 40">
        <path d="M16 1c8 0 14 6 14 14 0 6-4 11-14 24C6 26 2 21 2 15 2 7 8 1 16 1Z"
              fill="var(--route)" stroke="white" strokeWidth="2"/>
        <circle cx="16" cy="14" r="8" fill="white"/>
      </svg>
      <div style={{ position: 'absolute', left: 16, top: 14,
        transform: 'translate(-50%, -50%)', color: 'var(--route-ink)' }}>
        <G width={11} height={11}/>
      </div>
    </div>
  );
}

// User location pulsing dot
function UserDot({ x, y }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)',
      zIndex: 1,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 999,
        background: 'color-mix(in oklab, var(--route) 22%, transparent)',
        position: 'absolute', left: -30, top: -30,
      }}/>
      <div style={{
        width: 18, height: 18, borderRadius: 999,
        background: 'var(--route)', border: '3px solid white',
        boxShadow: '0 2px 4px rgba(0,90,55,0.4)',
      }}/>
    </div>
  );
}

// Callout above selected pin
function Callout({ u }) {
  const G = Glyph[u.glyph];
  return (
    <div style={{
      position: 'absolute',
      left: u.coord.x, top: u.coord.y - 70,
      transform: 'translate(-50%, -100%)',
      background: 'var(--ink)', color: 'var(--paper)',
      padding: '8px 12px', borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 8,
      whiteSpace: 'nowrap',
      boxShadow: '0 10px 24px -8px rgba(20,30,25,0.4)',
      zIndex: 4,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 8,
        background: 'color-mix(in oklab, var(--route) 28%, transparent)',
        color: 'var(--route)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <G width={14} height={14}/>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: -0.1 }}>{u.short}</div>
        <div style={{ fontSize: 10, opacity: 0.75, fontFamily: 'var(--font-mono)' }}>
          {u.building} · {u.floor}
        </div>
      </div>
      {/* tail */}
      <div style={{
        position: 'absolute', left: '50%', bottom: -5,
        transform: 'translateX(-50%) rotate(45deg)',
        width: 10, height: 10, background: 'var(--ink)',
      }}/>
    </div>
  );
}

// Floating action buttons (right side)
function FloatingActions() {
  const btnStyle = {
    width: 40, height: 40, borderRadius: 12,
    background: 'var(--paper)',
    border: '1px solid var(--hairline-2)',
    boxShadow: 'var(--shadow-2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ink)',
  };
  return (
    <div style={{
      position: 'absolute', right: 12, top: 12, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={btnStyle}><Icon.locate width={18} height={18} style={{ color: 'var(--route-ink)' }}/></div>
      <div style={btnStyle}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>＋</span>
      </div>
      <div style={btnStyle}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>−</span>
      </div>
    </div>
  );
}

// Mini chip row over map (compact filter)
function MapChipRow({ active = 'Departemen' }) {
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, right: 64,
      display: 'flex', gap: 6, overflow: 'hidden',
    }}>
      {CATEGORIES.slice(0, 5).map((c) => {
        const isActive = c.id === active;
        const G = Glyph[c.glyph];
        return (
          <div key={c.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            height: 30, padding: '0 10px', borderRadius: 999, flexShrink: 0,
            fontSize: 12, fontWeight: 600,
            background: isActive ? 'var(--ink)' : 'var(--paper)',
            color: isActive ? 'var(--paper)' : 'var(--ink)',
            border: `1px solid ${isActive ? 'var(--ink)' : 'var(--hairline-2)'}`,
            boxShadow: 'var(--shadow-1)',
          }}>
            <G width={12} height={12} style={{ opacity: 0.85 }}/>
            {c.label}
          </div>
        );
      })}
    </div>
  );
}

// Bottom sheet — selected unit preview
function MapBottomSheet({ u }) {
  const G = Glyph[u.glyph];
  return (
    <div style={{
      background: 'var(--paper)',
      borderTopLeftRadius: 22, borderTopRightRadius: 22,
      padding: '10px 18px 14px',
      borderTop: '1px solid var(--hairline)',
      boxShadow: '0 -10px 24px -16px rgba(20,30,25,0.18)',
    }}>
      <div style={{
        width: 40, height: 4, borderRadius: 999, background: 'var(--hairline-2)',
        margin: '0 auto 12px',
      }}/>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: 'var(--route-tint)',
          border: '1px solid color-mix(in oklab, var(--route) 18%, transparent)',
          color: 'var(--route-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <G width={24} height={24}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)',
              letterSpacing: 0.8, textTransform: 'uppercase' }}>{u.cat}</div>
            <Distance value={u.dist} unit={u.distUnit}/>
          </div>
          <div style={{ marginTop: 2, fontSize: 16, fontWeight: 800, letterSpacing: -0.3,
            color: 'var(--ink)', lineHeight: 1.2 }}>{u.name}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <FloorBadge building={u.building} floor={u.floor}/>
            <StatusPill status={u.status}/>
            <span style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>{u.hours}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <div style={{
          flex: 1, height: 44, borderRadius: 12,
          background: 'var(--paper)', border: '1px solid var(--hairline-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 13, fontWeight: 700, color: 'var(--ink)',
        }}>
          <Icon.info width={15} height={15}/> Detail
        </div>
        <div style={{
          flex: 1.4, height: 44, borderRadius: 12,
          background: 'var(--route)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 13, fontWeight: 700,
          boxShadow: 'var(--shadow-fab)',
        }}>
          <Icon.map width={15} height={15}/> Buka Rute
        </div>
      </div>
    </div>
  );
}

function MapScreen() {
  const selectedId = 1; // Dept TI
  const selected = UNITS.find(u => u.id === selectedId);
  const visible = UNITS.filter(u => u.cat === 'Departemen' || u.id === selectedId);
  const dimmed  = UNITS.filter(u => !visible.find(v => v.id === u.id));

  return (
    <PhoneShell time="9:32">
      {/* Compact header */}
      <div style={{ padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)',
        }}>
          <Icon.chev width={16} height={16} style={{ transform: 'rotate(180deg)' }}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)',
            letterSpacing: 1.2, textTransform: 'uppercase' }}>Peta · Kampus</div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2 }}>
            {visible.length} unit ditampilkan
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)',
        }}>
          <Icon.search width={16} height={16}/>
        </div>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden',
        borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <CampusPlan/>

        <MapChipRow active="Departemen"/>
        <FloatingActions/>

        {/* User location (Gedung Pusat lobby) */}
        <UserDot x={186} y={290}/>

        {/* Pins — dimmed first so they sit under active */}
        {dimmed.map(u => <MapPin key={u.id} u={u} dim/>)}
        {visible.filter(u => u.id !== selectedId).map(u => <MapPin key={u.id} u={u}/>)}

        {/* Selected */}
        <MapPin u={selected} selected/>
        <Callout u={selected}/>

        {/* Bottom sheet */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <MapBottomSheet u={selected}/>
        </div>
      </div>

      <H_BottomTab active="map"/>
    </PhoneShell>
  );
}

window.MapScreen = MapScreen;
