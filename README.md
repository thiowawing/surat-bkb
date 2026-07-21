# Sistem Surat Barang Keluar (BKB) - PT Terex

Aplikasi web manajemen Surat Bukti Barang Keluar (BKB) berbasis **HTML5, CSS3, JavaScript (ES6), dan JSON**.

## 🚀 Fitur Utama
- **Generasi Nomor BKB Otomatis**: Penomoran format `BKB/YYYY/MM/XXXX` bertambah secara berurutan.
- **Dynamic Items**: Bebas menambah & menghapus baris daftar barang beserta Serial Number (S/N).
- **Cetak Surat / Save PDF**: Tampilan cetak profesional lengkap dengan Kop Surat & Tanda Tangan.
- **Pencarian Real-Time**: Cari surat berdasarkan nomor, penerima, atau SPV.
- **Persistence Data**: Menggunakan `LocalStorage` & fallback ke `data.json`.
- **Export / Import JSON**: Fitur download cadangan data `data.json`.

## 📁 Struktur File Repository
```
├── index.html   # Antarmuka aplikasi web utama & template cetak
├── style.css    # Style UI modern & cetak print preview
├── app.js       # Logika interaktif CRUD & penomoran BKB
├── data.json    # Data dasar/contoh BKB
└── README.md    # Dokumentasi proyek
```

## 🌐 Cara Deploy ke GitHub Pages
1. Push seluruh file ke dalam repository GitHub Anda.
2. Buka **Settings** repository di GitHub.
3. Pilih menu **Pages** di panel sebelah kiri.
4. Pada bagian **Branch**, pilih `main` atau `master` dan folder `/ (root)`.
5. Klik **Save**. Situs Anda siap diakses secara online!
