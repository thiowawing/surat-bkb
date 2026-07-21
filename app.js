// FUNGSI CETAK / PDF TEMPLATE
function cetakBKB(index) {
    const data = dataBKB[index];

    // Map data ke template area cetak
    document.getElementById('printNoSurat').innerText = data.no_surat;
    document.getElementById('printTanggal').innerText = `Tanggal: ${formatDateToID(data.tanggal)}`;
    document.getElementById('printPenerima').innerText = data.nama_penerima;
    document.getElementById('printDepartemen').innerText = data.departemen || '-';
    document.getElementById('printAlamat').innerText = data.alamat_penerima || '-';
    document.getElementById('printSPV').innerText = data.nama_spv;

    // Tanda Tangan Nama Dinamis
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
