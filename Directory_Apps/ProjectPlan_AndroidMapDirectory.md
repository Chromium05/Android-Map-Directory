# Android Map Directory — Project Plan
**PRODUCT REQUIREMENTS DOCUMENT · Cloud Computing 2026**

| | |
|---|---|
| **Mulai** | 18 Mei 2026 |
| **Deadline** | 15 Jun 2026 |
| **Durasi** | 4 Minggu |
| **Tim** | 5 Orang |
| **Status** | HiFi ✓ |

**PM:** Artha · **Tim:** Daffa · Abiddar · Wedha · Fahad
**Versi** 1.0 · Mei 2026

---

## 1. Struktur Tim

Lima anggota tim dengan pembagian peran. Artha sebagai PM merangkap DB & Backend.

| Nama | Peran | Tag |
|---|---|---|
| **Artha** | Product Manager (PM) · Database Engineer · Backend Engineer (Node.js) | PM · DB · BE |
| **Daffa Surya** | Front End Web Developer · Admin Dashboard UI · Web Interface | Front End Web |
| **Abiddar** | Front End Mobile Developer · React Native App · Android UI/UX | Front End Mobile |
| **Wedha** | Project Management Office · Timeline & Risk Monitoring · Dokumentasi PMO | PMO |
| **Fahad** | Project Management Office · Koordinasi & Komunikasi · Testing QA | PMO |

### Matriks Tanggung Jawab (RACI)

| Deliverable | Artha | Daffa | Abiddar | Wedha | Fahad |
|---|---|---|---|---|---|
| Database Design & Supabase | R/A | - | - | C | C |
| REST API (Node.js) | R/A | - | I | C | C |
| Backend Cloud Deploy | R/A | - | I | I | I |
| Admin Web Dashboard | C | R/A | - | I | I |
| React Native Mobile App | C | - | R/A | I | I |
| GPS & Map Integration | C | - | R/A | - | - |
| HiFi Design (selesai) | R/A | C | C | I | I |
| Timeline & Dokumentasi | A | I | I | R | R |
| QA Testing & Demo HP | A | C | C | R | R |

**R** = Responsible · **A** = Accountable · **C** = Consulted · **I** = Informed

---

## 2. Timeline & Task Plotting (4 Minggu)

> Deadline: 15 Jun. HiFi + Design Style sudah selesai. Minggu 1 dimulai 18 Mei — Artha mulai DB Design + Supabase.

### Minggu 1 [18 Mei – 24 Mei]

| Siapa | Task | Area | Note |
|---|---|---|---|
| Artha | DB Schema Design (tabel units, buildings, categories, rooms) | DB | ★ prioritas |
| Artha | Setup Supabase project + seed 9+ unit kampus (lat/lng/floor) | DB | |
| Artha | Boilerplate Node.js + koneksi Supabase | BE | |
| Daffa | Review PRD + Setup project web (Next.js / Vite) | WEB | |
| Abiddar | Setup Expo SDK 51+ + install deps (maps, location, axios, nav) | MOB | |
| Wedha | Buat project board + tracking sheet minggu 1 | PMO | |
| Fahad | Template dokumentasi + laporan progress mingguan | PMO | |

### Minggu 2 [25 Mei – 31 Mei]

| Siapa | Task | Area | Note |
|---|---|---|---|
| Artha | REST API lengkap: GET /units, /units/:id, /categories, /buildings | BE | |
| Artha | Filter ?category= ?building=, validasi, error handling | BE | |
| Artha | Deploy ke Railway/Render + CORS + HTTPS + Postman Collection | BE deploy | ★ |
| Daffa | Admin web: form tambah/edit unit (gedung, lantai, koordinat) | WEB | |
| Abiddar | Koneksi API → FlatList unit + FloorBadge + StatusPill | MOB | |
| Abiddar | HomeScreen: search bar + filter chip kategori | MOB | |
| Wedha | Review progress + update timeline jika ada blocker | PMO | |
| Fahad | Testing API Postman dari jaringan luar (bukan localhost) | PMO | |

### Minggu 3 [1 Jun – 7 Jun]

| Siapa | Task | Area | Note |
|---|---|---|---|
| Artha | Optimasi query DB + index + review kelengkapan data unit | DB | |
| Artha | Support integrasi mobile ↔ API (debug bersama Abiddar) | BE | |
| Daffa | Admin web: daftar unit + delete + validasi + polish UI | WEB | |
| Abiddar | MapScreen: MapView + marker + callout (Gedung · Lt.) | MOB | |
| Abiddar | GPS: expo-location + Haversine distance + format jarak di card | MOB | ★ GPS |
| Abiddar | DetailScreen: hero photo, FloorBadge prominent, jam layanan | MOB | |
| Wedha | Risk log + minta test GPS di HP fisik | PMO | |
| Fahad | Koordinasi demo internal + checklist testing GPS | PMO | |

### Minggu 4 [8 Jun – 14 Jun] ← DEADLINE 15 Jun

| Siapa | Task | Area | Note |
|---|---|---|---|
| Artha | Final check DB: 9+ unit, 6 gedung, 6 kategori valid | DB | |
| Artha | Diagram arsitektur sistem (final) + laporan singkat | PM | |
| Daffa | Deploy admin web ke Vercel/Netlify + screenshot/video | WEB | |
| Abiddar | Tombol Buka Rute → Google Maps Linking + sub-ruangan list | MOB | |
| Abiddar | InfoScreen + error/loading/empty state + polish seluruh UI | MOB | |
| Abiddar | Build APK + testing HP fisik end-to-end + video demo | MOB | ★ demo |
| Wedha | Kompilasi dokumentasi final + slide presentasi | PMO | |
| Fahad | QA checklist full + laporan testing + review presentasi | PMO | |

---

## 3. Deliverable & Status

| Deliverable | PIC | Minggu | Status |
|---|---|---|---|
| HiFi Design + Design Style | Artha | Pre-W1 | ✅ SELESAI |
| DB Schema Design (Supabase) | Artha | W1 | 🔄 Mulai Senin |
| Supabase Setup + Seed Data | Artha | W1 | 🔄 Mulai Senin |
| REST API (Node.js) | Artha | W2 | ⏳ Menunggu DB |
| Backend Cloud Deploy | Artha | W2 | ⬜ Belum Mulai |
| Admin Web Dashboard | Daffa Surya | W2–W4 | ⬜ Belum Mulai |
| React Native Home + Map Screen | Abiddar | W1–W3 | 🔄 Setup W1 |
| GPS + Haversine Integration | Abiddar | W3 | ⬜ Belum Mulai |
| Detail Screen + Buka Rute | Abiddar | W3–W4 | ⬜ Belum Mulai |
| Dokumentasi & Laporan | Wedha + Fahad | W1–W4 | 🔄 Template W1 |
| APK + Video Demo HP Fisik | Abiddar + Tim | W4 | ⬜ Belum Mulai |
| Slide Presentasi | Wedha + Fahad | W4 | ⬜ Belum Mulai |

---

## 4. Risiko & Mitigasi

| Risiko | Impact | PIC | Mitigasi |
|---|---|---|---|
| GPS tidak akurat di indoor | Med | Abiddar | Test outdoor; fallback tanpa GPS |
| Supabase rate limit / latency | High | Artha | Caching response + connection pooling |
| react-native-maps setup error | High | Abiddar | Expo managed + Google Maps key Android |
| Data unit kampus tidak lengkap | Med | Artha + PMO | Survey manual + seed 6 kategori wajib |
| Backend deploy timeout/gagal | High | Artha | Railway primary, Render sebagai backup |
| Waktu 4 minggu terlalu sempit | High | Wedha + Fahad | Fokus MVP; nice-to-have dipotong |

---

## 5. Tech Stack

| Layer | Teknologi | PIC | Catatan |
|---|---|---|---|
| Mobile | React Native (Expo SDK 51+) | Abiddar | Android target |
| Maps & GPS | react-native-maps + expo-location | Abiddar | Google Maps Provider |
| HTTP / Nav | axios + React Navigation | Abiddar | Stack + Bottom Tabs |
| Backend | Node.js + Express | Artha | REST API, CORS, HTTPS |
| Database | Supabase (PostgreSQL) | Artha | Cloud, row-level security |
| Deploy BE | Railway / Render | Artha | Accessible dari HP real |
| Admin Web | Next.js / Vite + Tailwind | Daffa | CRUD unit kampus |
| Deploy Web | Vercel / Netlify | Daffa | |
