# Website Analysis — en.gundam-official.com

Dokumentasi hasil observasi situs referensi dan keputusan desain untuk portfolio pribadi.

## Status modul

| Modul | Status | Catatan |
|---|---|---|
| `01-reconnaissance.md` | ⏸ tidak dikerjakan | Digantikan jalur cepat (Motion & Shape Extract). Peta URL inti tercatat di `03b`. |
| `02-dom-analysis.md` | ⏸ tidak dikerjakan | Outline DOM mentah tersedia di `evidence/homepage-dom-outline.parsed.json`. |
| `03-visual-analysis.md` | ⏸ tidak dikerjakan | Token warna, tipografi, spacing tercatat di `03b`. |
| `03b-motion-and-shape.md` | ✅ selesai | Fokus: shape language, warna, tipografi, layout, motion, interaksi. |
| `04-interaction-analysis.md` | ⏸ tidak dikerjakan | Hasil uji hover/carousel/sticky/mobile menu tercatat di `03b`. |
| `05-responsive-analysis.md` | ⏸ tidak dikerjakan | Screenshot 4 viewport tersedia; breakpoint terdokumentasi di `03b`. |
| `06-design-system.md` | ⏸ tidak dikerjakan | Digabung ke dalam `07` §3. |
| `07-portfolio-proposal.md` | ✅ selesai | 3 arah desain, token, komponen, keputusan teknologi. |

Keputusan untuk melewati modul 01–06 diambil bersama pemilik proyek (Jalur B) agar analisis berhenti pada hal yang langsung memengaruhi implementasi. Modul yang ditandai ⏸ **tidak diklaim selesai**.

## Struktur direktori

```
docs/website-analysis/
├── README.md                     ← file ini
├── 03b-motion-and-shape.md       ← hasil ekstraksi
├── 07-portfolio-proposal.md      ← arah desain & implementasi
├── screenshots/                  ← bukti visual situs referensi
└── evidence/                     ← data mentah (dump computed style, DOM, Swiper)
```

## Konvensi screenshot

`{halaman}-{viewport}.png` untuk tampilan penuh, `{halaman}-{viewport}-{top|mid|bottom}.png` bila halaman terlalu panjang (> 24.000 px), dan `interaction-{nama}.png` untuk state interaksi.

## Konvensi bukti

Setiap klaim di `03b` diberi label `[FAKTA]`, `[ESTIMASI]`, `[ASUMSI]`, atau `[GAGAL]`. Nilai `[FAKTA]` dapat ditelusuri ke file di `evidence/`.

> Catatan: `browser_evaluate` menyimpan hasil sebagai dump objek JavaScript. File `*.parsed.json` adalah versi JSON ketat yang bisa dibaca tooling.

## Batasan lingkungan

- Browser: **Firefox** via Playwright MCP (sesuai aturan proyek).
- Consent OneTrust menutupi konten sampai ditolak; setiap sesi baru perlu menanganinya.
- Halaman `/product` menampilkan "No Results Found" sehingga isi katalog tidak dapat dianalisis.
- Konten situs berubah-ubah; seluruh angka berlaku untuk 19 November 2026.
