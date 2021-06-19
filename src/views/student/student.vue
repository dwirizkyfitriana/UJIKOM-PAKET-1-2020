<template>
    <v-app>
        <loading-page v-if="loading"></loading-page>
        <v-card-title v-if="!loading">
            Data Siswa
        </v-card-title>
        <v-card class="ma-5" v-if="!loading">
            <v-card-title>
                {{ student.nis }}
                <v-spacer></v-spacer>
                {{ student.name }}
                <v-spacer></v-spacer>
                {{ student.class.name }}
                <v-spacer></v-spacer>
                Rp {{ total }}
            </v-card-title>
        </v-card>
        <v-card class="ma-5 pa-5 pt-0" elevation="10" v-if="!loading">
            <v-data-table :headers="headers" :items="computedTrx">
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.createdAt | date }}</td>
                        <td>{{ props.item.month }}</td>
                        <td>{{ props.item.amountPay }}</td>
                        <td>{{ props.item.serialCode }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingPage from '../../components/LoadingPage'
import MONTHS from '../../global/months'

export default {
    components: {
        LoadingPage,
    },
    data() {
        return {
            headers: [
                { text: 'Tanggeal Bayar', value: 'createdAt' },
                { text: 'Pembayaran Bulan', value: 'month' },
                { text: 'Jumlah Bayar', value: 'amountPay' },
                { text: 'Kode Pembayaran', value: 'serialCpde' },
            ],
            loading: true,
        }
    },
    computed: {
        ...mapGetters({
            student: 'students/getStudent',
            transactions: 'transactions/getStudentTransactions',
        }),
        computedTrx: function() {
            return this.transactions.map((item) => ({
                ...item,
                amountPay: item.amountPay
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                month: MONTHS[item.month],
            }))
        },
        total: function() {
            let total = 0
            for (let i = 0; i < this.transactions.length; i++) {
                total += this.transactions[i].amountPay
            }
            return total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
        },
    },
    async mounted() {
        // let objectId = localStorage.getItem('userId')
        let objectId = 'QAfhFCn2WL'
        // get student
        await this.$store.dispatch('students/fetchStudentById', objectId)
        console.log(this.student)

        // get student transaction
        await this.$store.dispatch(
            'transactions/fetchStudentTransactions',
            objectId
        )

        this.loading = false
    },
    methods: {
        openDialog: async function(type = 'new', data) {
            this.dialog = true
            if (type == 'update') {
                this.update = true
                for (const key in this.inputData) {
                    this.inputData[key] = data[key]
                }
            }
        },
        save: async function() {
            if (this.update) {
                await this.$store.dispatch(
                    'student/updateStudent',
                    this.inputData
                )
            } else {
                await this.$store.dispatch(
                    'students/addStudent',
                    this.inputData
                )
            }
            this.reset()
        },
        deleteData: async function(objectId) {
            this.$swal({
                title: 'Apakah Anda yakin ingin menghapus?',
                showCancelButton: true,
                cancelButtonText: 'Tidak',
                confirmButtonText: 'Ya',
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    await this.$store.dispatch(
                        'students/deleteStudent',
                        objectId
                    )
                    this.$swal('Berhasil', 'Siswa berhasil dihapus', 'success')
                },
            })
        },
        reset() {
            this.$refs.form.reset()
            this.dialog = false
            this.update = false
        },
    },
}
</script>

<style>
.inputNumber input[type='number'] {
    -moz-appearance: textfield;
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
