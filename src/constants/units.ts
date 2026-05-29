// ─────────────────────────────────────────────────────────────
// Campus units data — departments, programs, admin offices, labs.
// Each unit has building + floor, hours, distance from user, and a
// coordinate. The `coord` (x/y on a 380×600 plan) is preserved from the
// design; `geo` is derived from it for the real map (see `unitGeo`).
// ─────────────────────────────────────────────────────────────

export type GlyphName =
  | 'all'
  | 'dept'
  | 'kesehatan'
  | 'vokasi'
  | 'paa'
  | 'kemahasiswaan'
  | 'lab';

export type UnitStatus = 'open' | 'closed' | 'soon';

export type SubRoom = { name: string; loc: string };

export type Unit = {
  id: number;
  name: string;
  short: string;
  cat: string;
  glyph: GlyphName;
  building: string;
  floor: string;
  addr: string;
  hours: string;
  status: UnitStatus;
  dist: string;
  distUnit: string;
  rating: number;
  coord: { x: number; y: number };
  desc?: string;
  sub?: SubRoom[];
};

export const UNITS: Unit[] = [
  {
    id: 1,
    name: 'Departemen Teknik Informatika',
    short: 'Dept. TI',
    cat: 'Departemen',
    glyph: 'dept',
    building: 'Gedung TI',
    floor: 'Lt. 3',
    addr: 'Jl. Teknik Kampus Blok F, No. 4',
    hours: '08:00 – 16:00',
    status: 'open',
    dist: '120',
    distUnit: 'm',
    rating: 4.5,
    coord: { x: 252, y: 220 },
    desc: 'Kantor departemen — administrasi akademik mahasiswa S1 TI: KRS, transkrip, surat, bimbingan TA.',
    sub: [
      { name: 'Ruang Kaprodi', loc: 'Lt. 3 · R.301' },
      { name: 'Sekretariat', loc: 'Lt. 3 · R.302' },
      { name: 'Ruang Dosen', loc: 'Lt. 3 · R.310–320' },
    ],
  },
  {
    id: 2,
    name: 'PAA Teknik Informatika',
    short: 'PAA TI',
    cat: 'PAA',
    glyph: 'paa',
    building: 'Gedung TI',
    floor: 'Lt. 2',
    addr: 'Jl. Teknik Kampus Blok F, No. 4',
    hours: '08:00 – 15:30',
    status: 'open',
    dist: '120',
    distUnit: 'm',
    rating: 4.3,
    coord: { x: 252, y: 250 },
    desc: 'Pelayanan Administrasi Akademik departemen — legalisir, surat keterangan aktif, jadwal kuliah.',
  },
  {
    id: 3,
    name: 'Departemen Kesehatan Masyarakat',
    short: 'Dept. Kesmas',
    cat: 'Kesehatan',
    glyph: 'kesehatan',
    building: 'Gedung FKM',
    floor: 'Lt. 2',
    addr: 'Jl. Kesehatan Kampus Blok B, No. 12',
    hours: '08:00 – 16:00',
    status: 'open',
    dist: '480',
    distUnit: 'm',
    rating: 4.4,
    coord: { x: 110, y: 150 },
    desc: 'Departemen Kesehatan Masyarakat — administrasi akademik FKM, ruang kaprodi, sekretariat program studi.',
  },
  {
    id: 4,
    name: 'Departemen Keperawatan',
    short: 'Dept. Kep',
    cat: 'Kesehatan',
    glyph: 'kesehatan',
    building: 'Gedung FK',
    floor: 'Lt. 4',
    addr: 'Jl. Kesehatan Kampus Blok A, No. 1',
    hours: '08:00 – 16:00',
    status: 'open',
    dist: '520',
    distUnit: 'm',
    rating: 4.2,
    coord: { x: 70, y: 200 },
  },
  {
    id: 5,
    name: 'Kemahasiswaan Vokasi',
    short: 'Kemahasiswaan Vokasi',
    cat: 'Kemahasiswaan',
    glyph: 'kemahasiswaan',
    building: 'Gedung Vokasi',
    floor: 'Lt. 1',
    addr: 'Jl. Vokasi Kampus Blok V, No. 8',
    hours: '07:30 – 15:30',
    status: 'soon',
    dist: '340',
    distUnit: 'm',
    rating: 4.1,
    coord: { x: 180, y: 360 },
    desc: 'Unit Kemahasiswaan Sekolah Vokasi — beasiswa, organisasi, kegiatan, layanan konseling mahasiswa.',
  },
  {
    id: 6,
    name: 'Sekretariat Sekolah Vokasi',
    short: 'Sek. Vokasi',
    cat: 'Vokasi',
    glyph: 'vokasi',
    building: 'Gedung Vokasi',
    floor: 'Lt. 2',
    addr: 'Jl. Vokasi Kampus Blok V, No. 8',
    hours: '08:00 – 16:00',
    status: 'open',
    dist: '340',
    distUnit: 'm',
    rating: 4.0,
    coord: { x: 200, y: 380 },
  },
  {
    id: 7,
    name: 'Lab Komputasi & Jaringan',
    short: 'Lab Komputasi',
    cat: 'Lab',
    glyph: 'lab',
    building: 'Gedung TI',
    floor: 'Lt. 4',
    addr: 'Jl. Teknik Kampus Blok F, No. 4',
    hours: '08:00 – 21:00',
    status: 'open',
    dist: '130',
    distUnit: 'm',
    rating: 4.6,
    coord: { x: 280, y: 210 },
  },
  {
    id: 8,
    name: 'Departemen Teknik Sipil',
    short: 'Dept. Sipil',
    cat: 'Departemen',
    glyph: 'dept',
    building: 'Gedung Sipil',
    floor: 'Lt. 2',
    addr: 'Jl. Teknik Kampus Blok G, No. 2',
    hours: '08:00 – 16:00',
    status: 'open',
    dist: '210',
    distUnit: 'm',
    rating: 4.3,
    coord: { x: 305, y: 290 },
  },
  {
    id: 9,
    name: 'Departemen Teknik Mesin',
    short: 'Dept. Mesin',
    cat: 'Departemen',
    glyph: 'dept',
    building: 'Gedung Mesin',
    floor: 'Lt. 1',
    addr: 'Jl. Teknik Kampus Blok G, No. 4',
    hours: '08:00 – 16:00',
    status: 'closed',
    dist: '270',
    distUnit: 'm',
    rating: 4.2,
    coord: { x: 320, y: 340 },
  },
];

export type Category = { id: string; label: string; glyph: GlyphName };

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Semua', glyph: 'all' },
  { id: 'Departemen', label: 'Departemen', glyph: 'dept' },
  { id: 'PAA', label: 'PAA', glyph: 'paa' },
  { id: 'Kemahasiswaan', label: 'Kemahasiswaan', glyph: 'kemahasiswaan' },
  { id: 'Vokasi', label: 'Vokasi', glyph: 'vokasi' },
  { id: 'Kesehatan', label: 'Kesehatan', glyph: 'kesehatan' },
  { id: 'Lab', label: 'Lab', glyph: 'lab' },
];

export const CATEGORY_DESC: Record<string, string> = {
  Departemen: 'Kantor administrasi prodi · sekretariat, kaprodi, dosen.',
  PAA: 'Pelayanan Administrasi Akademik — surat, transkrip, legalisir.',
  Kemahasiswaan: 'Beasiswa, organisasi, konseling, dan kegiatan mahasiswa.',
  Vokasi: 'Sekretariat & unit pendukung Sekolah Vokasi.',
  Kesehatan: 'Departemen rumpun ilmu kesehatan.',
  Lab: 'Laboratorium praktikum, riset, dan komputasi.',
};

// Campus centre — matches the coordinate shown on the design's Detail screen.
export const CAMPUS_CENTER = { latitude: -7.2754, longitude: 112.7974 };

// Span (in degrees) that the 380×600 design plan maps onto.
const PLAN_SPAN_LAT = 0.0065;
const PLAN_SPAN_LNG = 0.0055;

/** Convert a unit's plan coordinate to a real lat/lng around the campus centre. */
export function unitGeo({ x, y }: { x: number; y: number }) {
  return {
    latitude: CAMPUS_CENTER.latitude - (y - 300) / 600 * PLAN_SPAN_LAT,
    longitude: CAMPUS_CENTER.longitude + (x - 190) / 380 * PLAN_SPAN_LNG,
  };
}

/** Sort units ascending by distance from the user (handles m vs km). */
export function byDistance(a: Unit, b: Unit) {
  const meters = (u: Unit) =>
    u.distUnit === 'km' ? parseFloat(u.dist) * 1000 : parseFloat(u.dist);
  return meters(a) - meters(b);
}
