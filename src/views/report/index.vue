<template>
    <v-app>
        <loading-page v-if="loading"></loading-page>
        <v-card-title v-if="!loading">Laporan</v-card-title>
        <v-card class="ma-5" v-if="!loading">
            <v-card-title>
                Transaksi
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="downloadPdf()">
                    Download PDF
                    <v-icon class="ml-3">mdi-cloud-download</v-icon>
                </v-btn>
            </v-card-title>
            <v-data-table ref="trx" :items="computedTransactions" :headers="transactionsHeaders" :search="search"></v-data-table>
        </v-card>
    </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import stmLogo from '../../assets/smk1logo.png'
import PDF from '../../global/pdf'
import LoadingPage from '../../components/LoadingPage'

export default {
  components: {
    LoadingPage,
  },
    data() {
        return {
            search: null,
            months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            transactionsHeaders: [
                { text: 'NIS', value: 'nis' },
                { text: 'Nama Siswa', value: 'name' },
                { text: 'Kelas', value: 'class' },
                { text: 'Kode Pembayaran', value: 'serialCode' },
                { text: 'Pembayaran Bulan', value: 'month' },
                { text: 'Jumlah Bayar', value: 'amountPay' },
                { text: 'Tangal Bayar', value: 'createdAt' },
            ],
            loading: true
        }
    },
    computed: {
        ...mapGetters({
            transactions: 'transactions/getTransactions',
        }),
        computedTransactions() {
            return this.transactions.map((item) => ({
                ...item,
                nis: item.student.nis,
                name: item.student.name,
                class: item.student.class.name,
                amountPay: item.amountPay.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                month: this.months[item.month],
                createdAt: dayjs(item.createdAt).format('DD MMM YYYY'),
            }))
        },
    },
    async mounted() {
        await this.$store.dispatch('transactions/fetchTransactions')

        this.loading = false
    },
    methods: {
        downloadPdf: function() {
            this.generatePdf()
        },
        generatePdf: function() {
            const doc = new jsPDF()

            doc.orientation = PDF.ORIENTATION
            doc.format = PDF.FORMAT

            doc.addImage(stmLogo, 'PNG', 10, 10, 35, 35)

            doc.setFont('helvetica', '', 'bold')
                .setFontSize(16)
                .text(PDF.HEADER_TITLE, 50, 18)
            doc.setFont('helvetica', '', 'normal')
                .setFontSize(12)
                .text(PDF.HEADER_ADDRESS, 58, 25)
            doc.setFontSize(12).text(PDF.HEADER_CONTACT, 55, 32)
            doc.setFontSize(12).text(PDF.HEADER_POSTAL_CODE, 100, 39)

            doc.setLineWidth(0.9).line(10, 48, 200, 48)
            doc.setLineWidth(0.01).line(10, 49, 200, 49)

            doc.setFontSize(12).text(PDF.BODY_TITLE, 15, 60)

            let headers = PDF.TABLE_HEADERS
            let rows = []
            let source = this.$refs['trx']
            let i = 0
            source.items.forEach((item) => {
                let temp = [(i += 1), item.nis, item.name, item.class, item.serialCode, item.month, item.amountPay, item.createdAt]
                rows.push(temp)
            })

            doc.autoTable(headers, rows, { theme: 'grid', styles: { fillColor: null, textColor: 'black', lineColor: 'black' }, startY: 65 })

            doc.save(PDF.FILE_TITLE)
        },
    },
}
</script>
