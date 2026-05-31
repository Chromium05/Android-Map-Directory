# 🗺️ PRD — Android Map Directory
> **Product Requirements Document · Mata Kuliah Cloud Computing**
> Versi 1.1 · Mei 2026

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

> Aplikasi direktori berbasis peta yang membantu mahasiswa menemukan tempat di sekitar kampus — lengkap dengan detail, jarak, dan rute langsung dari HP. Dibangun dengan **React Native** dan terhubung ke **cloud backend** via REST API.

### 🟢 Minimum Viable Product

**Daftar tempat + marker peta + detail tempat + rute dari lokasi pengguna.**

Inti penilaian bukan tampilan saja, tetapi **integrasi** antara React Native app, server cloud, API, database, dan GPS sebagai satu sistem yang bekerja end-to-end dari HP nyata.

---

## 2. Konteks & Masalah

### Masalah yang Diselesaikan

Mahasiswa sering butuh informasi cepat soal tempat di sekitar kampus — kantin, fotokopi, kos, parkir, ATM, tempat nongkrong, dan layanan kampus lainnya. Tapi informasi ini tersebar di mana-mana: grup chat, media sosial, atau dari mulut ke mulut.

Akibatnya:
- Informasi tidak terstruktur dan sulit diverifikasi
- Tidak ada cara mudah melihat jarak dari posisi pengguna sekarang
- Tidak ada rute langsung yang bisa dibuka dari satu tempat

### Solusi

Membangun aplikasi React Native yang:
1. Mengambil data direktori dari **server cloud** melalui API
2. Menampilkan tempat sebagai **marker di peta**
3. Memanfaatkan **GPS pengguna** untuk kalkulasi jarak
4. Membuka **rute navigasi** ke lokasi yang dipilih

---

## 3. Tujuan & Sasaran

### Tujuan Pembelajaran

| # | Aspek | Target |
|---|---|---|
| 1 | **Cloud Backend** | Server/API dapat diakses dari React Native app melalui internet |
| 2 | **REST API** | Mobile tidak membaca DB langsung — semua lewat endpoint |
| 3 | **Database** | Data tempat, kategori, koordinat, rating tersimpan terstruktur |
| 4 | **GPS & Map** | Ambil lokasi pengguna, hitung jarak, tampilkan marker, buka rute |
| 5 | **Deployment** | Backend dipublikasikan — dapat dipanggil HP, bukan hanya lokal |
| 6 | **Demo End-to-End** | Demo dari HP nyata: cari tempat → lihat detail → buka rute |

---

## 4. Pengguna Target

### Primary User — Mahasiswa Kampus

| Atribut | Detail |
|---|---|
| **Siapa** | Mahasiswa aktif, terutama mahasiswa baru |
| **Kebutuhan utama** | Cari tempat terdekat dengan cepat, lihat jarak & rute |
| **Konteks pemakaian** | Di dalam/sekitar kampus, sambil jalan, pakai satu tangan |
| **Device** | Android, layar 5–7 inch, berbagai resolusi |
| **Kondisi pakai** | Outdoor, kadang di bawah sinar matahari, internet bisa lambat |

### Secondary User — Admin Data (Opsional)

| Atribut | Detail |
|---|---|
| **Siapa** | Anggota tim / pengelola konten |
| **Kebutuhan utama** | Input dan edit data tempat melalui halaman web sederhana |
| **Konteks pemakaian** | Desktop/laptop, tidak di lapangan |

---

## 5. Skenario Pengguna

### Alur Utama (Happy Path)

```
Buka Aplikasi → Izinkan GPS → Pilih Kategori / Cari Tempat
      → Lihat Daftar + Jarak → Tap Tempat → Detail → Buka Rute
```

### Use Case Contoh

> Mahasiswa baru ingin cari tempat nongkrong yang dekat dari gedung kuliah. Dia buka aplikasi, pilih kategori "Kafe", lihat daftar beserta estimasi jarak, pilih satu, lalu tap "Buka Rute" — aplikasi langsung membuka navigasi di Google Maps.

### Alur Alternatif (Edge Cases)

| Kondisi | Respon Aplikasi |
|---|---|
| GPS mati | Dialog minta aktifkan GPS, fitur jarak nonaktif tapi list tetap tampil |
| Internet mati | Banner/snackbar error, jangan crash, tampilkan state offline |
| API error / timeout | Pesan ramah + tombol retry, jangan blank screen |
| Data kosong | Empty state dengan ilustrasi/ikon, bukan layar putih kosong |
| Izin GPS ditolak | Penjelasan kenapa GPS dibutuhkan, tombol buka Settings |

---

## 6. Fitur & Ruang Lingkup

### 🟢 Fitur Wajib (Must Have)

#### Direktori Tempat
- Daftar tempat berisi: nama, kategori, alamat, koordinat, jam buka, deskripsi singkat
- Data diambil dari server via REST API — tidak ada data hardcoded di app
- Ditampilkan sebagai `FlatList` yang scrollable dan performant
- Setiap card tempat menampilkan: nama, kategori, estimasi jarak, jam buka

#### Map & Marker
- Peta interaktif menggunakan `react-native-maps`
- Setiap tempat ditampilkan sebagai `Marker` berdasarkan `latitude` & `longitude` dari server
- Tap marker → tampilkan callout (popup mini) berisi nama + tombol ke detail
- Kamera peta otomatis zoom ke area kampus saat pertama buka

#### GPS & Jarak
- Minta izin lokasi saat pertama buka menggunakan `expo-location`
- Baca lokasi pengguna (cukup sekali saat buka, bukan continuous tracking)
- Kalkulasi estimasi jarak (Haversine formula) dan tampilkan di setiap card
- Handle kondisi GPS mati atau izin ditolak tanpa crash

#### Detail Tempat & Rute
- Screen detail berisi: foto, nama, kategori, alamat, jam buka, deskripsi, rating, tombol rute
- Tombol "Buka Rute" membuka Google Maps via `Linking.openURL()` dengan koordinat tujuan
- Jarak dari posisi pengguna ditampilkan di halaman detail

---

### 🟡 Fitur Tambahan (Nice to Have)

#### Pencarian & Filter
- Search bar di home untuk cari berdasarkan nama
- Filter chip berdasarkan kategori (Kafe, Kantin, ATM, dll)
- Sort berdasarkan jarak terdekat

#### Admin Input Data
- Halaman web sederhana (bukan di app) untuk tambah / edit data tempat
- Tidak perlu autentikasi kompleks untuk versi awal

#### Favorit / Review
- Simpan tempat favorit di `AsyncStorage` (lokal) atau database (cloud)
- Rating sederhana bintang 1–5
- Komentar singkat

> **⚠️ Saran:** Selesaikan integrasi cloud dulu sampai stabil. Satu fitur yang benar-benar bekerja lebih baik dari tiga fitur yang setengah jalan.

---

## 7. Arsitektur Sistem

### Diagram Arsitektur

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
│  (Places/Categories)│   │  Linking.openURL()      │
└─────────────────────┘   └────────────────────────┘
```

### Prinsip Penting

> **React Native app tidak boleh mengakses database secara langsung.** Semua data harus melewati API agar sistem aman, terkontrol, dan mudah dikembangkan.

| Layer | Tanggung Jawab |
|---|---|
| **React Native App** | UI, GPS, render peta, fetch API, tampilkan data, handle error |
| **REST API** | Validasi request, query DB, format JSON response |
| **Cloud Server** | Hosting backend, pastikan online & accessible dari luar |
| **Database** | Simpan data terstruktur (tempat, kategori, review) |
| **Map Service** | Routing dibuka via `Linking.openURL()`, tidak diproses di app |

---

## 8. Desain API

### Endpoint Minimum

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/places` | Ambil daftar semua tempat |
| `GET` | `/api/places?category=cafe` | Filter tempat berdasarkan kategori |
| `GET` | `/api/places/:id` | Ambil detail satu tempat |
| `GET` | `/api/categories` | Ambil daftar kategori |
| `POST` | `/api/places` | *(Opsional)* Tambah tempat via admin |

### Format Response yang Disarankan

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Kafe Literasi",
      "category": "cafe",
      "address": "Jl. Kampus No. 12",
      "latitude": -7.2575,
      "longitude": 112.7521,
      "description": "Kafe nyaman dengan Wi-Fi cepat dan colokan banyak.",
      "rating": 4.3,
      "photo_url": "https://example.com/foto/kafe-literasi.jpg",
      "open_hours": "08:00 – 22:00"
    }
  ]
}
```

### Format Response Error

```json
{
  "status": "error",
  "message": "Place not found"
}
```

### Aturan API

- Response selalu JSON — tidak ada HTML dalam response API
- Gunakan HTTP status code yang tepat: `200 OK`, `404 Not Found`, `500 Internal Server Error`
- Error response juga harus JSON dengan field `message`
- Aktifkan **CORS** agar React Native bisa fetch dari device nyata
- HTTPS direkomendasikan untuk deployment publik

---

## 9. Model Data

### Skema Database Minimum

#### Tabel `categories`

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `name` | VARCHAR(100) | Nama kategori (Kafe, Kantin, ATM, dll) |
| `icon` | VARCHAR(255) | Nama icon atau URL |

#### Tabel `places` *(wajib)*

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `category_id` | INT, FK | Relasi ke tabel categories |
| `name` | VARCHAR(255) | Nama tempat |
| `lat` | DECIMAL(10,7) | Latitude — **wajib, tidak boleh kosong** |
| `lng` | DECIMAL(10,7) | Longitude — **wajib, tidak boleh kosong** |
| `address` | TEXT | Alamat lengkap |
| `description` | TEXT | Deskripsi singkat |
| `open_hours` | VARCHAR(100) | Contoh: `"08:00 – 22:00"` |
| `rating` | DECIMAL(2,1) | Rating 1.0 – 5.0 |
| `photo_url` | VARCHAR(512) | URL foto tempat |

#### Tabel `reviews` *(opsional)*

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | INT, PK | Auto increment |
| `place_id` | INT, FK | Relasi ke places |
| `user_id` | INT / VARCHAR | ID atau nama pengguna |
| `rating` | INT | Bintang 1–5 |
| `comment` | TEXT | Komentar singkat |

> **🟢 Kunci:** `lat` dan `lng` adalah inti aplikasi. Tanpa koordinat valid, tempat tidak bisa tampil di peta dan tidak bisa digunakan untuk navigasi.

---

## 10. Alur GPS & Routing

### Langkah-Langkah

```
1. Request GPS Permission (expo-location)
        ↓
2. Ambil User Location (getCurrentPositionAsync)
        ↓
3. Fetch daftar tempat dari API
        ↓
4. Kalkulasi jarak user → setiap tempat (Haversine)
        ↓
5. Tampilkan FlatList + MapView dengan marker
        ↓
6. User tap tempat → navigate ke Detail Screen
        ↓
7. User tap "Buka Rute"
        ↓
8. Linking.openURL() → Google Maps / Maps app native
```

### Membuka Rute di React Native

```javascript
import { Linking } from 'react-native';

const openRoute = (lat, lng, label) => {
  const url = `https://maps.google.com/?daddr=${lat},${lng}`;
  Linking.openURL(url);
};
```

### Formula Jarak (Haversine)

```javascript
// utils/distance.js
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

// Format untuk tampilan: < 1km → "450 m", >= 1km → "1.2 km"
export const formatDistance = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
```

### Catatan Penting GPS

- Minta permission runtime — jangan asumsikan sudah granted
- Handle tiga state: `granted`, `denied`, `undetermined`
- Jika denied → tampilkan tombol buka Settings, jangan paksa ulang
- Lokasi pengguna cukup dipakai sementara — tidak perlu disimpan ke server

---

## 11. Stack Teknologi

### 🟢 Stack yang Dipakai (Fixed)

| Layer | Teknologi |
|---|---|
| **Mobile Framework** | React Native (Expo SDK 51+) |
| **Peta** | `react-native-maps` (Google Maps Provider) |
| **GPS** | `expo-location` |
| **HTTP Client** | `axios` |
| **Navigasi** | `@react-navigation/native` + `bottom-tabs` + `stack` |
| **State Management** | `useState` + `useContext` (cukup untuk skala ini) |
| **Storage Lokal** | `@react-native-async-storage/async-storage` (untuk favorit, opsional) |

### Backend API

| Pilihan | Catatan |
|---|---|
| **Node.js + Express** | Rekomendasi utama — ekosistem JavaScript sama dengan RN |
| **Laravel** | Boleh jika sudah familiar PHP |
| **Flask / FastAPI** | Jika pilih Python |

### Database

| Pilihan | Catatan |
|---|---|
| **MySQL / PostgreSQL** | Relasional, recommended |
| **Firebase Firestore** | Realtime, bagus untuk pemula |
| **MongoDB** | NoSQL, fleksibel |

### Cloud Deployment

| Pilihan | Catatan |
|---|---|
| **Railway** | Rekomendasi utama — gratis, mudah deploy Node.js + MySQL |
| **Render** | Alternatif Railway, free tier tersedia |
| **Fly.io** | Bagus untuk containerized app |
| **VPS (DigitalOcean, Vultr)** | Kontrol penuh |

**Syarat wajib:** backend **harus online dan dapat dipanggil dari HP nyata**, bukan hanya berjalan di `localhost:3000`.

---

## 12. Panduan UI Mobile

> Section ini wajib diikuti agar aplikasi nyaman dipakai dari HP — bukan sekadar "bisa jalan".

### 🟢 Prinsip Mobile-First

- **Touch target minimum 48×48dp** untuk semua elemen yang bisa di-tap
- **Padding horizontal minimum 16dp** di semua screen — jangan tempel ke tepi layar
- **Font minimum 14sp** untuk body text, 16sp untuk judul card
- **Satu tangan friendly** — aksi utama (tombol rute, search) ada di area jempol
- **Loading state selalu ada** — setiap fetch API harus punya `ActivityIndicator` atau skeleton
- **Tidak ada blank screen** — selalu ada feedback visual saat loading, error, atau kosong

### 🟢 Navigasi

Gunakan **Bottom Tab Navigator** dengan 3 tab:

| Tab | Icon | Konten |
|---|---|---|
| 🏠 Home | `home-outline` | Daftar tempat + search + filter kategori |
| 🗺️ Peta | `map-outline` | MapView dengan semua marker |
| ℹ️ Info | `information-outline` | Tentang aplikasi / kategori |

Stack Navigator di dalam tab Home:
```
HomeStack:
  ├── HomeScreen      (list, search, filter)
  └── DetailScreen    (detail tempat + tombol rute)
```

### 🟢 Layout Per Screen

#### Home Screen
```
┌─────────────────────────────────┐
│  🔍 Search bar (sticky)         │
│  [Semua] [Kafe] [Kantin] [ATM]  │  ← horizontal scroll chips
├─────────────────────────────────┤
│  📍 Kafe Literasi               │
│     ☕ Kafe · 450 m · Buka      │  ← FlatList card
│─────────────────────────────────│
│  📍 Kantin A                    │
│     🍽️ Kantin · 120 m · Buka   │
│─────────────────────────────────│
│  ...                            │
└─────────────────────────────────┘
       [🏠]    [🗺️]    [ℹ️]         ← bottom tab
```

#### Map Screen
```
┌─────────────────────────────────┐
│                                 │
│       MapView (full screen)     │
│    📍 📍 📍  (markers)          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Kafe Literasi · 450m >  │    │  ← callout saat marker di-tap
│  └─────────────────────────┘    │
└─────────────────────────────────┘
       [🏠]    [🗺️]    [ℹ️]
```

#### Detail Screen
```
┌─────────────────────────────────┐
│  ← Back                         │
│  [Foto tempat — full width]      │
│─────────────────────────────────│
│  Kafe Literasi          ⭐ 4.3  │
│  ☕ Kafe · 450 m dari kamu       │
│  📍 Jl. Kampus No. 12           │
│  🕐 08:00 – 22:00               │
│─────────────────────────────────│
│  Kafe nyaman dengan Wi-Fi...    │
│─────────────────────────────────│
│  ┌─────────────────────────┐    │
│  │    🗺️  Buka Rute         │    │  ← full width, warna primer
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### 🟢 Aturan Komponen React Native

| Komponen | Ketentuan |
|---|---|
| `FlatList` | Selalu pakai `keyExtractor`, `initialNumToRender={10}`, `removeClippedSubviews` |
| `Image` tempat | `resizeMode="cover"`, tambah fallback placeholder jika URL gagal load |
| Tombol Buka Rute | Full width, `height: 52`, background warna primer (hijau/biru), teks putih bold |
| Loading state | `ActivityIndicator` di tengah layar — jangan biarkan layar kosong |
| Empty state | Ikon + teks deskriptif — jangan layar putih tanpa penjelasan |
| Error state | Teks error + tombol "Coba Lagi" yang berfungsi |
| Category chips | `ScrollView horizontal`, `showsHorizontalScrollIndicator={false}` |
| `MapView` | Set `initialRegion` ke koordinat kampus, bukan default dunia |
| Jarak | Format: di bawah 1 km tampilkan "450 m", di atas tampilkan "1.2 km" |

### 🟢 Performa

- Pakai `useCallback` untuk handler di dalam `FlatList` — hindari re-render tidak perlu
- Foto dari URL: pertimbangkan `expo-image` (ada caching bawaan) daripada `Image` bawaan
- Jangan fetch ulang data setiap kali screen di-focus tanpa alasan
- `MapView`: hindari render marker terlalu banyak sekaligus — batasi 50 marker jika perlu

### 🟢 Aksesibilitas

- Semua elemen interaktif punya `accessibilityLabel` yang deskriptif
- Kontras warna teks minimal 4.5:1 terhadap background
- Tombol punya `accessibilityRole="button"`

---

## 13. Keamanan & Kualitas

### API Key & Credential

- **Jangan simpan credential database atau API secret di kode React Native**
- Semua credential backend di server sebagai environment variable (`.env`)
- Google Maps API key: batasi per Android package name di Google Cloud Console
- Jangan commit `.env` ke GitHub — tambahkan ke `.gitignore`

### HTTPS & CORS

- Gunakan HTTPS untuk deployment publik
- Aktifkan CORS di Express agar fetch dari device nyata tidak diblokir:

```javascript
const cors = require('cors');
app.use(cors());
```

### Validasi Data (Backend)

- Koordinat tidak kosong dan dalam range valid (-90 s/d 90 lat, -180 s/d 180 lng)
- Kategori sesuai dengan yang ada di DB
- Gunakan parameterized query — jangan string concatenation untuk SQL

### Error Handling (React Native)

| Kondisi | Respon |
|---|---|
| GPS mati | Dialog + tombol buka Settings |
| GPS izin ditolak | Penjelasan + opsi lanjut tanpa GPS |
| API timeout (>10 detik) | Tampilkan error + tombol retry |
| Internet mati | Banner offline + state kosong informatif |
| Response kosong | Empty state, bukan layar blank |
| Server down | Pesan ramah, log error ke console |

### Privacy GPS

Lokasi pengguna cukup dipakai sementara untuk kalkulasi jarak dan routing. Tidak perlu disimpan ke server tanpa alasan yang jelas.

---

## 14. Kriteria Penerimaan & Testing

### Uji API

- [ ] `GET /api/places` mengembalikan JSON berisi array tempat
- [ ] `GET /api/places?category=cafe` mengembalikan hanya tempat berkategori cafe
- [ ] `GET /api/places/:id` mengembalikan detail satu tempat
- [ ] `GET /api/categories` mengembalikan daftar kategori
- [ ] Semua endpoint dapat diakses dari **jaringan luar** (bukan localhost)
- [ ] CORS aktif — fetch dari device fisik tidak diblokir
- [ ] Semua endpoint mengembalikan HTTP status yang tepat

### Uji Data

- [ ] Minimal **15–30 tempat** tersimpan di database
- [ ] Semua tempat memiliki koordinat `lat` dan `lng` yang valid
- [ ] Semua tempat tampil sebagai marker di MapView
- [ ] Foto/thumbnail tersedia untuk minimal setengah dari data

### Uji GPS

- [ ] Aplikasi meminta izin lokasi saat pertama buka
- [ ] Aplikasi membaca lokasi pengguna dengan benar
- [ ] Estimasi jarak dihitung dan ditampilkan di setiap card
- [ ] Jika GPS mati → aplikasi tetap jalan, tampilkan pesan (tidak crash)
- [ ] Jika izin ditolak → aplikasi tetap jalan tanpa fitur jarak

### Uji Routing

- [ ] Tap "Buka Rute" membuka Google Maps dengan koordinat yang benar
- [ ] Koordinat tujuan sesuai data dari server
- [ ] Berfungsi di HP fisik (bukan hanya emulator)

### Uji UI Mobile

- [ ] Semua touch target minimal 48×48dp
- [ ] Tidak ada teks yang terpotong di layar 5 inch dan 6.5 inch
- [ ] FlatList scroll halus tanpa lag dengan 30 item
- [ ] MapView menampilkan semua marker tanpa freeze
- [ ] Loading state muncul saat fetch API
- [ ] Empty state muncul saat data kosong
- [ ] Error state + tombol retry muncul saat API gagal

### Uji Koneksi

- [ ] Aplikasi memberi pesan yang jelas saat server down
- [ ] Aplikasi memberi pesan yang jelas saat internet mati
- [ ] Aplikasi tidak crash pada kondisi di atas
- [ ] Ada tombol retry yang berfungsi

### Demo Akhir

- [ ] Demo dilakukan dari HP fisik (bukan emulator saja)
- [ ] Alur lengkap: buka → GPS → pilih tempat → detail → buka rute
- [ ] Semua 3 screen utama berjalan tanpa bug kritis

---

## 15. Rencana Pengerjaan

### Timeline 7 Minggu

| Minggu | Fokus | Artefak yang Dihasilkan |
|---|---|---|
| **Minggu 1** | Definisi domain, data tempat, skema DB, setup project RN + Expo | Skema DB, daftar 15–30 tempat, project RN berjalan di emulator |
| **Minggu 2** | Bangun backend API, deploy ke cloud, uji CORS + endpoint | API live di cloud, Postman collection, CORS aktif, bisa di-fetch dari HP |
| **Minggu 3** | Home Screen — FlatList, kategori chip, search, fetch API | Home screen menampilkan data real dari API |
| **Minggu 4** | Map Screen — MapView, marker, callout, initialRegion kampus | Semua marker tampil, tap marker buka callout |
| **Minggu 5** | Detail Screen + GPS + Haversine + tombol rute | Detail lengkap, jarak dihitung, "Buka Rute" berfungsi dari HP |
| **Minggu 6** | Error handling, loading state, empty state, polish UI mobile | Semua edge case ditangani, UI nyaman di HP nyata |
| **Minggu 7** | Testing HP fisik, dokumentasi, video demo, presentasi final | Demo video, laporan, presentasi |

> **🟢 Aturan:** Setiap minggu harus menghasilkan **artefak nyata** yang bisa ditunjukkan — bukan hanya "sudah dipelajari".

---

## 16. Output & Penilaian

### Artefak yang Dikumpulkan

1. **APK release** atau link **Expo Go / EAS Build** yang bisa diinstall
2. **URL backend** yang dapat diakses publik
3. **Postman Collection** atau dokumentasi API (README.md di repo backend)
4. **Diagram arsitektur** sistem
5. **Screenshot / video demo** dari HP fisik
6. **Laporan singkat** (fitur, stack, deployment, kendala)
7. **Dokumen HKI** (jika diwajibkan)

### Bobot Penilaian

| Bobot | Aspek | Kriteria |
|---|---|---|
| **35%** | 🟢 Aplikasi React Native | UI mobile-friendly, peta tampil, marker muncul, detail jelas, rute bisa dibuka dari HP fisik |
| **25%** | 🟢 Backend, API & Cloud Deployment | Server online, CORS aktif, endpoint rapi, JSON benar, error ditangani |
| **15%** | 🟡 Database & Data | Skema sesuai, koordinat valid, minimal 15–30 tempat, kategori jelas |
| **15%** | 🟡 Dokumentasi & Demo | Presentasi, diagram arsitektur, bukti testing dari HP fisik, video/screenshot |
| **10%** | 🔵 Dokumen HKI | Dokumen yang diperlukan untuk pendaftaran HKI |

### Definisi Sukses

> Proyek dinyatakan **berhasil** jika aplikasi React Native, API, database, server cloud, dan GPS dapat **bekerja bersama sebagai satu sistem** yang bisa didemonstrasikan dari HP fisik — bukan hanya di emulator atau localhost.

---

## Referensi Cepat untuk AI / Developer

### Stack Final

```
Mobile     : React Native + Expo SDK 51+
Peta       : react-native-maps (Google Maps Provider)
GPS        : expo-location
HTTP       : axios
Navigasi   : @react-navigation/native + bottom-tabs + stack
Backend    : Node.js + Express
Database   : MySQL (mysql2) atau PostgreSQL (pg)
Deploy     : Railway (backend + DB)
```

### Struktur Folder React Native

```
src/
├── screens/
│   ├── HomeScreen.jsx         FlatList tempat + search + filter
│   ├── MapScreen.jsx          MapView + semua marker
│   └── DetailScreen.jsx       Detail tempat + tombol rute
├── components/
│   ├── PlaceCard.jsx          Card satu tempat di FlatList
│   ├── CategoryChip.jsx       Chip filter kategori
│   ├── LoadingView.jsx        ActivityIndicator centered
│   ├── EmptyState.jsx         Empty state dengan ikon & teks
│   └── ErrorState.jsx         Error state + tombol retry
├── services/
│   └── api.js                 axios instance + semua fetch function
├── utils/
│   ├── distance.js            Haversine formula + format jarak
│   └── location.js            Request GPS permission helper
├── navigation/
│   └── AppNavigator.jsx       Tab + Stack navigator setup
└── App.jsx                    Entry point
```

### Struktur Folder Backend

```
backend/
├── routes/
│   ├── places.js              GET /api/places, POST /api/places
│   ├── categories.js          GET /api/categories
│   └── detail.js              GET /api/places/:id
├── controllers/
│   └── placesController.js
├── config/
│   └── db.js                  Koneksi database (pool)
├── middleware/
│   └── errorHandler.js        Global error middleware
├── app.js                     Entry point + CORS setup
├── .env                       DB_HOST, DB_USER, DB_PASS, PORT
└── .gitignore                 Pastikan .env ada di sini!
```

### Setup CORS di Express

```javascript
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());         // Izinkan semua origin (cukup untuk proyek kuliah)
app.use(express.json());
```

### Fetch Data dari React Native

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend.railway.app/api',
  timeout: 10000,
});

export const getPlaces = (category) =>
  api.get('/places', { params: category ? { category } : {} });

export const getPlaceById = (id) => api.get(`/places/${id}`);
export const getCategories = ()   => api.get('/categories');
```

### Request GPS Permission (Expo)

```javascript
// utils/location.js
import * as Location from 'expo-location';

export const getUserLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return location.coords; // { latitude, longitude }
};
```

### Membuka Rute

```javascript
// di DetailScreen.jsx
import { Linking, Alert } from 'react-native';

const openRoute = async (lat, lng) => {
  const url = `https://maps.google.com/?daddr=${lat},${lng}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert('Error', 'Tidak bisa membuka aplikasi peta.');
  }
};
```

---

*PRD ini dibuat berdasarkan brief proyek Cloud Computing — Android Map Directory.*
*Stack: React Native · Node.js · MySQL · Cloud Deployment*
*Versi 1.1 · Mei 2026*
