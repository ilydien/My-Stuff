# 03b — Analisis Motion & Shape

**Situs referensi:** https://en.gundam-official.com/
**Tanggal observasi:** 19 November 2026
**Metode:** Playwright MCP, browser **Firefox**, viewport 1440×900 / 1280×800 / 768×1024 / 390×844
**Cakupan:** 6 URL sampel — `/`, `/series`, `/series/seed-freedom-zero`, `/news`, `/news/{id}`, `/product`

> Dokumen ini adalah hasil **Jalur B (Motion & Shape Extract)**. Modul `01`, `02`, `03`, `04`, `05`, `06` dari rencana awal **tidak dikerjakan** dan tidak diklaim sebagai selesai — lihat `README.md`.

## Legenda bukti

| Label | Arti |
|---|---|
| `[FAKTA]` | Dibaca langsung dari `getComputedStyle`, `CSSStyleSheet.cssRules`, instance library, atau respons jaringan |
| `[ESTIMASI]` | Diukur dari screenshot / rasio piksel, bukan nilai CSS |
| `[ASUMSI]` | Interpretasi penulis, disertai alasan |
| `[GAGAL]` | Tidak dapat diverifikasi di lingkungan ini |

---

## 1. Ringkasan teknologi

| Aspek | Temuan | Bukti |
|---|---|---|
| Framework | Next.js App Router (`/_next/static/chunks/app/[locale]/…`) | `[FAKTA]` daftar `<script src>` |
| UI kit | MUI (`MuiToolbar-root`, `MuiGrid-root`, `MuiCollapse-root`) | `[FAKTA]` class pada header & accordion |
| Carousel | Swiper (3 instance aktif di homepage) | `[FAKTA]` `el.swiper.params` |
| Consent | OneTrust (dialog blocking, muncul ulang per sesi baru) | `[FAKTA]` snapshot a11y |
| Font | `next/font`: Inter, JetBrains Mono, **Manrope**, Noto Sans JP/HK | `[FAKTA]` `--font-*` & `document.fonts` |
| Preloader | Layar "HARO Animation" + counter persen sebelum konten | `[FAKTA]` snapshot & keyframes |
| Media | Aset dari host terpisah `gundam-official.com/media/...` | `[FAKTA]` network log, HTTP 200 |

**Catatan arsitektur:** header memakai `position: fixed` dengan tinggi 92 px di desktop; isi header (bar putih) berada di elemen anak, bukan pada `<header>` itu sendiri (`[FAKTA]` background `header` = `rgba(0,0,0,0)`).

---

## 2. Shape language

Ini temuan paling menentukan karakter visual situs.

### 2.1 Chamfer (sudut terpotong 45°)

`[FAKTA]` 52 elemen memakai `clip-path: polygon(...)` dengan pola **sudut terpotong diagonal**, bukan `border-radius`.

| Nilai potongan | Pemakaian teramati | Contoh |
|---|---|---|
| `8px` | Tag / label kecil | `polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)` |
| `10.5px` | Tombol ikon 48×48 | `polygon(10.5px 0, …, 0 10.5px)` |
| `12px` | Panel / badge | `polygon(12px 0, …, 0 12px)` |
| `20px` | Blok besar | `polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)` |
| `30px` | Panel hero / kartu besar | `polygon(30px 0, …, 0 30px)` |

Pola dominan: **dua sudut terpotong berlawanan** (kiri-atas + kanan-bawah), bukan keempat sudut. Sudut lain memakai radius kecil 2–5 px `[FAKTA]` (`border-radius` terbanyak: `5px` ×17, `50%` ×12, `0px` ×10, `2px` ×10).

### 2.2 Bingkai tombol (double-chamfer)

`[FAKTA]` Tombol `VIEW ALL SERIES` (271×64 px) memakai polygon ~70 titik:

```
polygon(9.66px 1px, calc(100% - 4px) 1px, …, calc(100% - 0.5px) calc(100% - 10.16px),
        calc(100% - 7.18px) calc(100% - 2.03px), …, 9.66px calc(100% - 1px),
        4px calc(100% - 1px), …, 0.5px calc(100% - 4.5px), 0.5px 10.16px, …)
```

Diterjemahkan: **potongan 45° ~10 px di kiri-atas dan kanan-bawah**, radius 4 px di dua sudut lainnya, dengan inset 0,5–1 px sehingga terbentuk garis bingkai 1 px di dalam bentuk yang sama (`CommonButton_frameBorder` → `CommonButton_frame`, selisih ukuran 271×64 vs 269×62).

`[ESTIMASI]` Efek visualnya: tombol terlihat seperti pelat logam yang dipotong, bukan kotak rounded.

### 2.3 Sambungan antar-section (blade + notch)

`[FAKTA]` Peralihan antar-section memakai SVG 3002×46 px:

```html
<path d="M2967.04 1H0V46H3000V20.5L2972.49 2.61556C2970.86 1.5612 2968.97 1 2967.04 1Z" fill="#FFF"/>
<path d="M0 1H2966.97C2968.95 1 …L3001.5 22" stroke="#AEAEAE"/>
```

Dipetakan ke viewport 1440 (SVG berada di `x = -1921`, `y = 900`):

| Koordinat SVG | Posisi viewport | Arti |
|---|---|---|
| `M2967,1` | `x = 1046`, `y = 901` | awal takik |
| `3000,20.5` | `x = 1079`, `y = 920.5` | akhir takik |
| `L3001.5,22` | `x = 1080`, `y = 922` | ujung stroke |

Kesimpulan geometri:

- Tepi atas **datar** dari x=0 hingga x≈1046.
- **Takik hanya 34 px** (bukan diagonal panjang) dan berakhir tepat di **x = 1080 = 75% viewport**, yaitu batas grid `1080 / 360`.
- Turun 46 px; kolom kanan 25% punya tepi atas sendiri yang **46 px lebih rendah**.
- Gradien warna mengikuti section berikutnya (`#FFF`, `#222`, `#F0F0F0`); garis rambut `#AEAEAE` 1 px mengikuti tepi atas dan sisi takik.
- Di batas 75% terdapat **garis vertikal** yang turun melewati header section (±257 px) — elemen `SectionHeader_sectionHeader` selebar 1080 px.

`[ESTIMASI]` Efek visualnya: section berikutnya terlihat seperti "pelat" yang masuk dengan satu sudut terpotong, bukan transisi gradien. Ini berbeda dari kesan "diagonal panjang" bila hanya dilihat sekilas pada screenshot.

### 2.4 Rasio gambar

`[FAKTA]` `aspect-ratio` yang muncul: `71 / 98` (poster series), `190 / 107`, `140 / 79`, `210 / 118`, `2 / 1`, `1 / 1`.
Dominan **poster vertikal 0,72:1** untuk kartu series, **16:9** untuk thumbnail berita.

---

## 3. Warna

`[FAKTA]` Frekuensi nilai warna pada seluruh `cssRules` same-origin (45 teratas):

| Nilai | Kemunculan | Peran teramati |
|---|---|---|
| `rgb(255,255,255)` | 123 | Permukaan utama (light section), teks di atas gelap |
| `rgb(174,174,174)` `#AEAEAE` | 121 | **Hairline / border / stroke** — token paling sering |
| `rgb(34,34,34)` `#222222` | 88 | Teks utama & permukaan section gelap |
| `rgb(102,102,102)` `#666666` | 23 | Teks sekunder |
| `rgb(216,216,216)` `#D8D8D8` | 19 | Border sekunder |
| `rgb(240,240,240)` `#F0F0F0` | 13 | Latar kartu / panel netral |
| `rgb(56,96,190)` `#3860BE` | 13 | **Satu-satunya aksen berwarna** (biru) |
| `rgba(255,255,255,0.2)` | 14 | Overlay di atas gambar |
| `rgba(0,0,0,0.5)` | 8 | Scrim teks di atas media |

**Karakter:** palet hampir monokrom (putih / abu / hitam) dengan **satu** aksen biru yang dipakai sangat hemat. `[ESTIMASI]` Rasio luas: ±85% netral, <5% aksen.

Tidak ada CSS custom property warna di `:root` — hanya variabel font dan Swiper (`[FAKTA]` `customProps` = `--font-*`, `--swiper-*`).

---

## 4. Tipografi

`[FAKTA]` Skala terukur (viewport 1440):

| Peran | Family | Size / Line-height | Weight | Letter-spacing |
|---|---|---|---|---|
| Judul section (h2) | **Manrope** | 80 / 96 px | 600 | −2,4 px |
| Judul section (≤768) | Manrope | 56 / 56 px | 600 | −1,68 px |
| Judul halaman detail (h2) | Manrope | 56 / 63 px | 600 | −1,68 px |
| Judul panel (h1) | Manrope | 30 / 36 px | 700 | −3% |
| Judul kartu | **Inter** | 24 / 28,8 px | 600 | −2% |
| Body | Inter | 16 / 25,6 px | 400 | normal |
| Label / metadata | JetBrains Mono | 11–12 px | 400 | +0,1em, uppercase |

**Hierarki:** display Manrope (grotesk geometris, tracking negatif agresif) → Inter untuk teks & judul kartu → JetBrains Mono untuk label teknis uppercase. `[ESTIMASI]` Kombinasi ini yang memberi kesan "editorial + teknis" tanpa terlihat seperti template.

**Catatan:** `[GAGAL]` File font tidak diunduh/dianalisis; nilai di atas hanya hasil `getComputedStyle`.

---

## 5. Layout & spacing

`[FAKTA]` pada 1440×900:

| Elemen | Nilai |
|---|---|
| Gutter kiri/kanan | 60 px |
| Grid header section | 2 kolom `1080px` + `360px` (rasio 3:1) |
| Grid kartu series | 4,5 kartu × `320px`, `spaceBetween: 0`, free-mode |
| Padding section | `0 0 200px` (bawah), header section `40px 0 60px 60px` |
| Padding kartu konten | `100px 60px 80px` |
| Tinggi section homepage | 888 (hero) / 1315 / 1429 |
| Nav height | 92 px desktop, 54–93 px mobile |

Breakpoint yang benar-benar ada di stylesheet `[FAKTA]`: **1025, 768, 600, 530, 500, 480, 426, 425, 400, 320** px (plus `hover: none`, `orientation: landscape`, `prefers-reduced-motion`).

`[ESTIMASI]` Grid 12 kolom implisit (1080 + 360 = 1440 tanpa gap) dengan gutter 60 px, direplikasi pada semua halaman.

---

## 6. Motion

### 6.1 Token transisi terukur

`[FAKTA]` Nilai `transition` yang berulang pada elemen interaktif:

| Properti | Durasi | Easing | Pemakaian |
|---|---|---|---|
| `background-color` | 150 ms | `cubic-bezier(.4,0,.2,1)` | semua `button` |
| `background-color, color` | 200 ms | default | item nav |
| `box-shadow` | 300 ms | `cubic-bezier(.4,0,.2,1)` | `header` |
| `opacity` | 225 ms | `cubic-bezier(.4,0,.2,1)` | label |
| `width` | 500 ms | `cubic-bezier(.4,0,.2,1)` | underline/indikator |
| `opacity` | 500 ms | `ease-in-out` | deskripsi hero |
| `transform` | 1000 ms | `cubic-bezier(.25,0,0,1)` | video hero |
| seluruh kartu (wash) | 1000 ms | `cubic-bezier(.5,0,0,1)` | hover kartu series |
| bingkai tombol | 600 ms | `ease-in-out` | hover CTA |

**Easing signature:** `cubic-bezier(0.5, 0, 0, 1)` — mulai cepat, melambat panjang. Dipakai untuk gerakan besar (blur backdrop, scale).

### 6.2 Keyframes yang tersedia

`[FAKTA]` Enam keyframes milik situs (sisanya milik OneTrust/MUI):

| Nama | Isi | Fungsi teramati |
|---|---|---|
| `Header_fadeInSlideInLeft` | `translateX(-20px)` + opacity 0→1 | item nav masuk saat load |
| `Header_expandFromCenter` | `transform: scaleX(1)` | garis/underline melebar |
| `Header_clickRipple` | `scale(0)` → `scale(1)`, opacity 0,3 | ripple saat klik |
| `Accordion_slideDown` | `max-height 0→1000px`, `translateY(-10px→0)`, opacity | buka accordion |
| `Loading_blinkSteps` | opacity 1→0 bertahap (steps) | indikator loading |
| `HaroAnimation_loadingBlink` | opacity 1→0,3 | karakter loader |

### 6.3 Carousel

`[FAKTA]` Tiga instance Swiper aktif:

| Posisi | Efek | Speed | Loop | Autoplay | Slides |
|---|---|---|---|---|---|
| Hero | `fade` | 300 ms | ya | **tidak** | 5 |
| Baris series | `slide` + free-mode (momentum) | 300 ms | ya | tidak | 11 |
| Footer | `fade` | **1200 ms** | ya | **6000 ms**, `disableOnInteraction:false` | 19 |

`[ESTIMASI]` Footer berganti gambar latar tiap 6 detik dengan cross-fade 1,2 detik — gerakan paling lambat di seluruh situs.

### 6.4 Hover kartu series (efek signature)

`[FAKTA]`, diukur dengan sampling 150 ms selama 2 detik:

```
opacity:  0 → 0.08 → 0.60 → 0.85 → 0.95 → 0.99 → 1   (≈900 ms)
transform: matrix(0.70) → … → matrix(1.00)             (scale 0.7 → 1.0)
filter:    blur(40px)
transition: 1s cubic-bezier(0.5, 0, 0, 1)
z-index:   -1 (di belakang kartu)
```

Perubahan warna teks pada hover (`[FAKTA]`):

| Elemen | Sebelum | Sesudah |
|---|---|---|
| Judul | `#222222` | `#FFFFFF` |
| Deskripsi | `#666666` | `#FFFFFF` |
| Border pemisah | `#666666` | `#FFFFFF` |

**Perilaku:** poster yang di-hover memancarkan salinan buram dirinya sebagai latar, lalu teks di atasnya berubah putih. Efeknya seperti "cahaya ambient" dari artwork.

### 6.5 Hover CTA

`[FAKTA]` `VIEW ALL SERIES`: `background-color` bingkai luar `#222222` → `#AEAEAE`, transisi `0.6s ease-in-out`; teks tetap `#222222`.

### 6.6 Hover navigasi

`[GAGAL]` Tidak ada perubahan terukur pada anchor nav (`color`, `transform`, pseudo-element) setelah dua pengukuran dengan jeda 700–800 ms. `[ASUMSI]` Efek hover mungkin diterapkan lewat state React pada induk, atau memang minimal.

### 6.7 Sticky / scroll

`[FAKTA]` `header` = `position: fixed`, `top: 0`, `transform: none` pada scroll 0 / 900 / 2400 / 3000 px; `box-shadow: none` di semua posisi. Tidak ada hide-on-scroll.

`[ESTIMASI]` Situs mengandalkan kontras background section, bukan perubahan header.

### 6.8 Loader

`[FAKTA]` Ada layer loading dengan teks `LOADING : 24%` dan label `STANDBY`, memakai `HaroAnimation_loadingBlink`. `[ESTIMASI]` Loader menutup layar sampai aset WebGL/gambar siap; durasi bergantung jaringan.

### 6.9 Mobile menu

`[FAKTA]` Panel full-screen putih 390×863, link 30 px, muncul setelah klik tombol kiri-atas; menampilkan HOME / SERIES / NEWS / PRODUCTS / WHAT IS GUNDAM, daftar SNS, dan baris utilitas LOG IN + LANGUAGE.

`[GAGAL]` Durasi/easing animasi buka-tutup tidak terukur (panel sudah dalam posisi final saat snapshot diambil).

### 6.10 Page transition

`[GAGAL]` Tidak diuji navigasi antarhalaman dengan pengukuran kontinu; tidak ada klaim.

---

## 7. Interaksi lain yang terdokumentasi

| Elemen | Perilaku | Bukti |
|---|---|---|
| Baris series | Drag horizontal bebas (free-mode + momentum), 4,5 kartu terlihat | `[FAKTA]` params Swiper |
| Tombol panah series | Prev/next 48×48 px, border tipis | `[FAKTA]` rect |
| Filter berita | Pill `FILTER` + dropdown `Select region` | `[FAKTA]` snapshot `/news` |
| Pagination berita | Deret angka + elipsis (1 2 3 4 5 … 459) | `[FAKTA]` teks halaman |
| Ticker berita | Bar hitam di atas header, teks berjalan | `[FAKTA]` snapshot |

---

## 8. Yang tidak dapat diverifikasi

| Item | Sebab |
|---|---|
| Halaman `/product` | Menampilkan **"No Results Found"** — daftar produk tidak termuat di lingkungan ini `[FAKTA]` screenshot |
| Hover navigasi | Tidak ada perubahan terukur |
| Durasi loader | Bergantung jaringan |
| Page transition | Tidak diukur |
| File font asli | Hanya `getComputedStyle`, bukan aset |
| Efek hover pada `/series` listing | Tidak diuji terpisah dari homepage |

Semua nilai di atas berasal dari sesi 19 Nov 2026 dan dapat berubah bila situs diperbarui.

---

## 9. Lampiran bukti

**Screenshot** (`docs/website-analysis/screenshots/`):

`homepage-{desktop,laptop,tablet,mobile}.png` · `series-desktop.png`, `series-{tablet,mobile}-{top,mid,bottom}.png` · `series-detail-{desktop,laptop,tablet,mobile}.png` · `news-{desktop,laptop,tablet,mobile}.png` · `news-detail-{desktop,mobile}.png` · `product-{desktop,laptop,tablet,mobile}.png` · `interaction-series-card-hover.png` · `interaction-cta-hover.png` · `interaction-nav-hover.png` · `interaction-mobile-menu-open.png`

**Data mentah** (`docs/website-analysis/evidence/`):

`homepage-desktop-computed.*` · `homepage-dom-outline.*` · `homepage-shape.*` · `homepage-motion.*` · `homepage-swiper.*` · `series-desktop-computed.*` · `series-detail-desktop.*`

> File `.json` disimpan sebagai dump objek JavaScript (bukan JSON ketat) dan disertai versi `.parsed.json` yang valid.
