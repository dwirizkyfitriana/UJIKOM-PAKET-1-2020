<template>
  <v-app>
    <v-card-title>
      Data Siswa
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Cari"
        clearable
      ></v-text-field>
      <div class="ml-5">
        <v-btn color="blue" class="white--text" @click="dialog = !dialog"
          >Tambah</v-btn
        >
      </div>
    </v-card-title>
    <v-card class="ma-5 pa-5 pt-0" elevation="10">
      <v-row>
        <v-autocomplete class="ma-5" :items="majors" label="Pilih Jurusan" auto-select-first clearable></v-autocomplete>
        <v-autocomplete class="ma-5" :items="classess" label="Pilih Kelas" auto-select-first clearable></v-autocomplete>
      </v-row>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.nis }}</td>
            <td>{{ props.item.name }}</td>
            <td v-if="props.item.gender == 'P'">Perempuan</td>
            <td v-else-if="props.item.gender == 'L'">Laki-laki</td>
            <td>{{ props.item.major }}</td>
            <td>{{ props.item.class }}</td>
            <td>{{ props.item.schoolYears }}</td>
            <td>{{ props.item.spp }}</td>
            <td>
              <v-icon small class="mr-2" color="primary" @click="edit(props.item.objectId)">
                mdi-pencil
              </v-icon>
              <v-icon
                small
                color="error"
                @click="deleteData(props.item.objectId)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Tambah Siswa</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="NIS"
                    v-model="inputData.nis"
                    :rules="[inputData.rules.required]"
                    type="number"
                    class="inputNumber"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nama Siswa"
                    v-model="inputData.name"
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="['Rekayasa Perangkat Lunak', 'Sistem informasi Jaringan dan Aplikasi']"
                    v-model="inputData.major"
                    label="Kompetensi keahlian"
                    auto-select-first
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="['X A', 'X B']"
                    v-model="inputData.class"
                    label="Kelas"
                    auto-select-first
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="['2017', '2018', '2019', '2020']"
                    v-model="inputData.schoolYears"
                    label="Tahun Ajaran"
                    auto-select-first
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="reset()">
            Close
          </v-btn>
          <v-btn
            v-if="update == false"
            color="blue darken-1"
            text
            @click="register()"
          >
            Save
          </v-btn>
          <v-btn v-else color="blue darken-1" text @click="editData()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Students from '../../services/students'
import Majors from '../../services/majors'

export default {
  data() {
    return {
      majors: [],
      classess: [],
      items: [],
      headers: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name' },
        { text: 'Jenis Kelamin', value: 'gender'},
        { text: 'Kompetensi Keahlian', value: 'major' },
        { text: 'Kelas', value: 'class' },
        { text: 'Tahun Ajaran', value: 'schoolYears' },
        { text: 'Biaya SPP', value: 'spp' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        id: '',
        name: '',
        nis: '',
        gender: '',
        major: '',
        class: '',
        schoolYears: '',
        rules: {
          required: (v) => !!v || 'Required.',
        },
      },
    }
  },
  async mounted() {
    // get all students
    if(this.$store.getters['students/getAllStudents'] == null){
      this.getAllData()
    }
    else this.items = this.$store.getters['students/getAllStudents']

    // get all majors
    if(this.$store.getters['majors/getAllmajors'] == null){
      await Majors.getAllMajors().then((res) => {
        this.$store.commit('majors/SET_ALL_MAJORS', res)
        this.majors = res.map(item => item.name)
      })
    }
    else{
      let res = this.$store.getters['majors/getAllmajors']
      this.majors = res.map(item => item.name)
    }
    console.log('majors', this.majors)
  },
  methods: {
    async getAllData() {
      await Students.getAllStudents().then((res) => {
        console.log('data siswa', res)
        this.$store.commit('students/SET_ALL_STUDENTS', res)
        this.items = this.$store.getters['students/getAllStudents']
      })
    },
    async register() {
      await Students.addStudent(this.inputData).then((res) => {
        this.$swal('Berhasil', `Siswa ${res.name} berhasil ditambahkan`, 'success')
      })
      this.reset()
    },
    async edit(id) {
      console.log(id)
      this.update = true
      this.dialog = !this.dialog
      await Students.getStudentById(id).then((res) => {
        this.inputData.id = id
        this.inputData.name = res.name
        this.inputData.nis = res.nis
        this.inputData.gender = res.gender
        this.inputData.major = res.major
        this.inputData.class = res.class
        this.inputData.schoolYears = res.schoolYears
      })
    },
    async editData() {
      await Students.updateStudent(this.inputData).then(() => {
        this.$swal('Berhasil', 'siswa berhasil diubah', 'success')
      })
      this.reset()
      this.getAllData()
    },
    deleteData(id) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          Students.deleteStudent(id)
          this.$swal('Deleted!', 'Student has been deleted.', 'success')
          this.getAllData()
        }
      })
    },
    reset() {
      this.$refs.form.reset()
      this.dialog = false
    },
  },
}
</script>

<style>
.inputNumber input[type='number']{
  -moz-appearance:textfield
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

</style>
