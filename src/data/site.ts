/**
 * SINGLE SOURCE OF TRUTH — ganti isi file ini untuk mengubah seluruh konten situs.
 * Semua nilai di bawah adalah PLACEHOLDER. Tidak ada data nyata di sini.
 */

export const site = {
  name: "Raka Pratama",
  initials: "RP",
  role: "Data Scientist & ML Engineer",
  tagline:
    "Membangun sistem data yang tidak hanya akurat, tetapi juga bisa dijelaskan, dipantau, dan dirawat.",
  location: "Jakarta, Indonesia",
  timezone: "GMT+7",
  email: "hello@example.com",
  availability: "Terbuka untuk kolaborasi Q1 2027",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Kaggle", href: "https://kaggle.com/" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
  focus: [
    "Forecasting & time-series",
    "Recommendation systems",
    "ML platform & MLOps",
    "Data modelling",
  ],
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  role: string;
  client: string;
  stack: string[];
  summary: string;
  art: { a: string; b: string };
  metrics: { value: string; label: string }[];
  problem: string;
  approach: string[];
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "demand-forecasting",
    index: "001",
    title: "Demand forecasting untuk 1.400 SKU",
    year: "2026",
    role: "Lead Data Scientist",
    client: "Retail & distribusi",
    stack: ["Python", "PyTorch", "Airflow", "BigQuery"],
    summary:
      "Mengganti forecast berbasis spreadsheet dengan model hierarkis yang memperhitungkan promosi, hari libur, dan kanibalisasi antar-SKU.",
    art: { a: "#c0492b", b: "#1d4a42" },
    metrics: [
      { value: "-31%", label: "Mean absolute percentage error" },
      { value: "1.400", label: "SKU tercakup" },
      { value: "9", label: "Region operasional" },
    ],
    problem:
      "Tim perencanaan menghabiskan tiga hari setiap bulan untuk menyusun forecast manual. Akurasinya rendah pada SKU bermusim, dan tidak ada mekanisme untuk menjelaskan angka ke tim finance.",
    approach: [
      "Membangun hierarki forecast regional → kategori → SKU dengan rekonsiliasi bottom-up.",
      "Menambahkan fitur promosi, kalender libur, dan lag kompetitor sebagai kovariat eksogen.",
      "Menulis lapisan penjelasan per-SKU: faktor mana yang menggeser prediksi dan seberapa besar.",
      "Menyediakan pipeline backfill dan monitoring drift harian di Airflow.",
    ],
    outcome:
      "Forecast bulanan kini selesai dalam sembilan menit, dengan MAPE turun 31% dibanding baseline. Tim finance menerima dekomposisi kontribusi per faktor untuk setiap angka yang dipakai.",
  },
  {
    slug: "realtime-fraud",
    index: "002",
    title: "Deteksi fraud real-time di jalur pembayaran",
    year: "2025",
    role: "ML Engineer",
    client: "Fintech",
    stack: ["Go", "Kafka", "Redis", "XGBoost"],
    summary:
      "Sistem scoring di bawah 40 ms dengan feature store streaming, aturan berlapis, dan jalur audit untuk setiap keputusan yang ditolak.",
    art: { a: "#2f5bff", b: "#c0492b" },
    metrics: [
      { value: "38 ms", label: "Latensi p99" },
      { value: "+18%", label: "Fraud tertangkap" },
      { value: "0.4%", label: "False positive" },
    ],
    problem:
      "Model batch harian membuat transaksi berisiko tinggi lolos sebelum aturan diperbarui. Tim risiko tidak bisa mereproduksi alasan penolakan saat nasabah mengajukan banding.",
    approach: [
      "Memindahkan 60 fitur ke feature store streaming dengan jendela 30 detik sampai 30 hari.",
      "Menjalankan model gradient boosting di sidecar Go dengan model yang di-hot-swap tanpa downtime.",
      "Menyimpan snapshot fitur dan versi model untuk setiap keputusan agar bisa diaudit.",
      "Membangun dashboard drift dan simulasi threshold untuk tim risiko.",
    ],
    outcome:
      "Deteksi naik 18% pada volume yang sama, sementara false positive turun ke 0,4%. Setiap penolakan kini punya jejak audit yang bisa direproduksi dalam hitungan detik.",
  },
  {
    slug: "data-platform",
    index: "003",
    title: "Platform data dari nol untuk 40 analis",
    year: "2024",
    role: "Data Engineer",
    client: "Marketplace",
    stack: ["dbt", "Snowflake", "Terraform", "Dagster"],
    summary:
      "Menyatukan tujuh sumber data terpisah menjadi satu lapisan semantik dengan kontrak data, pengujian otomatis, dan biaya yang bisa diprediksi.",
    art: { a: "#1d4a42", b: "#d9a441" },
    metrics: [
      { value: "7 → 1", label: "Sumber kebenaran" },
      { value: "-42%", label: "Biaya query warehouse" },
      { value: "99.2%", label: "Uptime pipeline" },
    ],
    problem:
      "Setiap tim punya definisi metriknya sendiri. Angka pendapatan berbeda di tiga dashboard, dan tidak ada yang bisa menjelaskan mana yang benar.",
    approach: [
      "Memetakan 120 metrik ke satu model semantik dengan pemilik yang jelas.",
      "Menulis 400+ pengujian data: uniqueness, referential integrity, dan anomaly threshold.",
      "Menerapkan kontrak data antar-domain dengan versioning dan proses deprecation.",
      "Menata ulang partisi dan clustering untuk memotong biaya scan.",
    ],
    outcome:
      "Satu definisi metrik dipakai seluruh perusahaan. Biaya warehouse turun 42% pada kuartal pertama, dan waktu onboarding analis baru turun dari dua minggu menjadi tiga hari.",
  },
  {
    slug: "document-intelligence",
    index: "004",
    title: "Ekstraksi dokumen dengan human-in-the-loop",
    year: "2024",
    role: "Applied Scientist",
    client: "Asuransi",
    stack: ["Python", "LayoutLM", "FastAPI", "Postgres"],
    summary:
      "Pipeline ekstraksi klaim yang menggabungkan model vision-language dengan antrean verifikasi, sehingga akurasi naik tanpa menambah kepala.",
    art: { a: "#6b4fa8", b: "#c0492b" },
    metrics: [
      { value: "94%", label: "Field accuracy" },
      { value: "-58%", label: "Waktu proses klaim" },
      { value: "12k", label: "Dokumen / bulan" },
    ],
    problem:
      "Petugas mengetik ulang data dari ribuan PDF setiap bulan. Kesalahan ketik menunda pembayaran dan sulit dilacak ke sumbernya.",
    approach: [
      "Melatih model ekstraksi layout-aware pada 8.000 dokumen berlabel.",
      "Merancang routing keyakinan: field dengan confidence rendah masuk antrean manusia.",
      "Menyimpan bounding box sumber untuk setiap field agar hasil bisa diverifikasi.",
      "Membangun loop umpan balik: koreksi petugas menjadi data latih berikutnya.",
    ],
    outcome:
      "Waktu proses klaim turun 58% dan akurasi field mencapai 94%. Model diperbarui setiap dua minggu dari koreksi nyata, bukan dari dataset statis.",
  },
];

export const capabilities = [
  {
    index: "01",
    title: "Modelling & Experiment",
    items: [
      "Forecasting hierarkis",
      "Ranking & rekomendasi",
      "Computer vision terapan",
      "Desain eksperimen A/B",
    ],
  },
  {
    index: "02",
    title: "Data Engineering",
    items: [
      "Batch & streaming pipeline",
      "Dimensional modelling",
      "Kontrak & kualitas data",
      "Orkestrasi & observability",
    ],
  },
  {
    index: "03",
    title: "ML Platform",
    items: [
      "Feature store",
      "Deployment & rollback",
      "Monitoring drift",
      "Evaluasi berkelanjutan",
    ],
  },
  {
    index: "04",
    title: "Komunikasi & Produk",
    items: [
      "Penjelasan model",
      "Prioritisasi use case",
      "Mentoring tim",
      "Dokumentasi keputusan",
    ],
  },
];

export const experience = [
  {
    period: "2024 — sekarang",
    role: "Lead Data Scientist",
    org: "Perusahaan retail nasional",
    place: "Jakarta",
  },
  {
    period: "2022 — 2024",
    role: "Senior ML Engineer",
    org: "Platform pembayaran",
    place: "Singapura",
  },
  {
    period: "2020 — 2022",
    role: "Data Engineer",
    org: "Marketplace regional",
    place: "Jakarta",
  },
  {
    period: "2019 — 2020",
    role: "Research Assistant",
    org: "Laboratorium pembelajaran mesin",
    place: "Bandung",
  },
];

