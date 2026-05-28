# 🎨 Design.md — Android Map Directory

> **Design System & Screen Spec** · Versi **1.0** · Mei 2026
> Pendamping `PRD_Android_Map_Directory.md` v1.2 · Mata Kuliah Cloud Computing

Dokumen ini menjelaskan **arah visual, token, komponen, dan layout per-screen** untuk implementasi React Native. Untuk preview interaktif lihat file `Android Map Directory.html`.

---

## 📑 Daftar Isi

1. [Arah Desain (Aesthetic Direction)](#1-arah-desain)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Iconography](#4-iconography)
5. [Komponen](#5-komponen)
6. [Spacing · Radius · Elevation](#6-spacing--radius--elevation)
7. [Layout per Screen](#7-layout-per-screen)
8. [Voice & Copywriting](#8-voice--copywriting)
9. [Aksesibilitas](#9-aksesibilitas)
10. [Mapping ke React Native](#10-mapping-ke-react-native)
11. [File Reference](#11-file-reference)

---

## 1. Arah Desain

**Modern utility · warm neutral · wayfinding green.**

Aplikasi direktori kampus harus terasa **fungsional, jelas, dan tidak mainan**. Pilihan-pilihan kuncinya:

| Aspek | Pilihan | Alasan |
|---|---|---|
| **Palette** | Warm off-white + ink hampir-hitam + 1 accent hijau | Hijau = wayfinding (jalur peta), warm white menghindari kesan steril ala app medical |
| **Tipografi** | Plus Jakarta Sans (display & body) + JetBrains Mono (metadata) | Jakarta Sans punya feel ramah-Indonesia tapi tetap tegas; Mono memberi feel "data" untuk jarak, koordinat, lantai |
| **Sudut** | Radius medium (10–18px) untuk card, pill (999px) untuk chip/badge | Sudut bulat sedang = modern tanpa imut |
| **Density** | Cukup padat (padding 14–18px), font 12–16 untuk body | Banyak info per layar tanpa terasa sempit |
| **Iconography** | Single-stroke 1.8px pada grid 24×24 | Konsisten dengan tone Material 3 modern |

**Yang dihindari:** Material default biru, gradien neon, drop shadow tebal, emoji sebagai pengganti ikon, banyak warna aksen, ilustrasi karakter.

---

## 2. Color Tokens

Semua warna ditulis dalam **oklch** (perceptual lightness, hue, chroma). Untuk RN, konversi ke hex bila perlu — atau gunakan `react-native-color-matrix` / library yang mendukung oklch.

### Surface — warm neutrals

| Token | oklch | Hex setara | Pakai untuk |
|---|---|---|---|
| `--paper` | `0.985 0.004 95` | `#fcfaf6` | Background utama, card |
| `--paper-2` | `0.965 0.006 95` | `#f5f1eb` | Card alternate, chip default |
| `--paper-3` | `0.935 0.008 95` | `#ece6dd` | Photo placeholder fill |
| `--hairline` | `0.905 0.008 95` | `#e0d9cf` | Divider 1px |
| `--hairline-2` | `0.85 0.010 95` | `#cdc3b5` | Border stronger |

### Ink — text & icons

| Token | oklch | Hex setara | Pakai untuk |
|---|---|---|---|
| `--ink` | `0.20 0.012 150` | `#1c2520` | Primary text, ink fill |
| `--ink-2` | `0.42 0.010 150` | `#4d5751` | Secondary text |
| `--ink-3` | `0.62 0.008 150` | `#838c87` | Tertiary, placeholder |

### Accent — wayfinding green

| Token | oklch | Hex setara | Pakai untuk |
|---|---|---|---|
| `--route` | `0.62 0.16 150` | `#1ba775` | Primary CTA (Buka Rute), user pin |
| `--route-ink` | `0.32 0.10 150` | `#1c5a40` | Green text on light bg, floor `Lt.` |
| `--route-tint` | `0.95 0.04 150` | `#dff5e9` | Banner wash background |

### Status

| Token | oklch | Hex setara | Pakai untuk |
|---|---|---|---|
| `--open` | `0.62 0.16 150` | `#1ba775` | `Buka` pill |
| `--warning` | `0.72 0.15 70` | `#d99a3a` | `Tutup 30m lagi` |
| `--closed` | `0.58 0.16 30` | `#c2553d` | `Tutup` |

### Aturan Penggunaan
- **Tidak ada gradient kompleks.** Linear gradient hijau-ke-paper hanya di brand card Info screen.
- **Kontras minimum 4.5:1** untuk teks body terhadap background.
- Untuk dark mode (Nice to Have, belum di-spec di v1.0), invert: `--paper` ↔ `--ink`, `--paper-2` ↔ `--ink-2`.

---

## 3. Typography

### Family

| Family | Font | Pakai untuk |
|---|---|---|
| **Sans** | `Plus Jakarta Sans` (400 / 500 / 600 / 700 / 800) | Semua teks UI |
| **Mono** | `JetBrains Mono` (400 / 500 / 600) | Metadata: jarak, koordinat, lantai, jam, kode |

> **Fallback RN:** `'PlusJakartaSans-Regular'` (load via `expo-font`), fallback `system-ui`.

### Skala

| Tag | Sample | Size | Weight | Letter-spacing | Pakai untuk |
|---|---|---|---|---|---|
| **Display** | "Mau ke unit mana hari ini?" | 26 sp | 800 | −0.8 | Header beranda |
| **Title L** | "Terdekat dari kamu" | 20 sp | 800 | −0.4 | Section header |
| **Title M** | "Dept. Teknik Informatika" | 16 sp | 700 | −0.2 | Nama unit di card featured |
| **Body** | Deskripsi unit | 14 sp | 500 | 0 | Paragraf, deskripsi |
| **Caption** | "Gedung TI · 08:00 – 16:00" | 12 sp | 500 | 0 | Metadata kecil |
| **Mono · Meta** | "Lt. 3 · 120 m · −7.2575, 112.7521" | 12 sp | 500 mono | 0 | Jarak, koordinat, lantai |
| **Mono · Tag** | "DIREKTORI · KAMPUS" | 11 sp | 600 mono | 1.5 (uppercase) | Eyebrow tag, label section |

### Aturan
- **Maks 3 weight per screen** (mis. 800 / 600 / 500). Hindari pakai semua weight sekaligus.
- **Mono hanya untuk data/metadata** — bukan untuk paragraf. Kalau bingung, pakai sans.
- Line-height: display 1.05, title 1.2, body 1.5, caption 1.4.

---

## 4. Iconography

**Spec:** SVG, grid 24 × 24, stroke 1.8 px, `stroke-linecap="round"`, `stroke-linejoin="round"`, single weight.

### UI Icons (sistem)

| Key | Pakai untuk |
|---|---|
| `search` | Field pencarian |
| `pin` / `pinFill` | Marker peta, lokasi, logomark |
| `locate` | "Lokasi kamu" / GPS button |
| `map` | Tab Peta, tombol Buka Rute |
| `home` / `homeFill` | Tab Beranda |
| `info` | Tab Info |
| `arrow` | CTA "Buka rute →" |
| `chev` | Forward navigation, list item |
| `star` | Rating |
| `sliders` | Filter |

### Category Glyphs

Setiap kategori punya 1 glyph konsisten:

| Kategori | Glyph | Visual |
|---|---|---|
| Departemen | `dept` | Pillar / academic building |
| PAA | `paa` | Dokumen / form |
| Kemahasiswaan | `kemahasiswaan` | Grup orang |
| Vokasi | `vokasi` | Wrench / applied skill |
| Kesehatan | `kesehatan` | Cross dalam square |
| Lab | `lab` | Flask |
| Semua (filter all) | `all` | 4 dot grid |

**Aturan:**
- Jangan campur dengan icon library lain (Material Icons, FontAwesome) — pakai set glyph custom ini agar konsisten.
- Untuk RN, simpan SVG di `assets/icons/` dan load via `react-native-svg`.

---

## 5. Komponen

Daftar komponen kunci, kontrak props-nya, dan kapan dipakai.

### 5.1 FloorBadge ⭐ _(komponen pembeda di app ini)_

**Pill split-pill: gedung di kiri (paper-2 fill, ink text), lantai di kanan (ink fill, paper text, mono).**

```jsx
<FloorBadge building="Gedung TI" floor="Lt. 3" />          // default split pill
<FloorBadge building="Gedung TI" floor="Lt. 3" compact />  // inline, 1 baris ringkas
```

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `building` | string | wajib | Nama gedung lengkap |
| `floor` | string | wajib | `Lt. X` |
| `compact` | bool | `false` | Inline mode untuk row yang padat |

**Pakai di:** card unit (featured + list), callout map, detail screen overlay, sub-ruangan list.

---

### 5.2 StatusPill

Dot indikator + label.

```jsx
<StatusPill status="open" />      // hijau "Buka"
<StatusPill status="soon" />      // oranye "Tutup 30m"
<StatusPill status="closed" />    // merah "Tutup"
<StatusPill status="open" label="Buka 24 jam" />  // override label
```

---

### 5.3 Distance

```jsx
<Distance value="120" unit="m" />
<Distance value="1.2" unit="km" />
```

- `value` mono, **bold**, ink penuh
- `unit` mono, regular, ink-2

---

### 5.4 SearchBar

| Prop | Tipe | Default |
|---|---|---|
| `placeholder` | string | `"Cari unit, gedung, atau lantai"` |
| `value` | string | — |
| `onChange` | fn | — |
| `trailing` | node | filter sliders icon |

Spec: tinggi 48dp, radius 14, bg `--paper-2`, border `--hairline`, icon left.

---

### 5.5 CategoryChip / CategoryRow

Chip pill 34dp dengan glyph + label. Default: bg `--paper`, border `--hairline-2`. Active: bg `--ink`, text `--paper`.

```jsx
<CategoryRow active="Departemen" categories={CATEGORIES} onChange={fn} />
```

`ScrollView horizontal`, `showsHorizontalScrollIndicator={false}`.

---

### 5.6 UnitCard (2 varian)

#### Featured (digunakan di top of Home list)
- Photo hero 120dp tinggi
- Category tag overlay top-left
- **FloorBadge overlay bottom-right** di atas foto
- Title + Distance
- Status + jam + Buka Rute CTA (ink pill)

#### List Row (compact)
- Thumbnail 56dp dengan glyph
- Title + Distance
- **FloorBadge compact**
- Status pill + hours + `Rute >` link

```jsx
<UnitCard unit={u} variant="featured" />
<UnitCard unit={u} variant="row" last />
```

---

### 5.7 BottomTab

3 tab: Beranda · Peta · Info. Active state: ink pill di belakang icon, label bold.

---

### 5.8 PhoneShell

Kontainer 380 × 780, status bar 28dp, gesture nav bar 18dp, border ink 8px, radius 32. Hanya untuk **mockup** — tidak ada di RN production.

---

### 5.9 Map Pin (untuk MapScreen)

| State | Visual |
|---|---|
| Default (visible filter) | Pin droplet hijau `--route` + glyph putih, drop-shadow |
| Selected | Pin droplet ink besar (46dp) + glyph dalam circle paper, drop-shadow lebih kuat |
| Dimmed (di luar filter) | Dot 12dp `--paper` + border `--ink-3` |
| User location | Dot hijau 18dp + halo `--route` 22% opacity |

---

### 5.10 Callout

Tooltip ink di atas selected pin. Berisi `short_name` + `Building · Lt. X` mono. Tail ↓ di tengah bawah.

---

### 5.11 Bottom Sheet (Map screen)

Border-top-radius 22dp, drag handle 40×4dp di atas, padding 14–18dp.

Berisi:
- Header: kategori (mono uppercase) + distance
- Title (Title M)
- FloorBadge + StatusPill + hours
- Action row: secondary `Detail` + primary `Buka Rute`

---

### 5.12 InfoRow (Detail screen)

Icon-box 32 × 32 + label mono uppercase + value (sans atau mono).

```jsx
<InfoRow icon="pin" label="Lokasi" value="Gedung TI · Lt. 3" accent />
<InfoRow icon="locate" label="Koordinat" value="−7.27543, 112.79742" mono />
```

---

### 5.13 Buka Rute CTA

Primary button:
- Full width (atau flex-grow)
- Tinggi 48dp
- Radius 12–14
- Bg `--route`
- Teks putih bold 15sp
- Icon `map` 18×18
- Shadow `--shadow-fab`

---

## 6. Spacing · Radius · Elevation

### Spacing scale (base 4dp)
`4, 8, 12, 16, 20, 24, 32`

- Padding screen-edge: **16dp**
- Gap card-to-card: **12–16dp**
- Padding internal card: **12–18dp**
- Gap icon-text: **6–10dp**

### Radius

| Token | Px | Pakai |
|---|---|---|
| `--r-xs` | 6 | Tag kecil |
| `--r-sm` | 10 | Icon container |
| `--r-md` | 14 | Card, search, button |
| `--r-lg` | 20 | Featured card, bottom sheet |
| `--r-pill` | 999 | Chip, status pill, FAB |

### Elevation

| Token | Value | Pakai |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(20,30,25,.04), 0 1px 1px rgba(20,30,25,.03)` | Card lift halus |
| `--shadow-2` | `0 6px 16px -8px rgba(20,30,25,.12), 0 2px 6px -2px rgba(20,30,25,.06)` | FAB, callout, bottom sheet |
| `--shadow-fab` | `0 10px 24px -8px rgba(0,90,55,.35), 0 2px 6px rgba(0,90,55,.18)` | Tombol Buka Rute (warna hijau, jadi shadow ikut hijau) |

> **RN:** Gunakan `elevation` (Android) + `shadow*` (iOS). Tabel mapping ada di section 10.

---

## 7. Layout per Screen

### 7.1 Beranda (Home)

```
┌─────────────────────────────────┐
│  9:30                  ●●● 92%  │  status bar
├─────────────────────────────────┤
│  DIREKTORI · KAMPUS         (R) │  eyebrow + avatar
│  Mau ke unit mana                │
│  hari ini?                       │  display 26/800
├─────────────────────────────────┤
│  🔍 Cari unit, gedung, lantai ⚙│  search 48dp
│  📍 Lokasi kamu          [Ubah] │  status strip (route-tint)
│  [All][Dept][PAA][Kmhs][Vok]... │  chips horizontal scroll
│                                 │
│  Terdekat dari kamu  urut·jrk ↑ │
│  ┌───────────────────────┐      │
│  │ [foto · gedung pusat] │      │  featured card
│  │  Dept • Gedung · Lt.X │      │
│  │  Kantin Pusat A  120m │      │
│  │  ● Buka 07–17  Buka↗  │      │
│  └───────────────────────┘      │
│  ┌──┐ Kafe Literasi    450m     │  list rows
│  │ G│ Gedung·Lt.3              │
│  └──┘ ● Buka 08-22     Rute >   │
│  ─────────────────────────────  │
│  ┌──┐ ATM BNI Plaza    210m    │
│  ...                            │
├─────────────────────────────────┤
│  [🏠]    [🗺️]    [ℹ️]            │  bottom tab
└─────────────────────────────────┘
```

**Aturan:**
- Featured card adalah **unit terdekat #1** (sorted ascending).
- 3 list rows berikutnya tampil tanpa scroll di phone 6".
- FloorBadge muncul di featured (overlay) dan list row (inline compact).

---

### 7.2 Peta (Map)

```
┌─────────────────────────────────┐
│  9:32                  ●●● 92%  │
├─────────────────────────────────┤
│ ← Peta·Kampus     N unit       🔍│  compact header
├─────────────────────────────────┤
│ [Dept][PAA][Kmhs]…   ┌────┐    │  chip row + FABs
│                      │ ⊙  │    │
│  📍 📍 📍              │ +  │    │  map canvas
│       (●)              │ −  │    │  user dot + pins
│  📍                   └────┘    │
│   ┌──────────┐                  │
│   │Callout↓  │                  │  callout above selected
│   └─pin──────┘                  │
│                                 │
├─ Bottom sheet ──────────────────┤
│   ───────                        │  drag handle
│  [icon] DEPARTEMEN      120 m   │
│  Dept. Teknik Informatika       │
│  [G.TI|Lt.3] ● Buka  08-16     │
│  [Detail]      [🗺 Buka Rute]   │
├─────────────────────────────────┤
│  [🏠]    [🗺️]    [ℹ️]            │
└─────────────────────────────────┘
```

**Aturan:**
- Map area mengambil sisa space antara header dan bottom tab.
- Pin selected ditampilkan paling atas (z-index).
- Bottom sheet tidak menutupi user dot atau selected pin.

---

### 7.3 Detail (Detail)

```
┌─────────────────────────────────┐
│  9:34                  ●●● 92%  │
├─────────────────────────────────┤
│ [←]               [★] [⋯]      │  floating top bar
│                                 │
│  [Hero photo 220dp]              │
│  [G.TI | Lt.3]                  │  floor badge overlay
├─────────────────────────────────┤
│  📋 DEPARTEMEN       ★ 4.5 ·124│  eyebrow + rating
│  Departemen Teknik              │  H1 22/800
│  Informatika                    │
│  ● Buka · 120 m dari kamu · ~3m│
│                                 │
│  Kantor departemen untuk admin  │  description
│  akademik mahasiswa S1 — KRS…  │
│                                 │
│  [📍] LOKASI                    │  info rows
│       Gedung TI · Lt. 3         │
│  [ℹ]  ALAMAT                   │
│       Jl. Teknik Kampus Blok F  │
│  [★]  JAM LAYANAN               │
│       08:00 – 16:00             │
│  [⊙]  KOORDINAT                 │
│       −7.27543, 112.79742       │
│                                 │
│  Ruangan di unit ini      3 ruang│
│  ┌─────────────────────────┐    │
│  │ Ruang Kaprodi   Lt.3·R301│    │
│  │ Sekretariat     Lt.3·R302│    │
│  │ Ruang Dosen   Lt.3·R310 │    │
│  └─────────────────────────┘    │
│                                 │
│  [Kontak]  [Situs]              │  quick actions
├─────────────────────────────────┤
│  [📍] [🗺 Buka Rute · 120 m]   │  sticky CTA bar
└─────────────────────────────────┘
```

**Aturan:**
- Top bar floating di atas hero (blur background).
- Floor badge **overlay** di atas hero photo (kiri bawah).
- Body scroll, CTA bar tetap di bawah (sticky).
- Daftar sub-ruangan menonjolkan `lantai · nomor ruang` mono.

---

### 7.4 Info

```
┌─────────────────────────────────┐
│  9:38                  ●●● 92%  │
├─────────────────────────────────┤
│  INFO · APLIKASI            🔍 │
│  Tentang & Kategori             │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │ [logo] Direktori·Kampus │    │  brand card
│  │        Android Map Dir. │    │
│  │                  [v1.0] │    │
│  │  Direktori berbasis…    │    │
│  └─────────────────────────┘    │
│                                 │
│  [Total][Gedung][Kategori]      │  stats row (3 col)
│   9 unit  6      6 kat.         │
│                                 │
│  ✓ Data sinkron · 09:14 [Segarkan]│
│                                 │
│  Kategori unit         6 kategori│
│  ┌─────────────────────────┐    │
│  │ [G] Departemen   03 unit >│    │
│  │     Kantor admin prodi… │    │
│  │ [G] PAA          01 unit >│    │
│  │     Pelayanan akademik… │    │
│  │ ...                     │    │
│  └─────────────────────────┘    │
│                                 │
│  Lainnya                        │
│  ┌─────────────────────────┐    │
│  │ ℹ Bantuan & FAQ        >│    │
│  │ ★ Berikan masukan      >│    │
│  │ 📍 Sumber data         >│    │
│  │ ⚙ Versi 1.0.0          >│    │
│  └─────────────────────────┘    │
│                                 │
│  Proyek Mata Kuliah Cloud       │  credit
│  RN · Node · MySQL · Cloud      │
├─────────────────────────────────┤
│  [🏠]    [🗺️]    [ℹ️ aktif]      │
└─────────────────────────────────┘
```

---

## 8. Voice & Copywriting

**Bahasa Indonesia · ramah, ringkas, fungsional.** Aplikasi ini dipakai mahasiswa, bukan dosen — tone harus santai tapi tetap informatif.

### Tulis seperti ini ✓
- "Mau ke unit mana hari ini?"
- "Buka rute" (bukan "Navigasikan")
- "Dept. TI · Gedung TI · Lt. 3 · 120 m"
- "GPS-mu mati. Aktifkan untuk lihat jarak."
- "Belum ada unit di kategori ini."

### Hindari ✗
- Bahasa formal kaku ("Anda dipersilakan untuk memilih…")
- Jargon teknis ("Inisialisasi geolokasi", "Koneksi terputus dengan endpoint")
- Caps lock atau tanda seru ganda
- Emoji acak yang bukan bagian ikonografi

### Microcopy state

| State | Copy |
|---|---|
| GPS denied | "Tanpa GPS, jarak tidak bisa dihitung. Aktifkan di Setelan?" + tombol Setelan |
| Offline | "Sedang offline. Data terakhir mungkin tidak terbaru." (banner kuning) |
| Empty filter | "Belum ada unit di kategori ini." + tombol "Lihat semua" |
| Loading | "Memuat unit…" + ActivityIndicator |
| Error fetch | "Gagal memuat data. Cek koneksi, lalu coba lagi." + tombol "Coba lagi" |

---

## 9. Aksesibilitas

| Aturan | Implementasi RN |
|---|---|
| Touch target ≥ 48 × 48 dp | `minHeight: 48, minWidth: 48` di TouchableOpacity |
| Kontras teks ≥ 4.5:1 | Pakai `--ink` (#1c2520) atau lebih gelap di atas `--paper` |
| Semua interaktif punya label | `accessibilityLabel="Buka rute ke Departemen TI, jarak 120 meter"` |
| Role yang tepat | `accessibilityRole="button"` di CTA |
| Floor & status tidak hanya warna | Pakai teks + dot + ikon, bukan warna saja (untuk colorblind) |
| Font scaling | Pakai `sp` units, hormati system font scale Android |

---

## 10. Mapping ke React Native

### Tokens → StyleSheet

```js
// theme.js
export const C = {
  paper:      '#fcfaf6',
  paper2:     '#f5f1eb',
  paper3:     '#ece6dd',
  hairline:   '#e0d9cf',
  hairline2:  '#cdc3b5',
  ink:        '#1c2520',
  ink2:       '#4d5751',
  ink3:       '#838c87',
  route:      '#1ba775',
  routeInk:   '#1c5a40',
  routeTint:  '#dff5e9',
  open:       '#1ba775',
  warning:    '#d99a3a',
  closed:     '#c2553d',
};

export const R = { xs: 6, sm: 10, md: 14, lg: 20, pill: 999 };
export const S = { '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32 };
export const F = { sans: 'PlusJakartaSans-Regular', mono: 'JetBrainsMono-Regular' };
```

### Shadow → elevation

```js
const shadow = {
  card: Platform.select({
    android: { elevation: 1 },
    ios: { shadowColor: '#141e19', shadowOpacity: 0.04, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  }),
  fab: Platform.select({
    android: { elevation: 6 },
    ios: { shadowColor: '#005a37', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 10 } },
  }),
};
```

### Font loading (Expo)

```js
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Bold':    require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('./assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  'JetBrainsMono-Regular':   require('./assets/fonts/JetBrainsMono-Regular.ttf'),
  'JetBrainsMono-Medium':    require('./assets/fonts/JetBrainsMono-Medium.ttf'),
});
```

### Komponen → file RN

| Component (design) | File RN yang disarankan |
|---|---|
| `FloorBadge` | `src/components/FloorBadge.jsx` |
| `StatusPill` | `src/components/StatusPill.jsx` |
| `Distance` | `src/components/Distance.jsx` |
| `UnitCard` | `src/components/UnitCard.jsx` (varian `featured` / `row` via prop) |
| `CategoryChip` | `src/components/CategoryChip.jsx` |
| `BottomTab` | `react-navigation` `createBottomTabNavigator` |
| Glyph icons | `src/components/icons/*.jsx` (pakai `react-native-svg`) |

---

## 11. File Reference

| File | Isi |
|---|---|
| `Android Map Directory.html` | Preview interaktif semua screen + style guide (buka di browser) |
| `tokens.css` | Token CSS untuk preview HTML |
| `atoms.jsx` | Icon set, glyph set, FloorBadge, StatusPill, Distance, PhotoSlot |
| `data.jsx` | Sample data 9 unit kampus (UNITS, CATEGORIES) |
| `home-screen.jsx` | Mockup Beranda |
| `map-screen.jsx` | Mockup Peta + denah kampus SVG + pins + bottom sheet |
| `detail-screen.jsx` | Mockup Detail unit + sub-ruangan |
| `info-screen.jsx` | Mockup Info + kategori + bantuan |
| `style-guide.jsx` | Mockup style guide (color, type, icon, components) |
| `PRD_Android_Map_Directory.md` | PRD v1.2 |
| `Design.md` | Dokumen ini |

---

*Design.md · Versi 1.0 · Mei 2026*
*Disusun bersama PRD_Android_Map_Directory.md v1.2 — Cloud Computing*
