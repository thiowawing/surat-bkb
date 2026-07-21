# 📦 Sistem Bukti Keluar Barang (BKB) - PT Terex Indonesia

Sistem manajemen dokumen web sederhana berbasis **HTML5, CSS3, dan Vanilla JavaScript** untuk mengelola, membuat, serta mencetak **Bukti Keluar Barang (BKB)** pada PT Terex Indonesia.

---

## ✨ Fitur Utama

- **Aturan Penomoran Otomatis**: Format nomor dokumen otomatis tersusun rapi menggunakan format standar perusahaan:  
  `[Nomor Urut]/BKB/TRX/[Bulan Romawi]/[Tahun]` (Contoh: `001/BKB/TRX/VII/2026`).
- **Input Data Departemen**: Pencatatan unit/departemen penerima barang.
- **Tabel Barang Dinamis**: Kemampuan menambah atau menghapus baris barang (Kode, Serial Number, Deskripsi, Qty, Satuan, Keterangan) secara *real-time* di dalam form modal.
- **Sistem Cetak & Ekspor PDF**: Modul tampilan cetak terpisah yang siap di-print atau disimpan ke format PDF.
- **Otorisasi 4 Kolom Tanda Tangan**:
  - Penerima Barang
  - Pengirim / Logistik
  - Supervisor (SPV)
  - Manager Logistik (**Fariz Asad**)
- **Penyimpanan Lokal (LocalStorage)**: Data tersimpan di browser tanpa perlu *backend/database* tambahan.
- **Manajemen Data**: Fitur pencarian (*search*), pencetakan ulang, pengubahan (*edit*), penghapusan (*delete*), serta **Export JSON** & **Reset Data**.

---

## 📁 Struktur Berkas

```text
├── index.html     # Antarmuka pengguna (UI), modal form, dan template cetak
├── style.css      # Styling tampilan responsive & instruksi layout cetak (@media print)
├── app.js         # Logika aplikasi, pengelolaan CRUD, penomoran otomatis, & LocalStorage
└── README.md      # Dokumentasi proyek
