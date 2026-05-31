/* global React, Icon, Glyph, PhotoSlot, StatusPill, Distance */

// ─────────────────────────────────────────────────────────────
// Style Guide — Android Map Directory
// Single tall artboard. Print-doc feel: numbered sections,
// monospace metadata, generous hairlines.
// ─────────────────────────────────────────────────────────────

function SGHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '36px 40px 24px',
      borderBottom: '1px solid var(--hairline-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Logomark — pin inside a square */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--route)',
        }}>
          <Icon.pinFill width={28} height={28}/>
        </div>
        <div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)',
            textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Style Guide · v1.0
          </div>
          <div style={{ marginTop: 4, fontSize: 32, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05 }}>
            Android Map Directory
          </div>
          <div style={{ marginTop: 2, fontSize: 13, color: 'var(--ink-2)' }}>
            Direktori berbasis peta untuk mahasiswa kampus.
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-2)' }}>
        <div>Cloud Computing</div>
        <div>Mei 2026</div>
        <div style={{ color: 'var(--ink-3)' }}>doc · 01/01</div>
      </div>
    </div>
  );
}

function Section({ n, title, sub, children }) {
  return (
    <section style={{ padding: '32px 40px', borderBottom: '1px solid var(--hairline)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
          letterSpacing: 1.5 }}>§ {String(n).padStart(2, '0')}</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>{title}</h2>
        {sub && <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>— {sub}</span>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, token, value, fg = 'var(--ink)', bg }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        height: 70, borderRadius: 12, background: bg,
        border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'flex-end', padding: 10,
        color: fg, fontFamily: 'var(--font-mono)', fontSize: 10,
      }}>
        {name}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)' }}>{token}</code>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>{value}</code>
      </div>
    </div>
  );
}

function ColorsSection() {
  return (
    <Section n={1} title="Color" sub="oklch · warm neutrals + green wayfinding accent">
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
          Surface
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          <Swatch name="paper"      token="--paper"      value="0.985 / 95"   bg="var(--paper)"/>
          <Swatch name="paper-2"    token="--paper-2"    value="0.965 / 95"   bg="var(--paper-2)"/>
          <Swatch name="paper-3"    token="--paper-3"    value="0.935 / 95"   bg="var(--paper-3)"/>
          <Swatch name="hairline"   token="--hairline"   value="0.905 / 95"   bg="var(--hairline)"/>
          <Swatch name="hairline-2" token="--hairline-2" value="0.85  / 95"   bg="var(--hairline-2)"/>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
          Ink
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Swatch name="ink"   token="--ink"   value="0.20 / 150" bg="var(--ink)"   fg="var(--paper)"/>
          <Swatch name="ink-2" token="--ink-2" value="0.42 / 150" bg="var(--ink-2)" fg="var(--paper)"/>
          <Swatch name="ink-3" token="--ink-3" value="0.62 / 150" bg="var(--ink-3)" fg="var(--paper)"/>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
          Accent & Status
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          <Swatch name="route"      token="--route"      value="0.62 0.16 150" bg="var(--route)" fg="#fff"/>
          <Swatch name="route-tint" token="--route-tint" value="0.95 0.04 150" bg="var(--route-tint)"/>
          <Swatch name="open"       token="--open"       value="0.62 0.16 150" bg="var(--open)" fg="#fff"/>
          <Swatch name="warning"    token="--warning"    value="0.72 0.15 70"  bg="var(--warning)" fg="var(--ink)"/>
          <Swatch name="closed"     token="--closed"     value="0.58 0.16 30"  bg="var(--closed)" fg="#fff"/>
        </div>
      </div>
    </Section>
  );
}

function TypeSection() {
  const rows = [
    { tag: 'Display',   sample: 'Mau ke unit mana hari ini?',     size: 26, weight: 800, ls: -0.8, lh: 1.05 },
    { tag: 'Title L',   sample: 'Terdekat dari kamu',              size: 20, weight: 800, ls: -0.4 },
    { tag: 'Title M',   sample: 'Dept. Teknik Informatika',        size: 16, weight: 700, ls: -0.2 },
    { tag: 'Body',      sample: 'Kantor departemen untuk administrasi akademik mahasiswa S1 — KRS, transkrip, dan surat.', size: 14, weight: 500, ls: 0 },
    { tag: 'Caption',   sample: 'Gedung TI · 08:00 – 16:00',       size: 12, weight: 500, ls: 0, color: 'var(--ink-2)' },
    { tag: 'Mono · Meta', sample: 'Lt. 3 · 120 m · −7.2575, 112.7521', size: 12, weight: 500, mono: true, color: 'var(--ink-2)' },
    { tag: 'Mono · Tag',  sample: 'DIREKTORI · KAMPUS',            size: 11, weight: 600, mono: true, ls: 1.5, color: 'var(--ink-3)' },
  ];
  return (
    <Section n={2} title="Typography" sub="Plus Jakarta Sans · JetBrains Mono">
      <div style={{ display: 'flex', gap: 32, marginBottom: 18 }}>
        <div style={{ flex: 1, border: '1px solid var(--hairline)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>
            Display · Plus Jakarta Sans
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95 }}>Aa</div>
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-2)' }}>
            400 · 500 · 600 · 700 · 800
          </div>
        </div>
        <div style={{ flex: 1, border: '1px solid var(--hairline)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>
            Metadata · JetBrains Mono
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 600, letterSpacing: -2, lineHeight: 0.95 }}>
            123
          </div>
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-2)' }}>
            jarak · koordinat · tag · sortir
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '110px 1fr 200px', gap: 16,
            alignItems: 'center', padding: '14px 0',
            borderTop: '1px solid var(--hairline)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
              letterSpacing: 0.5 }}>{r.tag}</div>
            <div style={{
              fontFamily: r.mono ? 'var(--font-mono)' : 'var(--font-sans)',
              fontSize: r.size, fontWeight: r.weight, letterSpacing: r.ls ?? 0,
              lineHeight: r.lh ?? 1.3, color: r.color ?? 'var(--ink)',
              textTransform: r.ls > 1 ? 'uppercase' : 'none',
            }}>{r.sample}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textAlign: 'right' }}>
              {r.size}px · {r.weight}{r.ls ? ` · ${r.ls}` : ''}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IconRow() {
  const items = [
    ['search',   'pencarian'],
    ['pin',      'lokasi'],
    ['locate',   'lokasi-kamu'],
    ['map',      'peta'],
    ['home',     'beranda'],
    ['info',     'info'],
    ['arrow',    'rute'],
    ['chev',     'lanjut'],
    ['star',     'rating'],
    ['sliders',  'filter'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
      {items.map(([k, label]) => {
        const I = Icon[k];
        return (
          <div key={k} style={{
            border: '1px solid var(--hairline)', borderRadius: 12, padding: '14px 12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'var(--paper)',
          }}>
            <I width={22} height={22} style={{ color: 'var(--ink)' }}/>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function GlyphRow() {
  const items = [
    ['all',           'Semua'],
    ['dept',          'Departemen'],
    ['paa',           'PAA'],
    ['kemahasiswaan', 'Kemahasiswaan'],
    ['vokasi',        'Vokasi'],
    ['kesehatan',     'Kesehatan'],
    ['lab',           'Lab'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
      {items.map(([k, label]) => {
        const G = Glyph[k];
        return (
          <div key={k} style={{
            border: '1px solid var(--hairline)', borderRadius: 12, padding: '14px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'var(--paper)',
          }}>
            <G width={24} height={24} style={{ color: 'var(--route-ink)' }}/>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function IconographySection() {
  return (
    <Section n={3} title="Iconography" sub="1.8 stroke · 24×24 grid · single-weight">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
            UI · sistem
          </div>
          <IconRow/>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
            Kategori · tempat
          </div>
          <GlyphRow/>
        </div>
      </div>
    </Section>
  );
}

function ComponentsSection() {
  return (
    <Section n={4} title="Components" sub="atom · molecule">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

        {/* Buttons */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Buttons
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12,
            padding: 18, border: '1px solid var(--hairline)', borderRadius: 14, background: 'var(--paper)' }}>
            <button style={{
              all: 'unset', cursor: 'pointer',
              background: 'var(--route)', color: '#fff',
              height: 48, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
              boxShadow: 'var(--shadow-fab)',
            }}>
              <Icon.map width={18} height={18}/> Buka Rute
            </button>
            <button style={{
              all: 'unset', cursor: 'pointer',
              background: 'var(--ink)', color: 'var(--paper)',
              height: 44, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
            }}>
              Lihat detail
            </button>
            <button style={{
              all: 'unset', cursor: 'pointer',
              background: 'transparent', color: 'var(--ink)',
              height: 44, borderRadius: 12, border: '1px solid var(--hairline-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
            }}>
              Coba lagi
            </button>
          </div>
        </div>

        {/* Chips */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Chips · Filter
          </div>
          <div style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 14,
            display: 'flex', flexWrap: 'wrap', gap: 8, background: 'var(--paper)' }}>
            {[
              { l: 'Semua', g: 'all' },
              { l: 'Departemen', g: 'dept', active: true },
              { l: 'PAA', g: 'paa' },
              { l: 'Vokasi', g: 'vokasi' },
              { l: 'Lab', g: 'lab' },
            ].map((c, i) => {
              const G = Glyph[c.g];
              return (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 12px',
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 600,
                  background: c.active ? 'var(--ink)' : 'var(--paper)',
                  color: c.active ? 'var(--paper)' : 'var(--ink)',
                  border: `1px solid ${c.active ? 'var(--ink)' : 'var(--hairline-2)'}`,
                }}>
                  <G width={14} height={14} style={{ opacity: 0.8 }}/>
                  {c.l}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Search field
          </div>
          <div style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 14,
            display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--paper)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 14px',
              background: 'var(--paper-2)', border: '1px solid var(--hairline)', borderRadius: 14,
            }}>
              <Icon.search width={18} height={18} style={{ color: 'var(--ink-2)' }}/>
              <span style={{ flex: 1, color: 'var(--ink-3)', fontSize: 14 }}>Cari tempat...</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 14px',
              background: 'var(--paper)', border: '1.5px solid var(--ink)', borderRadius: 14,
            }}>
              <Icon.search width={18} height={18} style={{ color: 'var(--ink)' }}/>
              <span style={{ flex: 1, color: 'var(--ink)', fontSize: 14, fontWeight: 500 }}>dept. teknik informatika</span>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--paper-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: 'var(--ink-2)' }}>×</div>
            </div>
          </div>
        </div>

        {/* Status + distance */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Status · Distance · Floor badge
          </div>
          <div style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 14,
            background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <StatusPill status="open"/>
              <StatusPill status="soon"/>
              <StatusPill status="closed"/>
            </div>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center',
              paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
              <Distance value="120" unit="m"/>
              <Distance value="450" unit="m"/>
              <Distance value="1.2" unit="km"/>
              <Distance value="4.7" unit="km"/>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
              paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
              <FloorBadge building="Gedung TI" floor="Lt. 3"/>
              <FloorBadge building="Gedung FKM" floor="Lt. 2"/>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <FloorBadge building="Gedung Vokasi" floor="Lt. 1" compact/>
              <FloorBadge building="Gedung Mesin" floor="Lt. 1" compact/>
            </div>
          </div>
        </div>
      </div>

      {/* Place card */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Place card · varian
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* Featured */}
          <div style={{ borderRadius: 18, overflow: 'hidden',
            background: 'var(--paper)', border: '1px solid var(--hairline)' }}>
            <div style={{ position: 'relative' }}>
              <PhotoSlot h={120} radius={0} label="foto · gedung ti"/>
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(20,25,22,0.78)', color: '#fff',
                fontSize: 11, fontWeight: 600, padding: '5px 9px', borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <Glyph.dept width={12} height={12}/> Departemen
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <FloorBadge building="Gedung TI" floor="Lt. 3"/>
              </div>
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>Dept. Teknik Informatika</div>
                <Distance value="120" unit="m"/>
              </div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusPill status="open"/>
                  <span style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
                    08:00 – 16:00
                  </span>
                </div>
                <div style={{
                  background: 'var(--ink)', color: 'var(--paper)', height: 30, padding: '0 12px',
                  borderRadius: 999, fontSize: 12, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  Buka rute <Icon.arrow width={12} height={12}/>
                </div>
              </div>
            </div>
          </div>

          {/* List variant */}
          <div style={{ borderRadius: 14, padding: 16,
            background: 'var(--paper)', border: '1px solid var(--hairline)',
            display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'PAA Teknik Informatika', cat: 'PAA',    g: 'paa',          d: '120', u: 'm', s: 'open',   h: '08:00 – 15:30', b: 'Gedung TI',     fl: 'Lt. 2' },
              { name: 'Kemahasiswaan Vokasi',   cat: 'Kemahasiswaan', g: 'kemahasiswaan', d: '340', u: 'm', s: 'soon', h: '07:30 – 15:30', b: 'Gedung Vokasi', fl: 'Lt. 1' },
            ].map((p, i) => {
              const G = Glyph[p.g];
              return (
                <div key={i} style={{ display: 'flex', gap: 12,
                  paddingBottom: i === 0 ? 14 : 0,
                  borderBottom: i === 0 ? '1px solid var(--hairline)' : 'none' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                    backgroundImage: 'repeating-linear-gradient(135deg, oklch(0.93 0.012 90) 0 4px, oklch(0.955 0.008 90) 4px 8px)',
                    border: '1px solid var(--hairline)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--route-ink)',
                  }}>
                    <G width={24} height={24}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.15 }}>{p.name}</div>
                      <Distance value={p.d} unit={p.u}/>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <FloorBadge building={p.b} floor={p.fl} compact/>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusPill status={p.s}/>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{p.h}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SpacingSection() {
  const radii = [
    ['xs', 6],   ['sm', 10], ['md', 14], ['lg', 20], ['pill', 999],
  ];
  const spaces = [4, 8, 12, 16, 20, 24, 32];
  return (
    <Section n={5} title="Spacing · Radius · Elevation">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Spacing scale · 4px base
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {spaces.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--ink-2)', width: 40 }}>{s}px</code>
                <div style={{ height: 14, width: s * 3, background: 'var(--ink)', borderRadius: 3 }}/>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Radius
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {radii.map(([n, v]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 32, background: 'var(--paper-3)',
                  border: '1px solid var(--hairline-2)',
                  borderRadius: v,
                }}/>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--ink-2)' }}>--r-{n} · {v === 999 ? '∞' : `${v}px`}</code>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Elevation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['shadow-1', '0 1px 2px · subtle card lift'],
              ['shadow-2', '0 6px 16px · raised surface'],
              ['shadow-fab', '0 10px 24px · primary action'],
            ].map(([n, desc]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, background: 'var(--paper)',
                  borderRadius: 10, border: '1px solid var(--hairline)',
                  boxShadow: `var(--${n})`,
                }}/>
                <div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)' }}>--{n}</code>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function VoiceSection() {
  return (
    <Section n={6} title="Voice & Copy" sub="Bahasa Indonesia · ramah, ringkas, fungsional">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 14, background: 'var(--paper)' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--route-ink)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>✓ Tulis seperti ini</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>
            <li>"Mau ke unit mana hari ini?"</li>
            <li>"Buka rute" (bukan "Navigasikan")</li>
            <li>"Dept. TI · Gedung TI · Lt. 3 · 120 m"</li>
            <li>"GPS-mu mati. Aktifkan untuk lihat jarak."</li>
          </ul>
        </div>
        <div style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 14, background: 'var(--paper)' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--closed)',
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>✕ Hindari</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            <li>Bahasa formal kaku ("Anda dipersilakan...")</li>
            <li>Jargon teknis ("Inisialisasi geolokasi")</li>
            <li>Caps lock / tanda seru ganda</li>
            <li>Emoji acak yang bukan bagian ikonografi</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function StyleGuide() {
  return (
    <div style={{
      width: 760,
      background: 'var(--paper)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <SGHeader/>
      <ColorsSection/>
      <TypeSection/>
      <IconographySection/>
      <ComponentsSection/>
      <SpacingSection/>
      <VoiceSection/>
      <div style={{ padding: '20px 40px 28px', display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
        <span>Android Map Directory · Style Guide v1.0</span>
        <span>End of document</span>
      </div>
    </div>
  );
}

window.StyleGuide = StyleGuide;
