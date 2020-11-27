<template>
  <v-app>
    <v-card-title>
      Transaksi Spp
      <v-spacer></v-spacer>
      <div class="ml-5">
        <v-btn color="blue" class="white--text" @click="openAdd">{{openedText}}</v-btn>
      </div>
    </v-card-title>
    <v-card class="ma-5 pa-5" v-show="showAdd">
      <v-form ref="form" class="pa-5">
        <v-autocomplete
          :items="students"
          :item-text="(item) => '[' + item.nis + ']' + ' ' + item.name"
          item-value="objectId"
          v-model="search"
          label="Jenis Kelamin"
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
              month[a - 1]
            }}</v-card-title>
            <v-card-subtitle class="text-caption"
              >Tagihan Spp bulan {{ month[a - 1] }}</v-card-subtitle
            >
            <v-btn color="blue" class="white--text">Bayar</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="ma-5">
      <v-card-title>
        Riwayat Transaksi
      </v-card-title>
      <v-data-table :headers="historyHeaders" :items="history">
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
  </v-app>
</template>

<script>
import Students from '../../services/students'

export default {
  data() {
    return {
      month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
      history: [],
      historyHeaders: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name' },
        { text: 'Jenis Kelamin', value: 'gender' },
        { text: 'Kompetensi Keahlian', value: 'major' },
        { text: 'Kelas', value: 'class' },
        { text: 'Bayaran Bulan', value: 'schoolYears' },
      ],
    }
  },
  watch: {
    search(val) {
      if (val) {
        this.student = this.$store.getters['students/getAllStudents'].filter(
          (item) => item.objectId == val
        )
        this.showTable = true
        this.showBills = true
      } else {
        this.student = []
        this.showTable = false
        this.showBills = false
      }
    },
    opened(){
      if(this.opened == false){
        this.openedText = 'Tambah'
      }
      else this.openedText = 'Tutup'
    }
  },
  mounted() {
    if (this.$store.getters['students/getAllStudents'] == null) {
      this.getAllStudents()
    } else this.students = this.$store.getters['students/getAllStudents']
  },
  methods: {
    async getAllStudents() {
      await Students.getAllStudents().then((res) => {
        console.log(res)
        this.$store.commit('students/SET_ALL_STUDENTS', res)
        this.students = this.$store.getters['students/getAllStudents']
      })
    },
    openAdd() {
      this.showAdd = !this.showAdd
      this.showBills = false
      this.reset()
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
