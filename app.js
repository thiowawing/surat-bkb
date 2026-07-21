let dataBKB = JSON.parse(localStorage.getItem('dataBKB')) || [];

document.addEventListener('DOMContentLoaded', () => {
    tampilkanData();
});

// Fungsi untuk mengonversi angka bulan menjadi Romawi
function getRomawiBulan(bulan) {
    const romawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    return romawi[bulan];
}

function tampilkanData(filterData = null) {
    const tbody = document.getElementById('tabelBKB');
    tbody.innerHTML = '';
    const list = filterData || dataBKB;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data BKB</td></tr>`;
        return;
    }

    list.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td><strong>${item.no_surat}</strong></td>
                <td>${item.tanggal}</td>
                <td>${item.nama_penerima}</td>
                <td>${item.nama_manager || 'Fariz Asad'}</td>
                <td>${item.nama_spv}</td>
                <td style="text-align:center;">
                    <button class="btn btn-info" onclick="cetakBKB(${index})" title="Cetak BKB"><i class="fa-solid fa-print"></i></button>
                    <button class="btn btn-danger" onclick="hapusBKB(${index})" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function bukaModalTambah() {
    document.getElementById('formBKB').reset();
    document.getElementById('editIndex').value = "-1";
    document.getElementById('containerBarang').innerHTML = '';
    
    const hariIni = new Date();
    const thn = hariIni.getFullYear();
    const blnRomawi = getRomawiBulan(hariIni.getMonth()); // Mengambil bulan romawi
    const nomor = String(dataBKB.length + 1).padStart(3, '0'); // 001, 002, dst.

    // Format Baru: 001/BKB/TRX/VII/2026
    document.getElementById('no_surat').value = `${nomor}/BKB/TRX/${blnRomawi}/${thn}`;
    document.getElementById('tanggal').valueAsDate = hariIni;
    document.getElementById('nama_manager').value = "Fariz Asad";

    // Tambah 1 baris barang default
    tambahBarisBarang();

    document.getElementById('modalBKB').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('modalBKB').style.display = 'none';
}

function tambahBarisBarang() {
    const container = document.getElementById('containerBarang');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="item-kode" placeholder="Kode" required style="width:100%"></td>
        <td><input type="text" class="item-sn" placeholder="S/N" style="width:100%"></td>
        <td><input type="text" class="item-nama" placeholder="Nama Barang" required style="width:100%"></td>
        <td><input type="number" class="item-qty" value="1" min="1" required style="width:100%"></td>
        <td><input type="text" class="item-satuan" value="Pcs" style="width:100%"></td>
        <td><input type="text" class="item-ket" placeholder="Ket" style="width:100%"></td>
        <td style="text-align:center;"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()">&times;</button></td>
    `;
    container.appendChild(row);
}

function simpanBKB(e) {
    e.preventDefault();
    
    const items = [];
    document.querySelectorAll('#containerBarang tr').forEach(row => {
        items.push({
            kode: row.querySelector('.item-kode').value,
            sn: row.querySelector('.item-sn').value,
            nama: row.querySelector('.item-nama').value,
            qty: row.querySelector('.item-qty').value,
            satuan: row.querySelector('.item-satuan').value,
            ket: row.querySelector('.item-ket').value
        });
    });

    const bkbBaru = {
        no_surat: document.getElementById('no_surat').value,
        tanggal: document.getElementById('tanggal').value,
        nama_penerima: document.getElementById('nama_penerima').value,
        nama_manager: document.getElementById('nama_manager').value,
        nama_spv: document.getElementById('nama_spv').value,
        alamat_penerima: document.getElementById('alamat_penerima').value,
        items: items
    };

    dataBKB.push(bkbBaru);
    localStorage.setItem('dataBKB', JSON.stringify(dataBKB));
    
    tutupModal();
    tampilkanData();
}

function hapusBKB(index) {
    if (confirm("Yakin ingin menghapus data BKB ini?")) {
        dataBKB.splice(index, 1);
        localStorage.setItem('dataBKB', JSON.stringify(dataBKB));
        tampilkanData();
    }
}

function cariData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filtered = dataBKB.filter(d => 
        d.no_surat.toLowerCase().includes(keyword) ||
        d.nama_penerima.toLowerCase().includes(keyword) ||
        d.nama_manager.toLowerCase().includes(keyword) ||
        d.nama_spv.toLowerCase().includes(keyword)
    );
    tampilkanData(filtered);
}

function cetakBKB(index) {
    const data = dataBKB[index];
    
    document.getElementById('printNoSurat').innerText = data.no_surat;
    document.getElementById('printTanggal').innerText = `Tanggal: ${data.tanggal}`;
    document.getElementById('printPenerima').innerText = data.nama_penerima;
    document.getElementById('printAlamat').innerText = data.alamat_penerima || '-';
    document.getElementById('printManager').innerText = data.nama_manager || 'Fariz Asad';
    document.getElementById('printSPV').innerText = data.nama_spv;
    
    document.getElementById('printSignPenerima').innerText = data.nama_penerima;
    document.getElementById('printSignSPV').innerText = data.nama_spv;
    document.getElementById('printSignManager').innerText = data.nama_manager || 'Fariz Asad';

    const tbody = document.getElementById('printContainerBarang');
    tbody.innerHTML = '';
    data.items.forEach((item, i) => {
        tbody.innerHTML += `
            <tr>
                <td style="text-align:center;">${i + 1}</td>
                <td>${item.kode}</td>
                <td>${item.sn || '-'}</td>
                <td>${item.nama}</td>
                <td style="text-align:center;">${item.qty}</td>
                <td style="text-align:center;">${item.satuan}</td>
                <td>${item.ket || '-'}</td>
            </tr>
        `;
    });

    window.print();
}

function exportJSON() {
    const blob = new Blob([JSON.stringify(dataBKB, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `backup_BKB_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function resetKeDefault() {
    if (confirm("Apakah kamu yakin ingin mereset/menghapus semua data BKB?")) {
        localStorage.removeItem('dataBKB');
        dataBKB = [];
        tampilkanData();
    }
}
