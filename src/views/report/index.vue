<template>
    <v-app>
        <v-card-title>Laporan</v-card-title>
        <v-card class="ma-5">
            <v-card-title>
                Transaksi
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari" clearable ></v-text-field>
            </v-card-title>
            <v-data-table :items="computedTransactions" :headers="transactionsHeaders" :search="search"></v-data-table>
        </v-card>
    </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
    data () {
        return {
            search: null,
            months: [
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember',
            ],
            transactionsHeaders: [
                { text: 'NIS', value: 'nis' },
                { text: 'Nama Siswa', value: 'name' },
                { text: 'Kelas', value: 'class' },
                { text: 'Kode Pembayaran', value: 'serialCode' },
                { text: 'Pembayaran Bulan', value: 'month' },
                { text: 'Jumlah Bayar', value: 'amountPay' },
                { text: 'Tangal Bayar', value: 'createdAt' },
            ]
        }
    },
    computed: {
        ...mapGetters({
            transactions: 'transactions/getTransactions'
        }),
        computedTransactions() {
            return this.transactions.map((item) => ({
                ...item,
                nis: item.student.nis,
                name: item.student.name,
                class: item.student.class.name,
                amountPay: item.amountPay
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                month: this.months[item.month],
                createdAt: dayjs(item.createdAt).format('DD MMM YYYY')
            }))
        },
    },
    async mounted() {
        await this.$store.dispatch('transactions/fetchTransactions')
    }
}
</script>