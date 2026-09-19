# Product Requirements Document (PRD)
## Website Portofolio Personal — fLINK
**Versi:** 1.0.0  
**Tanggal:** Juni 2025  
**Author:** fLINK  
**Status:** Ready for Development

---

## 1. RINGKASAN EKSEKUTIF

### 1.1 Latar Belakang
fLINK adalah seorang PHP/Laravel Developer yang berbasis di Pekalongan, Indonesia, dengan pengalaman membangun sistem informasi pemerintah (SPBE, PPID, DAMAI, SIGAP) dan aplikasi mobile Flutter. Dibutuhkan sebuah website portofolio personal yang profesional, modern, dan dapat dikelola secara mandiri untuk mempresentasikan identitas profesional, keahlian teknis, dan portofolio proyek kepada calon klien maupun rekruter.

### 1.2 Tujuan Produk
- Membangun **personal branding** yang kuat sebagai Full-Stack Developer spesialis Laravel
- Menyediakan **CMS admin** agar konten dapat diubah tanpa menyentuh kode
- Menghasilkan kesan pertama yang **memukau secara visual** dengan tema teknologi cyberpunk
- Memfasilitasi **kontak langsung** dari calon klien/kolaborator

### 1.3 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Calon klien (bisnis/UMKM) | Melihat portofolio, menghubungi untuk project |
| Rekruter / HRD | Menilai skill dan pengalaman kerja |
| Instansi pemerintah | Melihat rekam jejak sistem yang pernah dibangun |
| fLINK (admin) | Mengelola konten portofolio secara mandiri |

---

## 2. SCOPE & BATASAN

### 2.1 Dalam Scope
- Website portofolio single-page (SPA scroll)
- Halaman login admin
- Dashboard admin dengan CRUD lengkap
- Backend Laravel sebagai API/CMS
- Responsive: mobile, tablet, desktop

### 2.2 Luar Scope
- Blog / artikel
- Multi bahasa (i18n)
- Dark/light mode toggle
- Fitur e-commerce / booking berbayar
- Multi-user admin

---

## 3. DESAIN & TEMA VISUAL

### 3.1 Design Language
**Tema:** Cyberpunk / Tech Dark  
**Mood:** Profesional, futuristik, high-tech, percaya diri

### 3.2 Palet Warna
```
--cyan:    #00f5ff   (aksen utama, glow, highlight)
--electric:#0080ff   (aksen sekunder, gradient)
--neon:    #39ff14   (status aktif, available)
--dark:    #020b18   (background utama)
--dark2:   #041428   (background card)
--dark3:   #061d36   (background card hover)
--text:    #c8e6f0   (teks utama)
--dim:     #6a9ab5   (teks sekunder)
```

### 3.3 Tipografi
| Peran | Font | Berat |
|-------|------|-------|
| Heading / Brand | Orbitron | 700, 900 |
| Body / UI | Rajdhani | 400, 500, 600, 700 |
| Monospace / Code / Label | Share Tech Mono | 400 |

### 3.4 Elemen Visual Wajib
- **Particle canvas background** — titik-titik terhubung garis, reaktif terhadap mouse
- **Grid overlay** — garis grid tipis cyberpunk
- **Scanline overlay** — efek monitor retro
- **Avatar ring** — cincin berputar dengan orbit dot, mendukung upload foto
- **Glassmorphism cards** — `backdrop-filter: blur`, border cyan tipis
- **Corner bracket decoration** — sudut kartu ala UI sci-fi
- **Glow effects** — `box-shadow` cyan pada elemen interaktif

---

## 4. ARSITEKTUR SISTEM

### 4.1 Stack Teknologi

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Frontend | HTML5 + CSS3 + Vanilla JS | — |
| CSS Framework | Bootstrap | 5.3.3 |
| Icons | Bootstrap Icons | 1.11.3 |
| Fonts | Google Fonts (Orbitron, Rajdhani, Share Tech Mono) | — |
| Backend | Laravel | 11.x |
| Language | PHP | 8.2+ |
| Database | MySQL | 8.0+ |
| Server | Nginx / Apache | — |
| Auth | Laravel built-in (session-based) | — |
| Storage | Laravel Storage + Symlink | — |
| Package | spatie/laravel-permission | — |
| Package | spatie/laravel-medialibrary | — |
| Package | spatie/laravel-activitylog | — |

### 4.2 Arsitektur Database

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐
│   profiles  │   │    skills    │   │   projects    │
│─────────────│   │──────────────│   │───────────────│
│ id (ULID)   │   │ id (ULID)    │   │ id (ULID)     │
│ name        │   │ name         │   │ name          │
│ title       │   │ category     │   │ description   │
│ description │   │ level 0-100  │   │ stack         │
│ email       │   │ color        │   │ github_url    │
│ phone       │   │ sort_order   │   │ demo_url      │
│ location    │   └──────────────┘   │ image_path    │
│ linkedin    │                      │ icon          │
│ github      │   ┌──────────────┐   │ sort_order    │
│ photo_path  │   │ experiences  │   │ is_featured   │
│ years_exp   │   │──────────────│   └───────────────┘
│ proj_count  │   │ id (ULID)    │
│ client_count│   │ start_year   │   ┌───────────────┐
│ freelance   │   │ end_year     │   │   messages    │
└─────────────┘   │ role         │   │───────────────│
                  │ company      │   │ id (ULID)     │
                  │ description  │   │ name          │
                  └──────────────┘   │ email         │
                                     │ subject       │
                                     │ message       │
                                     │ is_read       │
                                     │ ip_address    │
                                     └───────────────┘
```

### 4.3 Struktur Route Laravel

```
GET  /                          → Halaman publik portofolio
POST /contact                   → Kirim pesan kontak

GET  /login                     → Form login
POST /login                     → Proses autentikasi
POST /logout                    → Logout

GET  /admin                     → Dashboard admin
GET  /admin/profile/edit        → Edit profil
PUT  /admin/profile             → Simpan profil
POST /admin/profile/photo       → Upload foto profil

Resource /admin/skills          → CRUD skills
Resource /admin/projects        → CRUD projects
Resource /admin/experience      → CRUD pengalaman kerja

GET    /admin/messages          → Daftar pesan masuk
PATCH  /admin/messages/{id}/read → Tandai dibaca
DELETE /admin/messages/{id}     → Hapus pesan
```

### 4.4 Struktur Folder Views

```
resources/views/
├── portfolio.blade.php          ← Halaman publik (SPA)
├── auth/
│   └── login.blade.php
└── admin/
    ├── layout.blade.php         ← Master layout (sidebar + topbar)
    ├── dashboard.blade.php
    ├── profile/
    │   └── edit.blade.php
    ├── skills/
    │   └── index.blade.php
    ├── projects/
    │   └── index.blade.php
    ├── experience/
    │   └── index.blade.php
    └── messages/
        └── index.blade.php
```

---

## 5. FITUR DETAIL — FRONTEND PUBLIK

### 5.1 Navbar

| Properti | Spesifikasi |
|----------|-------------|
| Posisi | Fixed top |
| Background | `rgba(2,11,24,0.88)` + `backdrop-filter: blur(20px)` |
| Brand | "DEV_PORTO" — Orbitron font, warna cyan |
| Menu | Home, About, Skills, Projects, Experience, Contact |
| Scroll behavior | Active state berubah sesuai section yang terlihat |
| Mobile | Hamburger collapse, navbar-toggler icon cyan |
| Klik menu | Smooth scroll custom JS easing `easeInOutCubic` (bukan native) |

### 5.2 Section Home (Hero)

**Kiri:**
- Tag init: `> Initializing... System Ready_` (typing animasi)
- Nama: typing animation karakter per karakter — Orbitron 900
- Role: loop typing 4 role → "PHP Developer" → "Laravel Specialist" → "Flutter Developer" → "Full-Stack Engineer"
- Deskripsi singkat profil
- 2 CTA button: **[Lihat Projek]** (solid cyan) + **[Hubungi Saya]** (outline)
- Stat counter animasi: Years Exp / Projects / Clients

**Kanan:**
- Halo glow berdenyut (radial gradient, animasi `pulseHalo`)
- Ring berputar luar (1.5px solid, `spin 14s`)
- Ring putus-putus (dashed, `spin 9s reverse`)
- Ring dalam (1px, `spin 20s`)
- 3 orbit dot berputar (cyan, electric, neon)
- **Avatar inner**: lingkaran besar, counter-rotate (foto tetap tegak)
  - Default: icon `bi-code-slash`
  - Klik → upload foto dari device
  - Setelah upload: tampil foto dengan glow cyan

### 5.3 Section About

- **Kiri:** Card glass — teks deskripsi + tech badges
- **Kanan:** List info personal (Nama, Profesi, Email, Location, Bahasa, Status Freelance) + tombol Download CV
- Data diambil dari tabel `profiles` di database

### 5.4 Section Skills

- **Grid 6 skill card** (2 kolom) — masing-masing: icon, nama, progress bar warna custom, persentase
- Progress bar animasi muncul saat section masuk viewport (`IntersectionObserver`)
- **Panel Tools & Tech** (kanan) — badge-badge berdasarkan kategori: Backend, Frontend, Mobile, DevTools
- Data diambil dari tabel `skills`

### 5.5 Section Projects

- Grid 2 kolom, 4 card (atau sesuai data DB)
- Setiap card: nomor urut, nama, deskripsi, stack tag, link GitHub + Demo
- Icon Bootstrap di pojok kanan (dekoratif, opacity rendah)
- Hover: border cyan, glow, translateY(-6px)
- Data dari tabel `projects`

### 5.6 Section Experience

- Timeline vertikal dengan garis cyan gradient
- Setiap item: dot cyan, periode, jabatan, perusahaan, deskripsi
- Data dari tabel `experiences`

### 5.7 Section Contact

- **Kiri:** Teks pengantar + 4 kontak card (Email, WhatsApp, LinkedIn, GitHub)
- **Kanan:** Form glass (Nama, Email, Subjek, Pesan, tombol Kirim)
- Submit form → `POST /contact` → simpan ke tabel `messages`
- Flash message sukses setelah kirim

### 5.8 Float Action Button (FAB)

| Properti | Spesifikasi |
|----------|-------------|
| Posisi | Fixed, bottom-right |
| Ukuran | 54×54px, border-radius 50% |
| Background | Gradient cyan → electric |
| Muncul | Setelah scroll > 350px dari atas |
| Animasi muncul | Spring bounce `cubic-bezier(.34,1.56,.64,1)` |
| Klik | Smooth scroll ke atas (custom JS easing) |
| Efek pasif | Ripple ring berdenyut (`@keyframes rfab`) |
| Hover | `scale(1.1)`, glow intensif |

---

## 6. FITUR DETAIL — HALAMAN LOGIN

### 6.1 Desain

- Full-page centered, background particle canvas identik dengan portfolio
- Card glass dengan corner bracket decoration + scan line animation
- Logo ring dengan ikon shield-lock, animasi glow berdenyut
- Status indicator: 3 dot animasi + teks "SYSTEM ONLINE"

### 6.2 Form Fields

| Field | Type | Validasi |
|-------|------|----------|
| Email | email | required, valid email |
| Password | password | required |
| Ingat Saya | checkbox | optional |
| Lupa Password | link | — |

### 6.3 UX Flow

1. User mengisi email + password
2. Klik "MASUK" → button jadi loading state (spinner)
3. **Sukses** → redirect ke `/admin/dashboard`
4. **Gagal** → shake animation + alert merah + field border merah
5. Toggle show/hide password (icon mata)

---

## 7. FITUR DETAIL — ADMIN DASHBOARD

### 7.1 Layout

```
┌─────────────────────────────────────────┐
│            TOPBAR (64px fixed)          │
├─────────┬───────────────────────────────┤
│         │                               │
│ SIDEBAR │      MAIN CONTENT             │
│ (240px) │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

**Sidebar:**
- Brand logo + nama app
- Menu navigasi per section
- Badge count (jumlah skills/projects/pesan baru)
- User info + status online + tombol logout
- Mobile: slide-in drawer dengan overlay

**Topbar:**
- Judul halaman aktif
- Real-time clock (HH:MM:SS)
- Status indicator "LIVE"
- Hamburger toggle (mobile)

### 7.2 Halaman Dashboard

**Stat Cards (4 kartu):**
- Total Projects
- Skills Terdaftar
- Pengalaman Kerja
- Pesan Baru (badge merah)

**Tabel Project Terbaru** (5 teratas)

**Preview Pesan Masuk** (3 terbaru) dengan badge "BARU"

### 7.3 Halaman Profil & About

**Form Edit:**
- Nama Lengkap, Profesi/Jabatan
- Deskripsi singkat (textarea)
- Email, WhatsApp, Lokasi
- Status Freelance (dropdown: Available / Busy / Closed)
- LinkedIn URL, GitHub URL
- Years Exp, Total Projects, Total Clients (number input)

**Panel Foto Profil:**
- Preview lingkaran (identik avatar portfolio)
- Klik upload foto → preview langsung
- Validasi: JPG/PNG/WebP, max 2MB

**Panel Live Preview:**
- Tampil nama, email, WA, status langsung berubah saat form diedit (JS real-time)

### 7.4 Halaman Skills (CRUD)

**Tabel kolom:** Nama | Kategori | Level | Progress Bar | Aksi (Edit/Hapus)

**Modal Tambah/Edit:**
| Field | Type |
|-------|------|
| Nama Skill | text |
| Kategori | select: Backend/Frontend/Mobile/Database/DevTools |
| Level | range slider 0–100 dengan label live |
| Warna Bar | select preset gradient |

### 7.5 Halaman Projects (CRUD)

**Tabel kolom:** Nama | Deskripsi (truncated) | Stack | Aksi

**Modal Tambah/Edit:**
| Field | Type |
|-------|------|
| Nama Project | text |
| Stack / Teknologi | text (comma-separated) |
| Deskripsi | textarea |
| GitHub URL | url input |
| Demo URL | url input |
| Nama Icon | text (Bootstrap Icons name) |
| Nomor Urut | number |
| Gambar | file upload (optional) |

### 7.6 Halaman Experience (CRUD)

**Modal Tambah/Edit:**
| Field | Type |
|-------|------|
| Tahun Mulai | text |
| Tahun Selesai | text ("2024" atau "Sekarang") |
| Jabatan / Posisi | text |
| Perusahaan | text |
| Deskripsi | textarea |

### 7.7 Halaman Pesan Masuk

- List semua pesan dari form kontak publik
- Badge "BARU" untuk yang belum dibaca
- Setiap item: nama, email, subjek, isi pesan, waktu
- Aksi: Tandai Dibaca | Balas (mailto link) | Hapus
- Pesan baru otomatis highlight border cyan

### 7.8 Halaman Pengaturan

- Form ganti password (password lama, baru, konfirmasi)
- Panel info sistem (versi Laravel, PHP, MySQL, status server)

---

## 8. ANIMASI & INTERAKSI

### 8.1 Scroll Animation

```javascript
// Custom IntersectionObserver — bukan library AOS
// Atribut: data-a, data-a="left", data-a="right", data-a="zoom"
// Class .vis ditambah saat masuk viewport
// threshold: 0.1, rootMargin: "0px 0px -40px 0px"
// Transition: opacity .7s ease + transform .7s ease
// Delay via inline style: transition-delay: .1s
```

### 8.2 Smooth Scroll

```javascript
// Custom easing — BUKAN native scroll-behavior: smooth
function easeInOutCubic(t) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
}
// Durasi: 950ms untuk nav menu, 900ms untuk FAB
```

### 8.3 Typing Animation

```
Urutan:
1. Init text: "> Initializing... System Ready_" (typewriter, 55ms/char)
2. Nama: NAMA_ANDA (78ms/char, setelah init selesai)
3. Role: loop 4 role (68ms ketik, 38ms hapus, 1800ms pause)
```

### 8.4 Counter Animasi

- Dari 0 ke target dalam 36 frame (~800ms)
- Format: angka + "+"
- Mulai setelah halaman load 800ms

### 8.5 FAB Animasi

| Event | Animasi |
|-------|---------|
| Muncul (scroll > 350px) | Spring bounce + fade in |
| Menghilang | Fade out + slide down |
| Passive | Ripple ring expand + fade out, 2.2s loop |
| Hover | scale(1.1) + glow intensif |
| Active/Click | scale(0.9) |

---

## 9. RESPONSIVITAS

| Breakpoint | Behavior |
|------------|----------|
| Desktop (≥992px) | 2 kolom hero, sidebar dashboard 240px |
| Tablet (768–991px) | Stack hero vertikal, skill grid 2 col |
| Mobile (<768px) | Stack semua vertikal, avatar ring 270px, sidebar slide-in |

---

## 10. KEAMANAN

| Aspek | Implementasi |
|-------|-------------|
| Autentikasi | Laravel session-based auth, middleware `auth` |
| CSRF | Laravel CSRF token di semua form |
| Rate limiting | Laravel throttle pada route `/login` (5 attempts/menit) |
| Input validation | Laravel FormRequest validation |
| File upload | Validasi MIME type + max size server-side |
| SQL Injection | Eloquent ORM (parameterized queries) |
| XSS | Blade `{{ }}` auto-escape |
| Redirect | `redirect()->intended()` setelah login |

---

## 11. PERFORMA

| Target | Metrik |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 85 |
| Semua assets | Via CDN (Bootstrap, BI, Google Fonts) |
| Gambar | Resize + WebP di server via spatie/medialibrary |
| Canvas | requestAnimationFrame (tidak render saat tab tersembunyi) |

---

## 12. DEPLOYMENT

### 12.1 Environment

```env
APP_NAME="Portfolio fLINK"
APP_ENV=production
APP_URL=https://namaanda.com

DB_CONNECTION=mysql
DB_DATABASE=portfolio_db

FILESYSTEM_DISK=public
```

### 12.2 Checklist Deploy

- [ ] `php artisan key:generate`
- [ ] `php artisan migrate --seed`
- [ ] `php artisan storage:link`
- [ ] `php artisan config:cache`
- [ ] `php artisan route:cache`
- [ ] `php artisan view:cache`
- [ ] Nginx config `try_files $uri $uri/ /index.php?$query_string`
- [ ] HTTPS (SSL via Let's Encrypt)
- [ ] Cron job untuk `php artisan schedule:run`

---

## 13. TASK BREAKDOWN (Development)

### Sprint 1 — Setup & Foundation (2–3 hari)
- [ ] Buat project Laravel 11 baru
- [ ] Install & konfigurasi package (spatie/permission, medialibrary, activitylog)
- [ ] Buat semua migration & model (Profile, Skill, Project, Experience, Message)
- [ ] Jalankan seeder data awal
- [ ] Setup storage:link

### Sprint 2 — Autentikasi (1 hari)
- [ ] AuthController (login, logout)
- [ ] Blade view `auth/login.blade.php` (konversi dari `login.html`)
- [ ] Middleware `auth` pada group route admin
- [ ] Rate limiting route login

### Sprint 3 — Admin CMS (3–4 hari)
- [ ] Layout blade admin (sidebar + topbar)
- [ ] Dashboard blade (stat cards, preview tabel)
- [ ] ProfileController + view edit profil + upload foto
- [ ] SkillController + view index + modal CRUD
- [ ] ProjectController + view index + modal CRUD + upload gambar
- [ ] ExperienceController + view index + modal CRUD
- [ ] MessageController + view inbox + mark read + delete

### Sprint 4 — Frontend Publik (2–3 hari)
- [ ] `portfolio.blade.php` — konversi dari `portfolio.html`
- [ ] Ambil data dari DB: `$profile`, `$skills`, `$projects`, `$experiences`
- [ ] Form kontak → `POST /contact` → simpan ke DB
- [ ] Flash message sukses/error

### Sprint 5 — Polish & Deploy (1–2 hari)
- [ ] Review responsivitas semua halaman
- [ ] Test upload foto (profil + project)
- [ ] Test form kontak end-to-end
- [ ] Optimasi (`config:cache`, `route:cache`, `view:cache`)
- [ ] Deploy ke VPS (via 1Panel + Nginx)
- [ ] Konfigurasi domain + SSL

---

## 14. KREDENSIAL AWAL (Seeder)

```
URL Admin : /login
Email     : admin@portfolio.com
Password  : password123   ← WAJIB GANTI setelah deploy!
```

---

## 15. REFERENSI FILE YANG SUDAH DIBUAT

| File | Status |
|------|--------|
| `portfolio.html` | ✅ Selesai — frontend publik SPA |
| `login.html` | ✅ Selesai — halaman login admin |
| `admin-dashboard.html` | ✅ Selesai — dashboard admin (localStorage demo) |
| `portfolio-backend.zip` | ✅ Selesai — controllers, routes, migrations, seeder |

---

*PRD ini menggambarkan sistem berdasarkan implementasi yang telah didiskusikan dan di-build dalam sesi ini. Semua desain visual, animasi, dan logika sudah ter-implementasi di file HTML yang tersedia.*
