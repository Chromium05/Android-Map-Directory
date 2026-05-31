/* global React, Icon, Glyph, PhotoSlot, StatusPill, Distance, FloorBadge, UNITS, CATEGORIES */

// ─────────────────────────────────────────────────────────────
// Home Screen — beranda direktori unit kampus
// Sticky search + kategori unit + daftar unit terdekat (gedung+lt).
// ─────────────────────────────────────────────────────────────

function H_SearchBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      height: 48, padding: '0 14px',
      background: 'var(--paper-2)',
      border: '1px solid var(--hairline)',
      borderRadius: 14,
    }}>
      <Icon.search width={18} height={18} style={{ color: 'var(--ink-2)' }}/>
      <span style={{ flex: 1, color: 'var(--ink-3)', fontSize: 14 }}>Cari unit, gedung, atau lantai</span>
      <div style={{
        width: 30, height: 30, borderRadius: 10, background: 'var(--paper)',
        border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink-2)',
      }}>
        <Icon.sliders width={16} height={16}/>
      </div>
    </div>
  );
}

function H_CategoryRow({ active = 'Departemen' }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
      {CATEGORIES.map((c) => {
        const isActive = c.id === active;
        const G = Glyph[c.glyph];
        return (
          <div key={c.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 34, padding: '0 12px',
            borderRadius: 999, flexShrink: 0,
            fontSize: 13, fontWeight: 600,
            background: isActive ? 'var(--ink)' : 'var(--paper)',
            color: isActive ? 'var(--paper)' : 'var(--ink)',
            border: `1px solid ${isActive ? 'var(--ink)' : 'var(--hairline-2)'}`,
          }}>
            <G width={14} height={14} style={{ opacity: isActive ? 0.9 : 0.75 }}/>
            {c.label}
          </div>
        );
      })}
    </div>
  );
}

// Featured unit — large card with photo + prominent floor info
function H_FeaturedCard({ u }) {
  const G = Glyph[u.glyph];
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: 'var(--paper)',
      border: '1px solid var(--hairline)',
      boxShadow: 'var(--shadow-1)',
    }}>
      <div style={{ position: 'relative' }}>
        <PhotoSlot h={120} radius={0} label={`foto · ${u.building.toLowerCase()}`}/>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(20,25,22,0.78)', color: '#fff',
          backdropFilter: 'blur(6px)',
          fontSize: 11, fontWeight: 600, padding: '5px 9px', borderRadius: 999,
        }}>
          <G width={12} height={12}/> {u.cat}
        </div>
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
        }}>
          <FloorBadge building={u.building} floor={u.floor}/>
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2, color: 'var(--ink)',
            lineHeight: 1.2 }}>
            {u.name}
          </div>
          <Distance value={u.dist} unit={u.distUnit}/>
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusPill status={u.status}/>
            <span style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
              {u.hours}
            </span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--ink)', color: 'var(--paper)',
            height: 30, padding: '0 12px', borderRadius: 999,
            fontSize: 12, fontWeight: 600,
          }}>
            Buka rute <Icon.arrow width={12} height={12}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// List item — compact unit row with prominent floor pill
function H_UnitRow({ u, last = false }) {
  const G = Glyph[u.glyph];
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 0',
      borderBottom: last ? 'none' : '1px solid var(--hairline)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12, flexShrink: 0,
        background: 'var(--paper-2)', border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--route-ink)',
        backgroundImage: 'repeating-linear-gradient(135deg, oklch(0.93 0.012 90) 0 4px, oklch(0.955 0.008 90) 4px 8px)',
      }}>
        <G width={26} height={26}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontSize: 14.5, fontWeight: 700, letterSpacing: -0.15, color: 'var(--ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.25,
          }}>{u.name}</div>
          <Distance value={u.dist} unit={u.distUnit}/>
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <FloorBadge building={u.building} floor={u.floor} compact/>
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusPill status={u.status}/>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
              {u.hours}
            </span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 600, color: 'var(--route-ink)' }}>
            Rute <Icon.chev width={11} height={11}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function H_StatusStrip() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderRadius: 14,
      background: 'var(--route-tint)',
      border: '1px solid color-mix(in oklab, var(--route) 18%, transparent)',
    }}>
      <Icon.locate width={16} height={16} style={{ color: 'var(--route-ink)' }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--route-ink)' }}>Lokasi kamu</div>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
          Gedung Pusat · Lt. 1 · Lobi Utama
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--route-ink)' }}>Ubah</span>
    </div>
  );
}

function H_BottomTab({ active = 'home' }) {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: 'home' },
    { id: 'map',  label: 'Peta',    icon: 'map'  },
    { id: 'info', label: 'Info',    icon: 'info' },
  ];
  return (
    <div style={{
      display: 'flex',
      padding: '8px 8px 6px',
      borderTop: '1px solid var(--hairline)',
      background: 'var(--paper)',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const I = isActive && t.icon === 'home' ? Icon.homeFill : Icon[t.icon];
        return (
          <div key={t.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '6px 0',
          }}>
            <div style={{
              width: 56, height: 28, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isActive ? 'var(--ink)' : 'transparent',
              color: isActive ? 'var(--paper)' : 'var(--ink-2)',
            }}>
              <I width={20} height={20}/>
            </div>
            <div style={{
              fontSize: 11, fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--ink)' : 'var(--ink-2)',
            }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// Reusable phone shell
function PhoneShell({ children, time = '9:30', battery = '92%' }) {
  return (
    <div style={{
      width: 380, height: 780, display: 'flex', flexDirection: 'column',
      background: 'var(--paper)',
      borderRadius: 32, overflow: 'hidden',
      border: '8px solid oklch(0.18 0.012 150)',
      boxShadow: '0 30px 60px -20px rgba(20,30,25,0.35)',
      fontFamily: 'var(--font-sans)', color: 'var(--ink)',
    }}>
      <div style={{
        height: 28, padding: '0 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 700, color: 'var(--ink)',
      }}>
        <span>{time}</span>
        <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', opacity: 0.85 }}>
          <span style={{ fontSize: 10 }}>●●● </span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{battery}</span>
        </span>
      </div>
      {children}
      <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--paper)' }}>
        <div style={{ width: 110, height: 4, borderRadius: 4, background: 'var(--ink)', opacity: 0.7 }}/>
      </div>
    </div>
  );
}

function HomeScreen() {
  // Sort by distance for "Terdekat dari kamu"
  const sorted = [...UNITS].sort((a, b) => {
    const da = a.distUnit === 'km' ? parseFloat(a.dist) * 1000 : parseFloat(a.dist);
    const db = b.distUnit === 'km' ? parseFloat(b.dist) * 1000 : parseFloat(b.dist);
    return da - db;
  });
  const featured = sorted[0];
  const rest = sorted.slice(1, 4);

  return (
    <PhoneShell>
      {/* App header — large title */}
      <div style={{ padding: '6px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)',
              letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Direktori · Kampus
            </div>
            <div style={{
              marginTop: 4, fontSize: 24, fontWeight: 800, letterSpacing: -0.7,
              color: 'var(--ink)', lineHeight: 1.1,
            }}>
              Mau ke unit mana<br/>hari ini?
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', fontWeight: 700, fontSize: 13,
          }}>R</div>
        </div>
      </div>

      {/* Scroll body */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px',
        display: 'flex', flexDirection: 'column', gap: 14 }}>
        <H_SearchBar/>
        <H_StatusStrip/>
        <H_CategoryRow active="Departemen"/>

        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginTop: 2,
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>Terdekat dari kamu</div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>
            urut · jarak ↑
          </div>
        </div>

        <H_FeaturedCard u={featured}/>

        <div style={{ marginTop: -4 }}>
          {rest.map((u, i) => (
            <H_UnitRow key={u.id} u={u} last={i === rest.length - 1}/>
          ))}
        </div>
      </div>

      <H_BottomTab active="home"/>
    </PhoneShell>
  );
}

Object.assign(window, { HomeScreen, PhoneShell, H_BottomTab: H_BottomTab });
