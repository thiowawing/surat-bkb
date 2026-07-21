// Data Default awal (digunakan jika localStorage kosong)
const defaultDataBKB = [
    {
        no_surat: "BKB/2026/07/0001",
        tanggal: "2026-07-21",
        nama_penerima: "Budi Santoso",
        departemen: "Maintenance & Operasional",
        nama_spv: "Ahmad Dahlan",
        alamat_penerima: "Site Project Cikarang, Jl. Industri Selatan No. 12",
        items: [
            {
                kode: "BRG-001",
                sn: "SN-9823112",
                nama: "Filter Hydraulic Unit",
                qty: 2,
                satuan: "Pcs",
                ket: "Rutai Replacement"
            }
        ]
    }
];

// Inisialisasi Data dari LocalStorage atau Default
let dataBKB = JSON.parse(localStorage.getItem('dataBKB')) || defaultDataBKB;

// Jalankan fungsi awal saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    tampilkanData();
});

// 1. FUNGSI TAMPILKAN DATA KE TABEL UTAMA
function tampilkanData(dataUntukDitampilkan = dataBKB) {
    const tbody = document.getElementById('tabelBKB');
    tbody.innerHTML = '';

    if (dataUntukDitampilkan.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888;">Tidak ada data Bukti Keluar Barang (BKB).</td></tr>`;
        return;
    }

    dataUntukDitampilkan.forEach((item, index) => {
        // Format Tanggal Ke DD/MM/YYYY
        const tglFormatted = formatDateToID(item.tanggal);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td><strong>${item.no_surat}</strong></td>
            <td>${tglFormatted}</td>
            <td>${item.nama_penerima}</td>
            <td>${item.departemen || '-'}</td>
            <td>${item.nama_spv}</td>
            <td style="text-align: center;">
                <button class="btn btn-secondary" style="padding: 5px 8px;" onclick="cetakBKB(${index})" title="Cetak / PDF">
                    <i class="fa-solid fa-print"></i>
                </button>
                <button class="btn btn-secondary" style="padding: 5px 8px; background-color: #f39c12; color: #fff;" onclick="editBKB(${index})" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-secondary" style="padding: 5px 8px; background-color: #e74c3c; color: #fff;" onclick="hapusBKB(${index})" title="Hapus">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 2. FUNGSI MODAL (BUKA / TUTUP)
function bukaModalTambah() {
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-file-circle-plus"></i> Form Buat Bukti Keluar Barang';
    document.getElementById('formBKB').reset();
    document.getElementById('editIndex').value = '-1';
    
    // Set Tanggal Hari Ini secara otomatis
    document.getElementById('tanggal').valueAsDate = new Date();
    
    // Auto Generate No. BKB
    document.getElementById('no_surat').value = generateNoSurat();
    
    // Reset Baris Barang & Tambah 1 baris kosong
    document.getElementById('containerBarang').innerHTML = '';
    tambahBarisBarang();

    document.getElementById('modalBKB').style.display = 'block';
}

function tutupModal() {
    document.getElementById('modalBKB').style.display = 'none';
}

// 3. FUNGSI BARIS BARANG DINAMIS IN MODAL
function tambahBarisBarang(dataBarang = {}) {
    const container = document.getElementById('containerBarang');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="item-kode" value="${dataBarang.kode || ''}" placeholder="Kode" required></td>
        <td><input type="text" class="item-sn" value="${dataBarang.sn || ''}" placeholder="Serial No."></td>
        <td><input type="text" class="item-nama" value="${dataBarang.nama || ''}" placeholder="Nama / Deskripsi Barang" required></td>
        <td><input type="number" class="item-qty" value="${dataBarang.qty || 1}" min="1" required style="width:100%;"></td>
        <td><input type="text" class="item-satuan" value="${dataBarang.satuan || 'Pcs'}" placeholder="Satuan" required></td>
        <td><input type="text" class="item-ket" value="${dataBarang.ket || ''}" placeholder="Ket"></td>
        <td style="text-align: center;">
            <button type="button" class="btn" style="background: #e74c3c; color: #fff; padding: 4px 8px;" onclick="hapusBarisBarang(this)">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;
    container.appendChild(tr);
}

function hapusBarisBarang(btn) {
    const container = document.getElementById('containerBarang');
    if (container.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        tampilkanAlert("Minimal harus ada 1 barang!", "warning");
    }
}

// 4. FUNGSI SIMPAN (TAMBAH & EDIT)
function simpanBKB(e) {
    e.preventDefault();

    const editIndex = parseInt(document.getElementById('editIndex').value);
    
    // Ambil Data Barang dari Tabel Modal
    const itemRows = document.querySelectorAll('#containerBarang tr');
    const listBarang = [];

    itemRows.forEach(row => {
        listBarang.push({
            kode: row.querySelector('.item-kode').value.trim(),
            sn: row.querySelector('.item-sn').value.trim(),
            nama: row.querySelector('.item-nama').value.trim(),
            qty: parseInt(row.querySelector('.item-qty').value) || 1,
            satuan: row.querySelector('.item-satuan').value.trim(),
            ket: row.querySelector('.item-ket').value.trim()
        });
    });

    const payload = {
        no_surat: document.getElementById('no_surat').value,
        tanggal: document.getElementById('tanggal').value,
        nama_penerima: document.getElementById('nama_penerima').value.trim(),
        departemen: document.getElementById('departemen').value.trim(),
        nama_spv: document.getElementById('nama_spv').value.trim(),
        alamat_penerima: document.getElementById('alamat_penerima').value.trim(),
        items: listBarang
    };

    if (editIndex === -1) {
        // Mode Tambah
        dataBKB.unshift(payload);
        tampilkanAlert("Bukti Keluar Barang berhasil dibuat!", "success");
    } else {
        // Mode Edit
        dataBKB[editIndex] = payload;
        tampilkanAlert("Bukti Keluar Barang berhasil diperbarui!", "success");
    }

    simpanKeLocalStorage();
    tampilkanData();
    tutupModal();
}

// 5. FUNGSI EDIT DATA BKB
function editBKB(index) {
    const data = dataBKB[index];
    
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Bukti Keluar Barang';
    document.getElementById('editIndex').value = index;
    
    document.getElementById('no_surat').value = data.no_surat;
    document.getElementById('tanggal').value = data.tanggal;
    document.getElementById('nama_penerima').value = data.nama_penerima;
    document.getElementById('departemen').value = data.departemen || '';
    document.getElementById('nama_spv').value = data.nama_spv;
    document.getElementById('alamat_penerima').value = data.alamat_penerima || '';

    // Isi Baris Barang
    const container = document.getElementById('containerBarang');
    container.innerHTML = '';
    
    if (data.items && data.items.length > 0) {
        data.items.forEach(item => tambahBarisBarang(item));
    } else {
        tambahBarisBarang();
    }

    document.getElementById('modalBKB').style.display = 'block';
}

// 6. FUNGSI HAPUS BKB
function hapusBKB(index) {
    if (confirm(`Apakah Anda yakin ingin menghapus data BKB: ${dataBKB[index].no_surat}?`)) {
        dataBKB.splice(index, 1);
        simpanKeLocalStorage();
        tampilkanData();
        tampilkanAlert("Data BKB berhasil dihapus.", "success");
    }
}

// 7. FUNGSI CETAK / PDF TEMPLATE
function cetakBKB(index) {
    const data = dataBKB[index];

    // Map data ke template area cetak
    document.getElementById('printNoSurat').innerText = data.no_surat;
    document.getElementById('printTanggal').innerText = `Tanggal: ${formatDateToID(data.tanggal)}`;
    document.getElementById('printPenerima').innerText = data.nama_penerima;
    document.getElementById('printDepartemen').innerText = data.departemen || '-';
    document.getElementById('printAlamat').innerText = data.alamat_penerima || '-';
    document.getElementById('printSPV').innerText = data.nama_spv;

    // Tanda Tangan nama
    document.getElementById('printSignPenerima').innerText = data.nama_penerima;
    document.getElementById('printSignSPV').innerText = data.nama_spv;

    // Render Tabel Barang Cetak
    const containerItemCetak = document.getElementById('printContainerBarang');
    containerItemCetak.innerHTML = '';

    data.items.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;">${idx + 1}</td>
            <td>${item.kode || '-'}</td>
            <td>${item.sn || '-'}</td>
            <td>${item.nama}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: center;">${item.satuan}</td>
            <td>${item.ket || '-'}</td>
        `;
        containerItemCetak.appendChild(tr);
    });

    // Panggil dialog Print Browser
    window.print();
}

// 8. FUNGSI PENCARIAN (SEARCH)
function cariData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = dataBKB.filter(item => {
        return (
            item.no_surat.toLowerCase().includes(keyword) ||
            item.nama_penerima.toLowerCase().includes(keyword) ||
            (item.departemen && item.departemen.toLowerCase().includes(keyword)) ||
            item.nama_spv.toLowerCase().includes(keyword)
        );
    });
    tampilkanData(filteredData);
}

// 9. FUNGSI EXPORT DATA JSON
function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataBKB, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Data_BKB_PT_Terex_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// 10. FUNGSI RESET DATA KE DEFAULT
function resetKeDefault() {
    if (confirm("Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi default?")) {
        dataBKB = [...defaultDataBKB];
        simpanKeLocalStorage();
        tampilkanData();
        tampilkanAlert("Data berhasil direset ke default JSON.", "success");
    }
}

// FUNGSI HELPER / UTILITY
function generateNoSurat() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const runningNum = String(dataBKB.length + 1).padStart(4, '0');
    
    return `BKB/${yyyy}/${mm}/${runningNum}`;
}

function formatDateToID(dateString) {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

function simpanKeLocalStorage() {
    localStorage.setItem('dataBKB', JSON.stringify(dataBKB));
}

function tampilkanAlert(pesan, jenis = "success") {
    const alertBox = document.getElementById('alertBox');
    const alertIcon = document.getElementById('alertIcon');
    const alertText = document.getElementById('alertText');

    alertText.innerText = pesan;

    if (jenis === "success") {
        alertBox.style.backgroundColor = "#2ecc71";
        alertIcon.className = "fa-solid fa-circle-check";
    } else if (jenis === "warning") {
        alertBox.style.backgroundColor = "#e67e22";
        alertIcon.className = "fa-solid fa-triangle-exclamation";
    } else {
        alertBox.style.backgroundColor = "#e74c3c";
        alertIcon.className = "fa-solid fa-circle-exclamation";
    }

    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}
