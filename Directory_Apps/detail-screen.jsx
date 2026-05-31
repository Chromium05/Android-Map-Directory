/* global React, Icon, Glyph, PhotoSlot, StatusPill, Distance, FloorBadge, UNITS, PhoneShell */

// ─────────────────────────────────────────────────────────────
// Detail Screen — informasi lengkap satu unit kampus
// Hero photo · floor highlight · sub-rooms · open hours · CTA rute
// ─────────────────────────────────────────────────────────────

function D_TopBar() {
  const btn = (children) => (
    <div style={{
      width: 36, height: 36, borderRadius: 12,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(20,30,25,0.10)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink)',
    }}>{children}</div>
  );
  return (
    <div style={{
      position: 'absolute', top: 8, left: 14, right: 14, zIndex: 3,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {btn(<Icon.chev width={16} height={16} style={{ transform: 'rotate(180deg)' }}/>)}
      <div style={{ display: 'flex', gap: 8 }}>
        {btn(<Icon.star width={15} height={15} style={{ color: 'var(--ink-3)' }}/>)}
        {btn(<span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>⋯</span>)}
      </div>
    </div>
  );
}

function D_InfoRow({ icon, label, value, mono = false, accent = false }) {
  const I = Icon[icon];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 0', borderBottom: '1px solid var(--hairline)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'var(--paper-2)', border: '1px solid var(--hairline)',
        color: accent ? 'var(--route-ink)' : 'var(--ink-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I width={15} height={15}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
        <div style={{
          marginTop: 3,
          fontSize: 13,
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          fontWeight: mono ? 600 : 600,
          color: 'var(--ink)',
          lineHeight: 1.4,
        }}>{value}</div>
      </div>
    </div>
  );
}

function D_SubRooms({ rooms }) {
  return (
    <div style={{
      borderRadius: 14, border: '1px solid var(--hairline)',
      background: 'var(--paper)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--hairline)',
        background: 'var(--paper-2)',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: -0.1 }}>Ruangan di unit ini</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          {rooms.length} ruang
        </span>
      </div>
      {rooms.map((r, i) => (
        <div key={i} style={{
          padding: '10px 14px',
          borderBottom: i < rooms.length - 1 ? '1px solid var(--hairline)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{r.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            color: 'var(--route-ink)' }}>{r.loc}</div>
        </div>
      ))}
    </div>
  );
}

function D_CTA({ u }) {
  return (
    <div style={{
      padding: '12px 16px 14px',
      background: 'var(--paper)',
      borderTop: '1px solid var(--hairline)',
      display: 'flex', gap: 10,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink)',
      }}>
        <Icon.pin width={18} height={18}/>
      </div>
      <div style={{
        flex: 1, height: 48, borderRadius: 14,
        background: 'var(--route)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: 15, fontWeight: 700,
        boxShadow: 'var(--shadow-fab)',
      }}>
        <Icon.map width={18} height={18}/>
        Buka Rute · {u.dist} {u.distUnit}
      </div>
    </div>
  );
}

function DetailScreen() {
  // Show the one with sub-rooms detail
  const u = UNITS.find(x => x.id === 1);
  const G = Glyph[u.glyph];

  return (
    <PhoneShell time="9:34">
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Hero photo */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <D_TopBar/>
          <div style={{ height: 220 }}>
            <PhotoSlot h={220} radius={0} label={`foto · ${u.building.toLowerCase()}`}/>
          </div>
          {/* Floor badge overlay */}
          <div style={{ position: 'absolute', bottom: 18, left: 16 }}>
            <FloorBadge building={u.building} floor={u.floor}/>
          </div>
        </div>

        {/* Scrolling body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 0' }}>
          {/* Category + rating row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--route-ink)',
              textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700,
            }}>
              <G width={13} height={13}/> {u.cat}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
              <Icon.star width={13} height={13} style={{ color: 'oklch(0.78 0.16 80)' }}/>
              {u.rating}
              <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>· 124 ulasan</span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            margin: '6px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: -0.6,
            color: 'var(--ink)', lineHeight: 1.15,
          }}>{u.name}</h1>

          {/* Status + distance */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusPill status={u.status}/>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                {u.dist} {u.distUnit}
              </span> dari kamu
            </span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>
              ~3 menit
            </span>
          </div>

          {/* Description */}
          {u.desc && (
            <p style={{
              margin: '14px 0 4px', fontSize: 13.5, lineHeight: 1.55,
              color: 'var(--ink-2)', textWrap: 'pretty',
            }}>{u.desc}</p>
          )}

          {/* Info rows */}
          <div style={{ marginTop: 12 }}>
            <D_InfoRow icon="pin" label="Lokasi" value={`${u.building} · ${u.floor}`} accent/>
            <D_InfoRow icon="info" label="Alamat" value={u.addr}/>
            <D_InfoRow icon="star" label="Jam Layanan" value={u.hours} mono/>
            <D_InfoRow icon="locate" label="Koordinat" value="−7.27543, 112.79742" mono/>
          </div>

          {/* Sub-rooms */}
          {u.sub && (
            <div style={{ marginTop: 16 }}>
              <D_SubRooms rooms={u.sub}/>
            </div>
          )}

          {/* Quick actions */}
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'var(--paper)', border: '1px solid var(--hairline-2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'var(--paper-2)', color: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
              }}>SMS</div>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-3)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Kontak</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>+62 31 594 1234</div>
              </div>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'var(--paper)', border: '1px solid var(--hairline-2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'var(--paper-2)', color: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
              }}>WEB</div>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-3)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Situs</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>ti.kampus.ac.id</div>
              </div>
            </div>
          </div>

          <div style={{ height: 16 }}/>
        </div>

        {/* Bottom CTA bar — sticky */}
        <D_CTA u={u}/>
      </div>
    </PhoneShell>
  );
}

window.DetailScreen = DetailScreen;
