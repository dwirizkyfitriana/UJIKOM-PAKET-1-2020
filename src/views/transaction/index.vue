<template>
  <v-app>
    <v-card-title>
      Transaksi Spp
      <v-spacer></v-spacer>
      <div class="ml-5">
        <v-btn color="blue" class="white--text" @click="openAdd">{{
          openedText
        }}</v-btn>
      </div>
    </v-card-title>
    <v-card class="ma-5 pa-5" v-show="showAdd">
      <v-form ref="form" class="pa-5">
        <v-autocomplete
          :items="students"
          :item-text="(item) => '[' + item.nis + ']' + ' ' + item.name"
          item-value="objectId"
          v-model="search"
          label="Cari Siswa"
          auto-select-first
          clearable
          required
        >
        </v-autocomplete>
      </v-form>
      <v-data-table
        :headers="studentHeaders"
        :items="student"
        v-show="showTable"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.nis }}</td>
            <td>{{ props.item.name }}</td>
            <td v-if="props.item.gender == 'P'">Perempuan</td>
            <td v-else-if="props.item.gender == 'L'">Laki-laki</td>
            <td>{{ props.item.major.name }}</td>
            <td>{{ props.item.class.name }}</td>
            <td>{{ props.item.schoolYears.year }}</td>
            <td>{{ props.item.schoolYears.amountPaid }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="ma-5 pa-5" v-show="showBills">
      <v-card-title>
        Tagihan SPP Siswa
      </v-card-title>
      <v-row>
        <v-col cols="3" v-for="a in 12" :key="a">
          <v-card class="pa-3" align="center" elevation="3">
            <v-card-title class="pt-0 justify-center">{{
              months[a - 1]
            }}</v-card-title>
            <v-card-subtitle class="text-caption"
              >Tagihan Spp bulan {{ months[a - 1] }}</v-card-subtitle
            >
            <v-chip
              v-if="transStatus[a - 1] == 1"
              :color="getBadge(transStatus[a - 1])"
              label
              outlined
              >{{ getBadgeTitle(transStatus[a - 1]) }}</v-chip
            >
            <v-btn
              v-if="transStatus[a - 1] != 1"
              :color="getBadge(transStatus[a - 1])"
              class="white--text"
              @click="addTransaction(a - 1)"
              >{{ getBadgeTitle(transStatus[a - 1]) }}</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="ma-5">
      <v-card-title>
        Riwayat Transaksi
      </v-card-title>
      <v-data-table
        :headers="historyHeaders"
        :items="computedHistory"
        @click:row="getDetaiTransaction"
        style="cursor: pointer"
      >
        <template v-slot:item.createdAt="{ item }">
          <tr>
            <td>{{ item.createdAt | date }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="detailTrans"
      v-model="detailDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Detai Transaksi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Nis</h4>
                <h4 class="text-body-1">{{ detailTrans.nis }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Kode Transaksi</h4>
                <h4 class="text-body-1">{{ detailTrans.serialCode }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Nama</h4>
                <h4 class="text-body-1">{{ detailTrans.name }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Kelas</h4>
                <h4 class="text-body-1">{{ detailTrans.class }}</h4>
              </v-col>
              <v-col cols="12">
                <h4 class="text-subtitle-2">Kompetensi Keahlian</h4>
                <h4 class="text-body-1">{{ detailTrans.student.major.name }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Pembayaran Bulan</h4>
                <h4 class="text-body-1">{{ detailTrans.month }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Jumlah Bayar</h4>
                <h4 class="text-body-1">Rp {{ detailTrans.amountPay }}</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Keterangan</h4>
                <h4 class="text-body-1" v-if="detailTrans.statusid == 1">
                  LUNAS
                </h4>
                <h4 class="text-body-1" v-else>Belum Lunas</h4>
              </v-col>
              <v-col cols="6">
                <h4 class="text-subtitle-2">Tanggal Bayar</h4>
                <h4 class="text-body-1">
                  {{ detailTrans.createdAt | datetime }}
                </h4>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="detailDialog = false">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Students from '../../services/students'
import Transaction from '../../services/transactions'

export default {
  data() {
    return {
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
      opened: false,
      openedText: 'Tambah',
      showAdd: false,
      students: [],
      search: '',
      showTable: false,
      student: [],
      studentHeaders: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name' },
        { text: 'Jenis Kelamin', value: 'gender' },
        { text: 'Kompetensi Keahlian', value: 'major' },
        { text: 'Kelas', value: 'class' },
        { text: 'Tahun Masuk', value: 'schoolYears' },
        { text: 'Biaya SPP', value: 'spp' },
      ],
      showBills: false,
      studentTransaction: [],
      transStatus: [],
      history: [],
      historyHeaders: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name' },
        { text: 'Kelas', value: 'class' },
        { text: 'Kode Pembayaran', value: 'serialCode' },
        { text: 'Pembayaran Bulan', value: 'month' },
        { text: 'Jumlah Bayar', value: 'amountPay' },
        { text: 'Tangal Bayar', value: 'createdAt' },
      ],
      detailDialog: false,
      detailTrans: null,
    }
  },
  watch: {
    async search(val) {
      if (val) {
        this.student = this.$store.getters['students/getAllStudents'].filter(
          (item) => item.objectId == val
        )
        await this.getStudentTransaction(val)
        this.showTable = true
        this.showBills = true
      } else {
        this.student = []
        this.showTable = false
        this.showBills = false
      }
    },
    opened() {
      if (this.opened == false) {
        this.openedText = 'Tambah'
      } else this.openedText = 'Tutup'
    },
  },
  computed: {
    computedHistory() {
      return this.history.map((item) => ({
        ...item,
        nis: item.student.nis,
        name: item.student.name,
        class: item.student.class.name,
        amountPay: item.amountPay
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
        month: this.months[item.month],
      }))
    },
  },
  mounted() {
    if (this.$store.getters['students/getAllStudents'] == null) {
      this.getAllStudents()
    } else this.students = this.$store.getters['students/getAllStudents']

    if (this.$store.getters['transaction/getAllTransactions'] == null) {
      this.getAllTransactions()
    } else this.history = this.$store.getters['transaction/getAllTransactions']
  },
  methods: {
    async getAllStudents() {
      await Students.getAllStudents().then((res) => {
        console.log('stud', res)
        this.$store.commit('students/SET_ALL_STUDENTS', res)
        this.students = this.$store.getters['students/getAllStudents']
      })
    },
    async getAllTransactions() {
      await Transaction.getAllTransactions().then((res) => {
        console.log('trans', res)
        this.$store.commit('transaction/SET_ALL_TRANSACTIONS', res)
        this.history = this.$store.getters['transaction/getAllTransactions']
      })
    },
    async getDetaiTransaction(value) {
      console.log('value', value)
      this.detailDialog = true
      this.detailTrans = value
    },
    async getStudentTransaction(id) {
      await Transaction.getTransactionsByStudentId(id).then((res) => {
        console.log('stud trans', res)
        this.studentTransaction = res
        this.transStatus = this.studentTransaction.map((item) => item.statusid)
        console.log(this.transStatus)
      })
    },
    async addTransaction(month) {
      console.log('month', month)
      console.log('data', this.student[0])
      await Transaction.addTransaction(month, this.student[0]).then((res) => {
        console.log('added', res)
      })
      await this.getAllTransactions()
      await this.getStudentTransaction(this.student[0].objectId)
    },
    openAdd() {
      this.showAdd = !this.showAdd
      this.showBills = false
      this.reset()
    },
    getBadge(statusid) {
      switch (statusid) {
        case 1:
          return 'green accent-4'
        case 0:
          return 'primary'
        case undefined:
          return 'primary'
        default:
          'danger'
      }
    },
    getBadgeTitle(statusid) {
      switch (statusid) {
        case 1:
          return 'Lunas'
        case 0:
          return 'Bayar'
        case undefined:
          return 'Bayar'
        default:
          'Perlu Di Cek'
      }
    },
    getActionTitle(statusid) {
      switch (statusid) {
        case 1:
          return 'Lunas'
        case 0:
          return 'Bayar'
        case undefined:
          return 'Bayar'
        default:
          'Perlu Di Cek'
      }
    },
    reset() {
      this.$refs.form.reset()
      this.opened = !this.opened
      this.student = []
    },
  },
}
</script>

<style></style>
