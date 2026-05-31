-- Supabase Setup Script for Android Map Directory

-- 1. Enable PostGIS for geographic coordinates (optional but recommended for maps)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  glyph VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Buildings Table
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Units Table
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  building_id INTEGER REFERENCES buildings(id),
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  floor VARCHAR(50),
  address TEXT,
  description TEXT,
  open_hours VARCHAR(100),
  status VARCHAR(20) DEFAULT 'open',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  coord_x INTEGER, -- Original design x coordinate
  coord_y INTEGER, -- Original design y coordinate
  rating NUMERIC(2, 1) DEFAULT 0.0,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Unit Rooms Table
CREATE TABLE unit_rooms (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_rooms ENABLE ROW LEVEL SECURITY;

-- 7. Create Public Access Policies
CREATE POLICY "Public Access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Access" ON buildings FOR SELECT USING (true);
CREATE POLICY "Public Access" ON units FOR SELECT USING (true);
CREATE POLICY "Public Access" ON unit_rooms FOR SELECT USING (true);

-- 8. Seed Categories
INSERT INTO categories (name, glyph, description) VALUES
('Departemen', 'dept', 'Kantor administrasi prodi · sekretariat, kaprodi, dosen.'),
('PAA', 'paa', 'Pelayanan Administrasi Akademik — surat, transkrip, legalisir.'),
('Kemahasiswaan', 'kemahasiswaan', 'Beasiswa, organisasi, konseling, dan kegiatan mahasiswa.'),
('Vokasi', 'vokasi', 'Sekretariat & unit pendukung Sekolah Vokasi.'),
('Kesehatan', 'kesehatan', 'Departemen rumpun ilmu kesehatan.'),
('Lab', 'lab', 'Laboratorium praktikum, riset, dan komputasi.');

-- 9. Seed Buildings
INSERT INTO buildings (name, code) VALUES
('Gedung TI', 'TI'),
('Gedung FKM', 'FKM'),
('Gedung FK', 'FK'),
('Gedung Vokasi', 'VOK'),
('Gedung Sipil', 'SIP'),
('Gedung Mesin', 'MSN'),
('Gedung Pusat', 'PST');

-- 10. Seed Units (Mapping IDs manually for simplicity in seeding)
-- Note: In a real app, lat/lng should be calculated from coord_x/y using the logic in units.ts
-- For seeding, I'll use the CAMPUS_CENTER -7.2754, 112.7974 as base.

INSERT INTO units (name, short_name, category_id, building_id, floor, address, open_hours, status, rating, coord_x, coord_y, description) VALUES
('Departemen Teknik Informatika', 'Dept. TI', 1, 1, 'Lt. 3', 'Jl. Teknik Kampus Blok F, No. 4', '08:00 – 16:00', 'open', 4.5, 252, 220, 'Kantor departemen — administrasi akademik mahasiswa S1 TI: KRS, transkrip, surat, bimbingan TA.'),
('PAA Teknik Informatika', 'PAA TI', 2, 1, 'Lt. 2', 'Jl. Teknik Kampus Blok F, No. 4', '08:00 – 15:30', 'open', 4.3, 252, 250, 'Pelayanan Administrasi Akademik departemen — legalisir, surat keterangan aktif, jadwal kuliah.'),
('Departemen Kesehatan Masyarakat', 'Dept. Kesmas', 5, 2, 'Lt. 2', 'Jl. Kesehatan Kampus Blok B, No. 12', '08:00 – 16:00', 'open', 4.4, 110, 150, 'Departemen Kesehatan Masyarakat — administrasi akademik FKM, ruang kaprodi, sekretariat program studi.'),
('Departemen Keperawatan', 'Dept. Kep', 5, 3, 'Lt. 4', 'Jl. Kesehatan Kampus Blok A, No. 1', '08:00 – 16:00', 'open', 4.2, 70, 200, NULL),
('Kemahasiswaan Vokasi', 'Kemahasiswaan Vokasi', 3, 4, 'Lt. 1', 'Jl. Vokasi Kampus Blok V, No. 8', '07:30 – 15:30', 'soon', 4.1, 180, 360, 'Unit Kemahasiswaan Sekolah Vokasi — beasiswa, organisasi, kegiatan, layanan konseling mahasiswa.'),
('Sekretariat Sekolah Vokasi', 'Sek. Vokasi', 4, 4, 'Lt. 2', 'Jl. Vokasi Kampus Blok V, No. 8', '08:00 – 16:00', 'open', 4.0, 200, 380, NULL),
('Lab Komputasi & Jaringan', 'Lab Komputasi', 6, 1, 'Lt. 4', 'Jl. Teknik Kampus Blok F, No. 4', '08:00 – 21:00', 'open', 4.6, 280, 210, NULL),
('Departemen Teknik Sipil', 'Dept. Sipil', 1, 5, 'Lt. 2', 'Jl. Teknik Kampus Blok G, No. 2', '08:00 – 16:00', 'open', 4.3, 305, 290, NULL),
('Departemen Teknik Mesin', 'Dept. Mesin', 1, 6, 'Lt. 1', 'Jl. Teknik Kampus Blok G, No. 4', '08:00 – 16:00', 'closed', 4.2, 320, 340, NULL);

-- 11. Seed Unit Rooms
INSERT INTO unit_rooms (unit_id, name, location) VALUES
(1, 'Ruang Kaprodi', 'Lt. 3 · R.301'),
(1, 'Sekretariat', 'Lt. 3 · R.302'),
(1, 'Ruang Dosen', 'Lt. 3 · R.310–320');
