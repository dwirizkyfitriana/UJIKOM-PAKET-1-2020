<template>
    <v-app>
        <loading-page v-if="loading"></loading-page>
        <v-card-title v-if="!loading">
            Dashboard
        </v-card-title>
        <v-row class="ma-3" v-if="!loading">
            <v-col cols="4" v-for="(card, i) in cards" :key="i">
                <v-card class="pt-5 pb-5 pr-6 pl-6" elevation="2" shaped>
                    <v-row>
                        <v-col cols="12" sm="6" md="8">
                            <p class="caption">{{ card.title }}</p>
                        </v-col>
                        <v-col class="d-flex flex-row-reverse" cols="6" md="4">
                            <p class="caption">Total</p>
                        </v-col>
                    </v-row>
                    <h1 class="d-flex flex-row-reverse">{{ card.total }}</h1>
                </v-card>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingPage from '../../components/LoadingPageDashboard.vue'
export default {
    components: {
        LoadingPage
    },
    data() {
        return {
            cards: [
                { title: 'Tahun Ajaran', total: 0 },
                { title: 'Siswa', total: 0 },
                { title: 'Kompetensi Keahlian', total: 0 },
                { title: 'Kelas', total: 0 },
                { title: 'Transaksi', total: 0 },
                { title: 'Pemasukan', total: 0 },
            ],
            loading: true
        }
    },
    computed: {
        ...mapGetters({
            students: 'students/getStudents',
            classes: 'classes/getClasses',
            majors: 'majors/getMajors',
            schoolYears: 'years/getSchoolYears',
            transactions: 'transactions/getTransactions',
        }),
    },
    async mounted() {
        // get all students
        await this.$store.dispatch('students/fetchStudents')

        // get all majors
        await this.$store.dispatch('majors/fetchMajors')

        // get all classes
        await this.$store.dispatch('classes/fetchClasses')

        // get all schoolYears
        await this.$store.dispatch('years/fetchSchoolYears')

        // get all transactions
        await this.$store.dispatch('transactions/fetchTransactions')

        this.cards[0].total = this.schoolYears.length
        this.cards[1].total = this.students.length
        this.cards[2].total = this.majors.length
        this.cards[3].total = this.classes.length
        this.cards[4].total = this.transactions.length

        let total = 0
        this.transactions.forEach((element) => {
            total += element.amountPay
        })
        this.cards[5].total = this.convertToRupiah(total)

        this.loading = false
    },
    methods: {
        convertToRupiah: function(angka) {
            var rupiah = ''
            var angkarev = angka
                .toString()
                .split('')
                .reverse()
                .join('')
            for (var i = 0; i < angkarev.length; i++)
                if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.'
            return (
                'Rp. ' +
                rupiah
                    .split('', rupiah.length - 1)
                    .reverse()
                    .join('')
            )
        },
    },
}
</script>

<style>
.row {
    flex: 0 1 auto;
}
</style>
