/* global React, Icon, Glyph, PhotoSlot, UNITS, CATEGORIES, PhoneShell, H_BottomTab */

// ─────────────────────────────────────────────────────────────
// Info Screen — tab Info di bottom nav
// Tentang aplikasi · stats kampus · daftar kategori · bantuan
// ─────────────────────────────────────────────────────────────

const CATEGORY_DESC = {
  Departemen:    'Kantor administrasi prodi · sekretariat, kaprodi, dosen.',
  PAA:           'Pelayanan Administrasi Akademik — surat, transkrip, legalisir.',
  Kemahasiswaan: 'Beasiswa, organisasi, konseling, dan kegiatan mahasiswa.',
  Vokasi:        'Sekretariat & unit pendukung Sekolah Vokasi.',
  Kesehatan:     'Departemen rumpun ilmu kesehatan.',
  Lab:           'Laboratorium praktikum, riset, dan komputasi.',
};

function I_BrandCard() {
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      border: '1px solid var(--hairline)',
      background: 'var(--paper)',
    }}>
      <div style={{
        padding: '18px 18px 16px',
        background:
          'linear-gradient(135deg, color-mix(in oklab, var(--route) 14%, var(--paper)), var(--paper))',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: 14,
          background: 'var(--ink)', color: 'var(--route)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon.pinFill width={26} height={26}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)',
            letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Direktori · Kampus
          </div>
          <div style={{ marginTop: 2, fontSize: 18, fontWeight: 800, letterSpacing: -0.4,
            lineHeight: 1.15, color: 'var(--ink)' }}>
            Android Map Directory
          </div>
        </div>
        <div style={{
          padding: '4px 8px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--paper)',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        }}>v1.0</div>
      </div>
      <div style={{ padding: '12px 18px 16px', borderTop: '1px solid var(--hairline)' }}>
        <p style={{
          margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)',
          textWrap: 'pretty',
        }}>
          Direktori berbasis peta untuk menemukan unit kampus — departemen, PAA,
          kemahasiswaan, vokasi, kesehatan, dan lab — lengkap dengan gedung, lantai,
          jam layanan, dan rute langsung.
        </p>
      </div>
    </div>
  );
}

function I_StatCard({ value, unit, label }) {
  return (
    <div style={{
      flex: 1, padding: '14px 12px', borderRadius: 14,
      border: '1px solid var(--hairline)', background: 'var(--paper)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
        textTransform: 'uppercase', letterSpacing: 1.2,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8,
          color: 'var(--ink)', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>{unit}</span>
      </div>
    </div>
  );
}

function I_CategoryRow({ c, count, last }) {
  const G = Glyph[c.glyph];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--hairline)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
        color: 'var(--route-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <G width={20} height={20}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.1 }}>
            {c.label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-2)' }}>
            {String(count).padStart(2, '0')} unit
          </span>
        </div>
        <div style={{ marginTop: 3, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45 }}>
          {CATEGORY_DESC[c.id] ?? '—'}
        </div>
      </div>
      <Icon.chev width={14} height={14} style={{ color: 'var(--ink-3)', marginTop: 12 }}/>
    </div>
  );
}

function I_ActionRow({ label, sub, glyph = 'info', mono, last }) {
  const I = Icon[glyph];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--hairline)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'var(--paper-2)', color: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I width={15} height={15}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{label}</div>
        {sub && (
          <div style={{
            marginTop: 1, fontSize: 11, color: 'var(--ink-3)',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          }}>{sub}</div>
        )}
      </div>
      <Icon.chev width={14} height={14} style={{ color: 'var(--ink-3)' }}/>
    </div>
  );
}

function I_DataHealth() {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14,
      background: 'var(--route-tint)',
      border: '1px solid color-mix(in oklab, var(--route) 18%, transparent)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 999,
        background: 'var(--route)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
      }}>✓</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--route-ink)' }}>Data sinkron</div>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
          terakhir diperbarui · 09:14 hari ini
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--route-ink)' }}>Segarkan</span>
    </div>
  );
}

function InfoScreen() {
  const counts = {};
  UNITS.forEach((u) => { counts[u.cat] = (counts[u.cat] ?? 0) + 1; });
  const buildings = new Set(UNITS.map((u) => u.building)).size;
  const cats = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <PhoneShell time="9:38">
      <div style={{
        padding: '4px 18px 12px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)',
            letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Info · Aplikasi
          </div>
          <div style={{ marginTop: 4, fontSize: 22, fontWeight: 800, letterSpacing: -0.6,
            lineHeight: 1.1 }}>
            Tentang & Kategori
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'var(--paper-2)', border: '1px solid var(--hairline-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)',
        }}>
          <Icon.search width={15} height={15}/>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 14 }}>
        <I_BrandCard/>

        <div style={{ display: 'flex', gap: 8 }}>
          <I_StatCard value={UNITS.length} unit="unit"   label="Total"/>
          <I_StatCard value={buildings}    unit="gedung" label="Gedung"/>
          <I_StatCard value={cats.length}  unit="kat."   label="Kategori"/>
        </div>

        <I_DataHealth/>

        <div>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            margin: '6px 2px 6px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2 }}>Kategori unit</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
              {cats.length} kategori
            </div>
          </div>
          <div style={{
            border: '1px solid var(--hairline)', borderRadius: 14,
            background: 'var(--paper)', padding: '0 14px',
          }}>
            {cats.map((c, i) => (
              <I_CategoryRow
                key={c.id} c={c} count={counts[c.id] ?? 0}
                last={i === cats.length - 1}
              />
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2,
            margin: '6px 2px 6px' }}>
            Lainnya
          </div>
          <div style={{
            border: '1px solid var(--hairline)', borderRadius: 14,
            background: 'var(--paper)', overflow: 'hidden',
          }}>
            <I_ActionRow label="Bantuan & FAQ"   sub="Cara pakai, izin GPS, masalah umum"   glyph="info"/>
            <I_ActionRow label="Berikan masukan" sub="Kirim saran atau laporkan data salah" glyph="star"/>
            <I_ActionRow label="Sumber data"     sub="BAA & Pusat Sistem Informasi"         glyph="pin"/>
            <I_ActionRow label="Versi aplikasi"  sub="1.0.0 · build 2026.05.17" glyph="sliders" mono last/>
          </div>
        </div>

        <div style={{
          padding: '8px 4px 4px', textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
          lineHeight: 1.6,
        }}>
          Proyek Mata Kuliah Cloud Computing<br/>
          React Native · Node.js · MySQL · Cloud
        </div>
      </div>

      <H_BottomTab active="info"/>
    </PhoneShell>
  );
}

window.InfoScreen = InfoScreen;
