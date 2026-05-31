# 🗺️ PRD — Android Map Directory

> **Product Requirements Document · Mata Kuliah Cloud Computing**
> Versi **1.2** · Mei 2026 · _scope pivot: tempat umum → unit kampus_

---

## 📑 Daftar Isi

1. [Overview Produk](#1-overview-produk)
2. [Konteks & Masalah](#2-konteks--masalah)
3. [Tujuan & Sasaran](#3-tujuan--sasaran)
4. [Pengguna Target](#4-pengguna-target)
5. [Skenario Pengguna](#5-skenario-pengguna)
6. [Fitur & Ruang Lingkup](#6-fitur--ruang-lingkup)
7. [Arsitektur Sistem](#7-arsitektur-sistem)
8. [Desain API](#8-desain-api)
9. [Model Data](#9-model-data)
10. [Alur GPS & Routing](#10-alur-gps--routing)
11. [Stack Teknologi](#11-stack-teknologi)
12. [Panduan UI Mobile](#12-panduan-ui-mobile)
13. [Keamanan & Kualitas](#13-keamanan--kualitas)
14. [Kriteria Penerimaan & Testing](#14-kriteria-penerimaan--testing)
15. [Rencana Pengerjaan](#15-rencana-pengerjaan)
16. [Output & Penilaian](#16-output--penilaian)
17. [Changelog](#17-changelog)

---

## 1. Overview Produk

| Atribut | Detail |
|---|---|
| **Nama Produk** | Android Map Directory |
| **Platform** | React Native (Android) |
| **Konteks** | Project Mata Kuliah Cloud Computing |
| **Komponen Wajib** | React Native · Node.js Backend · REST API · Database · GPS · Map Routing |
| **Durasi Pengerjaan** | 7 Minggu |

### 🟢 Pernyataan Produk

> Aplikasi direktori berbasis peta yang membantu mahasiswa menemukan **unit kampus** —
> departemen, PAA, kemahasiswaan, sekretariat vokasi, departemen kesehatan, dan lab —
> lengkap dengan **gedung, lantai, jam layanan, jarak, dan rute langsung dari HP**.
> Dibangun dengan **React Native** dan terhubung ke **cloud backend** via REST API.

### 🟢 Minimum Viable Product

**Daftar unit kampus + marker peta + detail unit (gedung & lantai) + rute dari lokasi pengguna.**

Inti penilaian bukan hanya tampilan, tetapi **integrasi end-to-end**: React Native app, server cloud, REST API, database, dan GPS bekerja sebagai satu sistem yang bisa didemonstrasikan dari HP nyata.

---

## 2. Konteks & Masalah

### Masalah yang Diselesaikan

Mahasiswa — terutama mahasiswa baru — sering tersesat saat mencari unit administrasi atau ruang spesifik di kampus. Pertanyaan yang sering muncul:

- "PAA Teknik Informatika di gedung mana, **lantai berapa**?"
- "Kantor Kemahasiswaan Vokasi itu sebelah mana?"
- "Lab Komputasi buka jam berapa?"
- "Departemen Kesehatan Masyarakat dari sini berapa jauh?"

Informasi ini tersebar di papan pengumuman, grup chat, atau dari mulut ke mulut. Akibatnya:

- Informasi tidak terstruktur, sulit diverifikasi
- Tidak ada cara mudah lihat **lantai** dan **jarak** dari posisi sekarang
- Tidak ada rute langsung yang bisa dibuka dari satu klik

### Solusi

Aplikasi React Native yang:

1. Mengambil data unit kampus dari **server cloud** via REST API
2. Menampilkan unit sebagai **marker di peta**, dengan info **gedung + lantai**
3. Memanfaatkan **GPS pengguna** untuk kalkulasi jarak
4. Membuka **rute navigasi** Google Maps ke koordinat unit

---

## 3. Tujuan & Sasaran

### Tujuan Pembelajaran

| # | Aspek | Target |
|---|---|---|
| 1 | **Cloud Backend** | Server/API dapat diakses dari React Native app via internet |
| 2 | **REST API** | Mobile tidak akses DB langsung — semua lewat endpoint JSON |
| 3 | **Database** | Data unit, kategori, gedung, lantai, koordinat tersimpan terstruktur |
| 4 | **GPS & Map** | Ambil lokasi pengguna, hitung jarak, render marker, buka rute |
| 5 | **Deployment** | Backend dipublikasikan — dapat dipanggil HP, bukan hanya lokal |
| 6 | **Demo End-to-End** | Demo dari HP nyata: cari unit → lihat detail (gedung+lantai) → buka rute |

---

## 4. Pengguna Target

### Primary User — Mahasiswa Kampus

| Atribut | Detail |
|---|---|
| **Siapa** | Mahasiswa aktif, terutama mahasiswa baru |
| **Kebutuhan utama** | Cari unit administrasi (departemen, PAA, kemahasiswaan), tahu **gedung & lantai**, lihat jarak & rute |
| **Konteks pemakaian** | Di dalam / sekitar kampus, sambil jalan, pakai satu tangan |
| **Device** | Android, layar 5–7 inch |
| **Kondisi pakai** | Outdoor, kadang di bawah sinar matahari, internet bisa lambat |

### Secondary User — Admin Data (Opsional)

| Atribut | Detail |
|---|---|
| **Siapa** | Pengelola data kampus / tim proyek |
| **Kebutuhan utama** | Input dan edit data unit + lantai melalui halaman web sederhana |
| **Konteks pemakaian** | Desktop / laptop |

---

## 5. Skenario Pengguna

### Alur Utama (Happy Path)

```
Buka Aplikasi → Izinkan GPS → Pilih Kategori (mis. PAA / Departemen)
   → Lihat Daftar + Gedung + Lantai + Jarak → Tap Unit → Detail → Buka Rute
```

### Use Case Contoh

> Mahasiswa baru ingin urus surat keterangan aktif di **PAA Teknik Informatika**.
> Dia buka aplikasi, pilih kategori "PAA", lihat unit beserta **Gedung TI · Lt. 2**
> dan jarak ±120 m. Dia tap unit → buka rute → Google Maps memandu ke gedung.
> Sampai di gedung, info "Lt. 2" mencegah dia bingung naik tangga.

### Alur Alternatif (Edge Cases)

| Kondisi | Respon Aplikasi |
|---|---|
| GPS mati | Dialog aktifkan GPS; daftar tetap tampil, jarak disembunyikan |
| Internet mati | Banner offline, jangan crash, state offline informatif |
| API error / timeout | Pesan ramah + tombol retry |
| Data kosong (filter) | Empty state dengan ikon kategori, bukan layar putih |
| Izin GPS ditolak | Penjelasan kenapa GPS dibutuhkan, tombol buka Settings |
| Unit tutup | Status pill `Tutup`; rute & detail tetap dapat diakses |

---

## 6. Fitur & Ruang Lingkup

### 🟢 Fitur Wajib (Must Have)

#### Direktori Unit Kampus
- Daftar unit dengan: **nama, kategori, gedung, lantai**, koordinat, jam layanan, deskripsi singkat
- Data diambil dari server via REST API — **tidak ada data hardcoded** di app
- Ditampilkan sebagai `FlatList` performant
- Setiap card unit menampilkan: nama, **Gedung · Lt. X**, kategori, estimasi jarak, status buka/tutup
- **Floor badge** wajib terlihat jelas di list maupun detail

#### Kategori Unit (wajib di-cover)
- **Departemen** — kantor administrasi prodi (sekretariat, kaprodi, dosen)
- **PAA** — Pelayanan Administrasi Akademik
- **Kemahasiswaan** — beasiswa, organisasi, konseling
- **Vokasi** — sekretariat & unit Sekolah Vokasi
- **Kesehatan** — departemen rumpun ilmu kesehatan
- **Lab** — laboratorium praktikum / riset

#### Map & Marker
- Peta interaktif (`react-native-maps`, Google Maps Provider)
- Setiap unit ditampilkan sebagai `Marker` berdasarkan `lat` & `lng`
- Tap marker → callout berisi `Nama · Gedung · Lt. X` + tombol detail
- Kamera peta auto-zoom ke area kampus saat pertama buka
- Filter kategori dapat memfilter marker yang tampil

#### GPS & Jarak
- Minta izin lokasi saat pertama buka (`expo-location`)
- Baca lokasi pengguna sekali saat buka (bukan continuous)
- Kalkulasi jarak (Haversine) dan tampilkan di tiap card
- Format jarak: `< 1 km → "450 m"`, `>= 1 km → "1.2 km"`
- Handle GPS mati / izin ditolak tanpa crash

#### Detail Unit & Rute
- Screen detail: foto, nama, kategori, **gedung + lantai** (prominent), alamat, jam layanan, koordinat, deskripsi, rating, daftar sub-ruangan (jika ada), tombol Buka Rute
- Tombol "Buka Rute" → `Linking.openURL()` ke Google Maps
- Jarak & ETA ditampilkan di halaman detail

---

### 🟡 Fitur Tambahan (Nice to Have)

#### Pencarian & Filter
- Search bar (nama unit / gedung / lantai)
- Filter chip kategori (Semua / Departemen / PAA / Kemahasiswaan / Vokasi / Kesehatan / Lab)
- Sort jarak terdekat (default)

#### Admin Input Data
- Halaman web sederhana untuk tambah / edit unit (termasuk gedung & lantai)

#### Favorit / Ulasan
- Simpan unit favorit di `AsyncStorage`
- Rating bintang 1–5 + komentar singkat

> **⚠️ Saran:** Selesaikan integrasi cloud + data unit dengan lantai dulu. Satu fitur stabil > tiga fitur setengah.

---

## 7. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                   React Native App (Android)                │
│         UI · GPS · react-native-maps · axios/fetch          │
└──────────────────────────┬──────────────────────────────────┘
                           │  REST API (JSON over HTTPS)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       Cloud Server                          │
│                  Node.js + Express Backend                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────┐   ┌────────────────────────┐
│      Database       │   │      Map Service        │
│  MySQL / PostgreSQL │   │  Google Maps via URL    │
│  units · buildings  │   │  Linking.openURL()      │
│  · categories       │   │                          │
└─────────────────────┘   └────────────────────────┘
```

### Prinsip Penting

> React Native app **tidak boleh** mengakses database langsung. Semua data harus melewati API.

| Layer | Tanggung Jawab |
|---|---|
| **React Native App** | UI, GPS, render peta, fetch API, handle error |
| **REST API** | Validasi request, query DB, format JSON |
| **Cloud Server** | Hosting backend, publik & accessible |
| **Database** | Simpan data unit, gedung, kategori, ulasan |
| **Map Service** | Routing dibuka via `Linking.openURL()` |

---

## 8. Desain API

### Endpoint Minimum

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/units` | Daftar semua unit |
| `GET` | `/api/units?category=PAA` | Filter unit berdasarkan kategori |
| `GET` | `/api/units?building=Gedung+TI` | Filter unit berdasarkan gedung |
| `GET` | `/api/units/:id` | Detail satu unit + sub-ruangan |
| `GET` | `/api/categories` | Daftar kategori |
| `GET` | `/api/buildings` | Daftar gedung |
| `POST` | `/api/units` | *(Opsional)* Tambah unit via admin |

### Format Response — `/api/units`

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Departemen Teknik Informatika",
      "short_name": "Dept. TI",
      "category": "Departemen",
      "building": "Gedung TI",
      "floor": "Lt. 3",
      "address": "Jl. Teknik Kampus Blok F, No. 4",
      "latitude": -7.27543,
      "longitude": 112.79742,
      "description": "Kantor departemen — administrasi akademik S1 TI.",
      "open_hours": "08:00 – 16:00",
      "status": "open",
      "rating": 4.5,
      "photo_url": "https://example.com/ti.jpg"
    }
  ]
}
```

### Format Response — `/api/units/:id` (termasuk sub-ruangan)

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Departemen Teknik Informatika",
    "building": "Gedung TI",
    "floor": "Lt. 3",
    "rooms": [
      { "name": "Ruang Kaprodi",  "location": "Lt. 3 · R.301" },
      { "name": "Sekretariat",     "location": "Lt. 3 · R.302" },
      { "name": "Ruang Dosen",     "location": "Lt. 3 · R.310–320" }
    ]
  }
}
```

### Format Response Error

```json
{ "status": "error", "message": "Unit not found" }
```

### Aturan API

- Response selalu JSON (no HTML)
- HTTP status tepat: `200`, `404`, `500`
- Aktifkan **CORS** untuk fetch dari device
- HTTPS untuk deployment publik
- `floor` adalah **field wajib** untuk semua unit

---

## 9. Model Data

### Tabel `categories`

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `name` | VARCHAR(50) | `Departemen`, `PAA`, `Kemahasiswaan`, `Vokasi`, `Kesehatan`, `Lab` |
| `icon` | VARCHAR(50) | Glyph key (mis. `dept`, `paa`) |
| `description` | TEXT | Penjelasan singkat untuk halaman Info |

### Tabel `buildings`

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `code` | VARCHAR(20) | Kode pendek (TI, FKM, FK, Vokasi, Sipil, Mesin) |
| `name` | VARCHAR(100) | Nama gedung (mis. `Gedung TI`) |
| `lat` | DECIMAL(10,7) | Centroid latitude |
| `lng` | DECIMAL(10,7) | Centroid longitude |

### Tabel `units` *(wajib)*

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `category_id` | INT, FK | Relasi ke `categories` |
| `building_id` | INT, FK | Relasi ke `buildings` |
| `name` | VARCHAR(255) | Nama lengkap unit |
| `short_name` | VARCHAR(60) | Untuk callout peta |
| `floor` | VARCHAR(20) | **Wajib**, mis. `Lt. 3`, `Lt. 2` |
| `lat` | DECIMAL(10,7) | **Wajib** |
| `lng` | DECIMAL(10,7) | **Wajib** |
| `address` | TEXT | Alamat lengkap |
| `description` | TEXT | Deskripsi singkat |
| `open_hours` | VARCHAR(100) | mis. `08:00 – 16:00` |
| `rating` | DECIMAL(2,1) | 1.0 – 5.0 |
| `photo_url` | VARCHAR(512) | URL foto |

### Tabel `unit_rooms` *(opsional, untuk sub-ruangan)*

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `unit_id` | INT, FK | Relasi ke `units` |
| `name` | VARCHAR(100) | Mis. `Ruang Kaprodi`, `Sekretariat` |
| `location` | VARCHAR(50) | Mis. `Lt. 3 · R.301` |

### Tabel `reviews` *(opsional)*

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `unit_id` | INT, FK | Relasi ke `units` |
| `user_id` | VARCHAR(50) | ID pengguna |
| `rating` | INT | 1–5 |
| `comment` | TEXT | Komentar |

> **🟢 Kunci:** `floor` + `lat` + `lng` adalah inti aplikasi. Tanpa lantai valid, tujuan kunjungan tidak jelas; tanpa koordinat valid, peta & navigasi gagal.

### Sample Data (minimum 9 unit, 6 gedung, 6 kategori)

| Nama | Kategori | Gedung | Lantai |
|---|---|---|---|
| Departemen Teknik Informatika | Departemen | Gedung TI | Lt. 3 |
| PAA Teknik Informatika | PAA | Gedung TI | Lt. 2 |
| Lab Komputasi & Jaringan | Lab | Gedung TI | Lt. 4 |
| Departemen Teknik Sipil | Departemen | Gedung Sipil | Lt. 2 |
| Departemen Teknik Mesin | Departemen | Gedung Mesin | Lt. 1 |
| Departemen Kesehatan Masyarakat | Kesehatan | Gedung FKM | Lt. 2 |
| Departemen Keperawatan | Kesehatan | Gedung FK | Lt. 4 |
| Kemahasiswaan Vokasi | Kemahasiswaan | Gedung Vokasi | Lt. 1 |
| Sekretariat Sekolah Vokasi | Vokasi | Gedung Vokasi | Lt. 2 |

---

## 10. Alur GPS & Routing

```
1. Request GPS Permission (expo-location)
        ↓
2. Ambil User Location (getCurrentPositionAsync)
        ↓
3. Fetch /api/units dari API
        ↓
4. Kalkulasi jarak user → tiap unit (Haversine)
        ↓
5. Render FlatList + MapView + marker
        ↓
6. User tap unit → navigate ke Detail (Gedung · Lt. X tampil prominent)
        ↓
7. User tap "Buka Rute"
        ↓
8. Linking.openURL() → Google Maps
```

### Membuka Rute

```javascript
import { Linking } from 'react-native';

const openRoute = (lat, lng) => {
  const url = `https://maps.google.com/?daddr=${lat},${lng}`;
  Linking.openURL(url);
};
```

> Catatan: Google Maps mengarahkan ke **koordinat gedung**. Lantai (`Lt. X`) tidak bisa diarahkan oleh peta — tampilkan **prominent di card & detail screen** sebagai instruksi lanjutan.

### Formula Jarak (Haversine)

```javascript
export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
```

---

## 11. Stack Teknologi

| Layer | Teknologi |
|---|---|
| **Mobile Framework** | React Native (Expo SDK 51+) |
| **Peta** | `react-native-maps` (Google Maps Provider) |
| **GPS** | `expo-location` |
| **HTTP Client** | `axios` |
| **Navigasi** | `@react-navigation/native` + `bottom-tabs` + `stack` |
| **State** | `useState` + `useContext` |
| **Storage Lokal** | `@react-native-async-storage/async-storage` (favorit) |
| **Backend** | Node.js + Express |
| **Database** | MySQL / PostgreSQL |
| **Deploy** | Railway / Render |

---

## 12. Panduan UI Mobile

### 🟢 Prinsip

- Touch target ≥ **48 × 48 dp**
- Padding horizontal ≥ **16 dp**
- Body text ≥ **14 sp**, judul card ≥ **16 sp**
- Satu tangan friendly — CTA utama di area jempol
- Loading / empty / error state **selalu ada** — tidak ada blank screen
- **Gedung + Lantai wajib terlihat** di setiap konteks daftar maupun detail

### 🟢 Screen Set

| Tab | Screen | Konten |
|---|---|---|
| 🏠 **Beranda** | `HomeScreen` | Header sapaan, search, status strip lokasi, filter chip kategori, daftar unit terdekat (featured + list) — tiap item menampilkan **Gedung · Lt. X** |
| 🗺️ **Peta** | `MapScreen` | MapView penuh, marker semua unit, filter chip melayang, FAB locate/zoom, bottom sheet preview unit terpilih dengan Gedung + Lt. + Buka Rute |
| ℹ️ **Info** | `InfoScreen` | Brand card aplikasi, stats (unit/gedung/kategori), banner sinkronisasi data, daftar 6 kategori + jumlah unit + deskripsi, quick action (Bantuan, Masukan, Sumber data, Versi) |

`DetailScreen` (stack di dalam tab Beranda) — hero photo + floor badge overlay, kategori + rating, status + jarak + ETA, deskripsi, info rows (Lokasi, Alamat, Jam, Koordinat), **list sub-ruangan**, sticky CTA Buka Rute.

### 🟢 Komponen Wajib

| Komponen | Ketentuan |
|---|---|
| **FloorBadge** | Pill split: `Gedung XYZ` (kiri) + `Lt. N` (kanan, mono, ink). Wajib muncul di card unit & detail. |
| **StatusPill** | `Buka` (hijau) / `Tutup 30m` (oranye) / `Tutup` (merah) — dengan dot indikator |
| **Distance** | Mono font, mis. `120 m` atau `1.2 km` |
| **CategoryChip** | Glyph + label, active state ink fill |
| `FlatList` | `keyExtractor`, `initialNumToRender={10}`, `removeClippedSubviews` |
| `Image` | `resizeMode="cover"`, placeholder bila gagal |
| Tombol Buka Rute | Full width, `height: 48–52`, background `--route`, teks putih bold |
| Loading | `ActivityIndicator` center |
| Empty | Ikon kategori + teks "Tidak ada unit di kategori ini." |
| Error | Pesan + tombol "Coba lagi" |
| `MapView` | `initialRegion` kampus, ≤ 50 marker sekaligus |

Detail visual lengkap → lihat **Design.md**.

---

## 13. Keamanan & Kualitas

### Credentials
- Jangan simpan secret di kode RN. Pakai `.env` di server.
- Maps API key dibatasi per Android package name.
- `.env` masuk `.gitignore`.

### HTTPS & CORS
- HTTPS untuk deployment publik
- `app.use(cors())` di Express

### Validasi Data (Backend)
- `lat` valid (−90 … 90), `lng` valid (−180 … 180)
- `floor` tidak boleh kosong
- `category` harus salah satu dari 6 enum
- Parameterized query — no SQL string concat

### Privacy
- Lokasi pengguna hanya dipakai sementara (kalkulasi jarak), tidak disimpan ke server.

---

## 14. Kriteria Penerimaan & Testing

### Uji API
- [ ] `GET /api/units` → array unit
- [ ] `GET /api/units?category=PAA` → hanya kategori PAA
- [ ] `GET /api/units?building=Gedung+TI` → hanya unit di Gedung TI
- [ ] `GET /api/units/:id` → detail + sub-ruangan
- [ ] `GET /api/categories` → 6 kategori
- [ ] `GET /api/buildings` → daftar gedung
- [ ] Semua endpoint dapat diakses dari jaringan luar (bukan localhost)
- [ ] CORS aktif
- [ ] Status code HTTP tepat

### Uji Data
- [ ] Minimal **9 unit** tersimpan di DB
- [ ] Minimal **6 gedung** ter-cover
- [ ] **6 kategori** ter-cover (Departemen, PAA, Kemahasiswaan, Vokasi, Kesehatan, Lab)
- [ ] Semua unit punya `lat`, `lng`, **`floor`** valid
- [ ] Foto tersedia untuk ≥ 50% unit

### Uji GPS
- [ ] Aplikasi minta izin lokasi saat pertama buka
- [ ] Jarak dihitung & ditampilkan di tiap card
- [ ] GPS mati → app tetap jalan, banner pesan
- [ ] Izin ditolak → app tetap jalan tanpa fitur jarak

### Uji Routing
- [ ] Tap "Buka Rute" membuka Google Maps dengan koordinat benar
- [ ] Berfungsi di HP fisik

### Uji UI
- [ ] Touch target ≥ 48 dp
- [ ] **Gedung + Lt. X** terlihat di card, callout, dan detail
- [ ] FlatList scroll halus dengan 9+ unit
- [ ] MapView render semua marker tanpa freeze
- [ ] Loading / empty / error state lengkap

### Uji Koneksi
- [ ] Server down → pesan ramah + retry
- [ ] Internet mati → banner offline
- [ ] App tidak crash

### Demo Akhir
- [ ] Demo dari HP fisik
- [ ] Alur lengkap: buka → GPS → cari PAA TI → detail (Gedung TI · Lt. 2) → Buka Rute
- [ ] Keempat tab (Beranda / Peta / Info + Detail stack) berjalan tanpa bug kritis

---

## 15. Rencana Pengerjaan

| Minggu | Fokus | Artefak |
|---|---|---|
| **1** | Domain, skema DB (units + buildings + floor), data 9+ unit, setup RN | Skema, data, RN running |
| **2** | Backend API + deploy + CORS | API live, Postman collection, accessible dari HP |
| **3** | Home Screen — FlatList, search, filter, **FloorBadge** | Beranda dengan data real |
| **4** | Map Screen — MapView, marker, callout (gedung+lantai), bottom sheet | Semua marker tampil |
| **5** | Detail Screen + GPS + Haversine + Buka Rute + sub-ruangan | Detail lengkap, rute kerja dari HP |
| **6** | Info Screen + error/loading/empty + polish | Semua edge case ditangani |
| **7** | Testing HP fisik, video demo, dokumentasi, presentasi | Demo, laporan, slide |

---

## 16. Output & Penilaian

### Artefak
1. APK release / link Expo Go
2. URL backend publik
3. Postman Collection / README API
4. Diagram arsitektur
5. Screenshot / video demo HP fisik (Beranda, Peta, Detail, Info)
6. Laporan singkat
7. **Design.md** (file design system)
8. Dokumen HKI (jika diwajibkan)

### Bobot

| Bobot | Aspek | Kriteria |
|---|---|---|
| **35%** | Aplikasi RN | UI mobile-friendly, floor info terlihat, peta + marker + rute kerja dari HP fisik |
| **25%** | Backend + Cloud | Server online, CORS, endpoint rapi, JSON benar |
| **15%** | DB & Data | 9+ unit, lantai valid, 6 gedung, 6 kategori |
| **15%** | Dokumentasi & Demo | Presentasi, diagram, video HP fisik, Design.md |
| **10%** | HKI | Dokumen pendaftaran |

### Definisi Sukses

> Proyek **berhasil** jika React Native app, API, DB, server cloud, dan GPS bekerja bersama sebagai satu sistem yang dapat didemonstrasikan dari HP fisik — mahasiswa bisa cari unit kampus, lihat **gedung & lantai**, dan buka rute Google Maps dalam ≤ 3 tap.

---

## 17. Changelog

### v1.2 — Mei 2026 _(current)_
- **Scope pivot**: dari tempat umum kampus (kafe/kantin/atm/parkir/fotokopi/kos) → **unit kampus** (Departemen, PAA, Kemahasiswaan, Vokasi, Kesehatan, Lab)
- **Floor (`Lt. X`)** menjadi field **wajib** di model data; tampil prominent di seluruh UI
- Skema DB: tambah tabel `buildings`, ubah `places` → `units`, tambah `unit_rooms` untuk sub-ruangan
- Endpoint: `/api/places*` → `/api/units*`; tambah `/api/buildings`
- Screen set ditegaskan: Beranda · Peta · Detail · Info (4 screen)
- Dokumen design system dipisah → `Design.md`

### v1.1 — Mei 2026
- Versi awal: tempat umum di sekitar kampus.

---

*PRD ini dibuat berdasarkan brief proyek Cloud Computing — Android Map Directory.*
*Stack: React Native · Node.js · MySQL · Cloud Deployment*
*Versi 1.2 · Mei 2026*
