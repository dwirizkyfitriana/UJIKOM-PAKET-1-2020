const PDF = {
    ORIENTATION: 'portrait',
    FORMAT: 'a4',
    HEADER_TITLE: 'SEKOLAH MENENGAH KEJURUAN NEGERI 1 CIMAHI',
    HEADER_ADDRESS: 'Jalan Mahar Martanegara No. 48 Leuwigajah, Telp./Fax. (022) 662983',
    HEADER_CONTACT: 'Website : https://www.smkn1-cmi.sch.id - e-mail : info@.smkn1-cmi.sch.id',
    HEADER_POSTAL_CODE: 'Kota Cimahi 40533',
    BODY_TITLE: 'Laporan Pembayaran SPP Siswa/i SMKN 1 Cimahi',
    TABLE_HEADERS: ['No.', 'NIS', 'Nama Siswa', 'Kelas', 'Kode', 'Bulan', 'Jumlah', 'Tangal'],
    FILE_TITLE: 'laporan_' + Date.now() + '.pdf'
}

export default PDF