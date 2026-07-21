// JavaScript Logic - Sistem Surat Bukti Keluar Barang  (BKB)

let dataBKB = [];
let autoIncrementCounter = 1;

// Load Data Saat Halaman Siap
document.addEventListener("DOMContentLoaded", () => {
    muatDataJSON();
});

// 1. MUAT DATA DARI DATA.JSON / LOCALSTORAGE
async function muatDataJSON() {
    const localData = localStorage.getItem("dataBKB");
    if (localData) {
        dataBKB = JSON.parse(localData);
        hitungCounterNomor();
        tampilkanTabelData();
    } else {
        try {
            const response = await fetch('data.json');
            dataBKB = await response.json();
            simpanKeLocalStorage();
            hitungCounterNomor();
            tampilkanTabelData();
        } catch (error) {
            console.error("Gagal membaca data.json:", error);
            dataBKB = [];
            tampilkanTabelData();
        }
    }
}

function simpanKeLocalStorage() {
    localStorage.setItem("dataBKB", JSON.stringify(dataBKB));
}

function hitungCounterNomor() {
    let maxNum = 0;
    dataBKB.forEach(item => {
        const parts = item.no_surat.split('/');
        if (parts.length === 4) {
            const num = parseInt(parts[3], 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    autoIncrementCounter = maxNum;
}

// 2. TAMPILKAN DATA PADA TABEL
function tampilkanTabelData(dataList = dataBKB) {
    const tbody = document.getElementById("tabelBKB");
    tbody.innerHTML = "";

    if (dataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color:#888;">Tidak ada data Surat BKB ditemukan.</td></tr>`;
        return;
    }

    dataList.forEach((item, index) => {
        const originalIndex = dataBKB.indexOf(item);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td><strong>${item.no_surat}</strong></td>
            <td>${formatTanggal(item.tanggal)}</td>
            <td>${item.nama_penerima}</td>
            <td>${item.nama_spv}</td>
            <td style="text-align: center;">
                <div class="action-group">
                    <button class="btn btn-edit" onclick="bukaModalEdit(${originalIndex})" title="Edit Data">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-print" onclick="cetakSurat(${originalIndex})" title="Cetak Surat BKB">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    <button class="btn btn-delete" onclick="hapusBKB(${originalIndex})" title="Hapus BKB">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. GENERATE NOMOR SURAT BKB OTOMATIS
function generateNoBKB() {
    const d = new Date();
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const nextNumber = String(autoIncrementCounter + 1).padStart(4, '0');
    return `BKB/${YYYY}/${MM}/${nextNumber}`;
}

// 4. DYNAMIC BARIS BARANG
function tambahBarisBarang(data = {}) {
    const container = document.getElementById("containerBarang");
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td><input type="text" class="item-kode" value="${data.kode || ''}"></td>
        <td><input type="text" class="item-sn" value="${data.sn || ''}"></td>
        <td><input type="text" class="item-nama" value="${data.nama || ''}" required></td>
        <td><input type="number" class="item-qty" value="${data.qty || 1}" min="1" required></td>
        <td><input type="text" class="item-satuan" value="${data.satuan || 'Pcs'}"></td>
        <td><input type="text" class="item-ket" value="${data.ket || ''}"></td>
        <td style="text-align:center;">
            <button type="button" class="btn btn-delete" style="padding: 4px 8px;" onclick="hapusBarisBarang(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;
    container.appendChild(tr);
}

function hapusBarisBarang(btn) {
    const rows = document.querySelectorAll("#containerBarang tr");
    if (rows.length > 1) {
        btn.closest("tr").remove();
    } else {
        alert("Minimal harus terdapat 1 barang dalam surat!");
    }
}

// 5. KONTROL MODAL FORM
function bukaModalTambah() {
    document.getElementById("modalTitle").innerHTML = `<i class="fa-solid fa-file-circle-plus"></i> Form Buat Surat BKB`;
    document.getElementById("formBKB").reset();
    document.getElementById("editIndex").value = "-1";
    document.getElementById("no_surat").value = generateNoBKB();
    document.getElementById("tanggal").valueAsDate = new Date();

    document.getElementById("containerBarang").innerHTML = "";
    tambahBarisBarang();

    document.getElementById("modalBKB").style.display = "flex";
}

function bukaModalEdit(index) {
    const data = dataBKB[index];
    document.getElementById("modalTitle").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Surat BKB`;
    document.getElementById("editIndex").value = index;

    document.getElementById("no_surat").value = data.no_surat;
    document.getElementById("tanggal").value = data.tanggal;
    document.getElementById("nama_penerima").value = data.nama_penerima;
    document.getElementById("nama_spv").value = data.nama_spv;
    document.getElementById("alamat_penerima").value = data.alamat_penerima;

    const container = document.getElementById("containerBarang");
    container.innerHTML = "";
    data.items.forEach(item => tambahBarisBarang(item));

    document.getElementById("modalBKB").style.display = "flex";
}

function tutupModal() {
    document.getElementById("modalBKB").style.display = "none";
}

// 6. PROSES SIMPAN / EDIT DATA
function simpanBKB(e) {
    e.preventDefault();

    const indexEdit = parseInt(document.getElementById("editIndex").value, 10);
    const rows = document.querySelectorAll("#containerBarang tr");
    let items = [];
    
    rows.forEach(row => {
        items.push({
            kode: row.querySelector(".item-kode").value,
            sn: row.querySelector(".item-sn").value,
            nama: row.querySelector(".item-nama").value,
            qty: parseInt(row.querySelector(".item-qty").value, 10) || 1,
            satuan: row.querySelector(".item-satuan").value,
            ket: row.querySelector(".item-ket").value
        });
    });

    const bkbBaru = {
        no_surat: document.getElementById("no_surat").value,
        tanggal: document.getElementById("tanggal").value,
        nama_penerima: document.getElementById("nama_penerima").value,
        nama_spv: document.getElementById("nama_spv").value,
        alamat_penerima: document.getElementById("alamat_penerima").value,
        items: items
    };

    if (indexEdit === -1) {
        dataBKB.unshift(bkbBaru);
        autoIncrementCounter++;
        tampilkanAlert("Surat BKB berhasil ditambahkan!", "success");
    } else {
        dataBKB[indexEdit] = bkbBaru;
        tampilkanAlert("Data Surat BKB berhasil diperbarui!", "success");
    }

    simpanKeLocalStorage();
    tutupModal();
    tampilkanTabelData();
}

// 7. FITUR HAPUS DATA
function hapusBKB(index) {
    const item = dataBKB[index];
    if (confirm(`Apakah Anda yakin ingin menghapus surat ${item.no_surat}?`)) {
        dataBKB.splice(index, 1);
        simpanKeLocalStorage();
        tampilkanTabelData();
        tampilkanAlert(`Surat ${item.no_surat} telah dihapus.`, "danger");
    }
}

// 8. FITUR CETAK SURAT
function cetakSurat(index) {
    const data = dataBKB[index];

    document.getElementById("printNoSurat").innerText = data.no_surat;
    document.getElementById("printTanggal").innerText = "Tanggal: " + formatTanggal(data.tanggal);
    document.getElementById("printPenerima").innerText = data.nama_penerima;
    document.getElementById("printAlamat").innerText = data.alamat_penerima || "-";
    document.getElementById("printSPV").innerText = data.nama_spv;
    document.getElementById("printSignPenerima").innerText = data.nama_penerima;
    document.getElementById("printSignSPV").innerText = data.nama_spv;

    const tbody = document.getElementById("printContainerBarang");
    tbody.innerHTML = "";
    
    data.items.forEach((item, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${i + 1}</td>
            <td>${item.kode || '-'}</td>
            <td>${item.sn || '-'}</td>
            <td>${item.nama}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: center;">${item.satuan}</td>
            <td>${item.ket || '-'}</td>
        `;
        tbody.appendChild(tr);
    });

    window.print();
}

// 9. PENCARIAN & EXPORT / RESET
function cariData() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = dataBKB.filter(item => 
        item.no_surat.toLowerCase().includes(query) ||
        item.nama_penerima.toLowerCase().includes(query) ||
        item.nama_spv.toLowerCase().includes(query)
    );
    tampilkanTabelData(filtered);
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataBKB, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function resetKeDefault() {
    if (confirm("Reset data ke versi default initial data.json? Data perubahan lokal Anda akan terhapus.")) {
        localStorage.removeItem("dataBKB");
        muatDataJSON();
        tampilkanAlert("Data telah direset ke default data.json", "success");
    }
}

// HELPER ALERT & FORMAT
function tampilkanAlert(pesan, jenis) {
    const alertBox = document.getElementById("alertBox");
    const alertIcon = document.getElementById("alertIcon");
    const alertText = document.getElementById("alertText");

    alertBox.className = `alert alert-${jenis}`;
    alertIcon.className = jenis === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-trash-can';
    alertText.innerText = pesan;
    
    alertBox.style.display = "flex";
    setTimeout(() => { alertBox.style.display = "none"; }, 4000);
}

function formatTanggal(strTanggal) {
    if (!strTanggal) return "-";
    const d = new Date(strTanggal);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
