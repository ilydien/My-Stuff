# 07 — Proposal Desain & Implementasi Portfolio

**Tujuan:** menerjemahkan *prinsip* yang terukur dari situs referensi menjadi identitas visual orisinal untuk portfolio di bidang Data Science, Software Engineering, Machine Learning, dan Data Engineering.

**Status:** Fase 1 (ekstraksi) selesai; Fase 2 (arah desain) dipilih; Fase 3 (implementasi) sudah berjalan pada Astro.

---

## 1. Prinsip yang diambil vs yang ditinggalkan

| Prinsip referensi (terukur) | Adaptasi di portfolio | Tidak diambil |
|---|---|---|
| Grid editorial 3:1 dengan gutter besar (`1080/360` @1440) | Grid 12 kolom sendiri, header section 2 kolom | Angka & proporsi persisnya |
| Label teknis mono uppercase + penomoran modul | `Module.001 // Profile` — format sendiri | Teks "MODULE.001" milik Gundam |
| Disiplin hairline `#AEAEAE` 1 px | Token `--line` `#E3E3DE` | Nilai abu yang sama |
| Display grotesk tracking negatif (Manrope −3%) | Display **Inter 600**, tracking −4,2% | Manrope, ukuran 80 px |
| Chamfer 45° dua sudut | Chamfer 10 px pada tombol & tag, hanya 2 sudut | Polygon hasil copy |
| Sambungan: tepi datar + takik 46 px di 75% + garis vertikal | Geometri sama, warna & proporsi sendiri (`--blade-h`, takik 75%) | SVG path, warna `#AEAEAE`, grid 1080/360 milik situs |
| Hover "ambient blur" 1 s | Wash radial ber-tint, 700 ms, opacity 0,65 | `blur(40px)` + skala 0,7→1 |
| Palet monokrom + 1 aksen biru | Putih murni + ink + **rust** `#B4442A` + pine | Biru `#3860BE`, hitam-putih murni |
| Loader karakter | Tanpa maskot; hero reveal per baris | Karakter/logo apa pun |
| Poster vertikal 71/98 | Kartu kerja 16/10 & 4/3 | Rasio & artwork |

**Yang sama sekali tidak dipakai:** logo, wordmark GUNDAM, nama karakter, artwork, ilustrasi, ikon, suara, dan aset media apa pun.

---

## 2. Tiga arah desain

### Arah A — *Editorial Signal* ✅ dipilih

Hero gelap penuh, tipografi grotesk besar, label mono, garis rambut, dan satu warna sinyal. Terasa seperti jurnal teknis yang dicetak rapi: cocok untuk orang yang menjual **cara berpikir**, bukan sekadar daftar skill.

- Palet: paper `#FFFFFF`, ink `#121212`, rust `#B4442A`, pine `#1D4A42`, console `#101312`
- Display: Inter 600, tracking −0,042em · Teks: Inter 400 · Label: JetBrains Mono (semua self-hosted)
- Hero: latar `--console`, teks putih, header transparan lalu menjadi putih setelah melewati hero
- Motion: reveal 600 ms, hover 700–900 ms, easing `cubic-bezier(.5,0,0,1)`

### Arah B — *Data Console*

Seluruh situs gelap, dominan monospace, aksen hijau fosfor, panel seperti terminal observability.

- Kuat untuk audiens engineer, lemah untuk rekruter non-teknis; teks panjang melelahkan.
- Risiko: jatuh ke estetika "hacker" yang generik.

### Arah C — *Material Index*

Fotografi besar, warna netral hangat, tipografi sans besar, hampir tanpa garis.

- Paling "galeri", tapi tanpa aset foto berkualitas akan terlihat kosong.
- Kurang cocok untuk studi kasus yang butuh tabel metrik.

**Alasan memilih A:** memberi ruang untuk narasi + angka (metrik, tabel), tetap punya karakter kuat lewat kontras hero gelap, chamfer, dan tipografi grotesk, serta tidak bergantung pada fotografi yang belum tersedia.

---

## 3. Design system yang diimplementasikan

### 3.1 Color tokens (`src/styles/tokens.css`)

| Token | Nilai | Fungsi |
|---|---|---|
| `--paper` | `#FFFFFF` | Latar utama |
| `--paper-2` | `#F6F6F4` | Latar section alternatif |
| `--surface` | `#E8E4DA` | Placeholder media |
| `--ink` | `#121212` | Teks utama |
| `--ink-2` | `#4A4A45` | Teks sekunder |
| `--ink-3` | `#8A8880` | Metadata |
| `--line` / `--line-2` | `#E3E3DE` / `#C6C6C0` | Hairline |
| `--accent` | `#B4442A` | Aksen, hover judul, metrik |
| `--accent-2` | `#1D4A42` | Status, aksen sekunder |
| `--console` | `#101312` | Section gelap & footer |

### 3.2 Typography scale

`--fs-2xs` 10 → `--fs-4xl` clamp(56px, 11vw, 150px). Display memakai Inter 600 dengan `letter-spacing: -0.042em`; kata aksen italic memakai varian italic Inter. Label selalu mono uppercase `letter-spacing: .16em`.

### 3.3 Spacing & layout

Skala 4-based: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 200 px.
`--gutter: clamp(20px, 4vw, 60px)` · `--section-y: clamp(64px, 8vw, 128px)` · `--max-w: 1560px`.

### 3.4 Shape

`--chamfer: 10px` diterapkan lewat `clip-path` pada tombol, tag, dan tombol panah kartu.

Sambungan antar-section (`.blade`) memakai geometri hasil pengukuran referensi: tinggi `clamp(26px, 3.2vw, 46px)`, tepi atas datar, **takik 45° di 75%**, lalu permukaan kanan turun setinggi takik:

```css
clip-path: polygon(
  0 0,
  calc(75% - var(--blade-h)) 0,
  75% var(--blade-h),
  100% var(--blade-h),
  100% 100%,
  0 100%
);
border-top: 1px solid var(--line-2);
```

Garis vertikal di 75% digambar sebagai `background-image` pada `.console` dengan tinggi `clamp(160px, 15vw, 210px)` agar berhenti sebelum konten. Di bawah 860 px takik dan garis vertikal dimatikan (satu kolom).

### 3.5 Motion

| Token | Nilai | Pemakaian |
|---|---|---|
| `--dur-1` | 150 ms | state mikro (warna) |
| `--dur-2` | 250 ms | hover link |
| `--dur-3` | 400 ms | hover tombol, underline |
| `--dur-4` | 600 ms | reveal section, menu |
| `--dur-5` | 1000 ms | hero line reveal |
| `--ease-standard` | `cubic-bezier(.4,0,.2,1)` | standar |
| `--ease-expressive` | `cubic-bezier(.5,0,0,1)` | gerakan besar |
| `--ease-out-soft` | `cubic-bezier(.22,1,.36,1)` | reveal |

Semua dimatikan otomatis lewat `@media (prefers-reduced-motion: reduce)`.

---

## 4. Struktur halaman & sitemap

```
/                     Home — hero, 3 proyek, kapabilitas, kontak
/work                 Arsip proyek (4 kartu)
/work/[slug]          Studi kasus: konteks → pendekatan → hasil → proyek berikutnya
/about                Profil, pendekatan, kapabilitas, pengalaman
/contact              Kontak, ketersediaan, hal yang perlu disiapkan
```

**Alur naratif Home:** identitas → bukti (angka) → karya → kemampuan → pemikiran → ajakan.

## 5. Component hierarchy

```
BaseLayout
├── Header
│   ├── NavLink (desktop)
│   ├── Wordmark
│   └── MobileMenu
├── <main>
│   ├── Hero (eyebrow + title lines + facts)
│   ├── Stats
│   ├── Marquee
│   ├── SectionHead (label + title + description)
│   ├── WorkGrid → ProjectCard
│   ├── CapabilityGrid → Capability
│   ├── Timeline → TimelineRow
│   └── ConsoleSection (contact CTA)
└── Footer (meta bar)
```

Komponen yang bisa dipakai ulang di proyek lain: `ModuleLabel`, `SectionHead`, `ProjectCard`, `Blade`, `Button` (3 varian), `MetaTable`, `MetricGrid`.

---

## 6. Keputusan implementasi

| Keputusan | Alasan |
|---|---|
| **Astro** (static output) | Tanpa JS framework runtime; HTML statis, hidrasi hanya untuk motion |
| **Tailwind v4** + CSS token | Utility untuk layout, token CSS untuk identitas agar tidak bergantung pada class panjang |
| **Motion** (`inView`) | Reveal ringan; animasi lain CSS agar bisa di-audit |
| Tanpa gambar eksternal | Placeholder berupa gradien + grid + noise CSS; bebas lisensi |
| Konten terpusat di `src/data/site.ts` | Satu titik edit untuk mengganti seluruh isi |
| `prefers-reduced-motion` | Aksesibilitas & kepatuhan WCAG |
| Font self-hosted (`public/fonts/`) | Menghilangkan request pihak ketiga; 3 file woff2 ±105 kB |
| Hero gelap + header adaptif | Mengikuti pola referensi: header transparan di atas hero, putih setelah dilewati |

**Performa:** build 8 halaman, tanpa framework client-side; satu-satunya dependensi runtime adalah modul motion (±10 kB).

---

## 7. Yang perlu diganti sebelum publikasi

1. `src/data/site.ts` — nama, email, sosial, fokus, 4 proyek, pengalaman.
2. Angka metrik & deskripsi proyek (saat ini fiktif namun realistis).
3. `site` di `astro.config.mjs` → domain final.
4. Favicon `public/favicon.svg` → monogram final.
5. Opsional: foto profil & gambar studi kasus (menggantikan `figure-block` gradien).

## 8. Langkah lanjutan yang disarankan

- Halaman `notes/[slug]` dengan Markdown collections bila tulisan mulai rutin.
- OG image otomatis per halaman.
- Audit Lighthouse & uji keyboard pada menu mobile.
- Jika ingin efek lebih dekat ke referensi: tambahkan transisi halaman (View Transitions API) — belum diimplementasikan agar tidak menambah risiko.
