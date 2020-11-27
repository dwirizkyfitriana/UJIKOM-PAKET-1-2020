<template>
  <v-app>
    <v-card-title>
      Transaksi Spp
      <v-spacer></v-spacer>
      <div class="ml-5">
        <v-btn
          color="blue"
          class="white--text"
          @click="
            () => {
              showAdd = !showAdd
              showHistory = !showHistory
            }
          "
          >Tambah</v-btn
        >
      </div>
    </v-card-title>
    <v-card class="ma-5" v-show="showAdd">
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
    <v-card class="ma-5" v-show="showHistory">
      <v-card-title>
        Riwayat Transaksi
      </v-card-title>
      <v-data-table :headers="studentHeaders" :items="student">
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
      showHistory: true,
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
        this.showTable = !this.showTable
      } else {
        this.student = []
        this.showTable = !this.showTable
      }
    },
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
  },
}
</script>

<style></style>
