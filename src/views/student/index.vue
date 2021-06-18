<template>
  <v-app>
    <loading-page v-if="loading"></loading-page>
    <v-card-title v-if="!loading">
      Data Siswa
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Cari"
        clearable
      ></v-text-field>
      <div class="ml-5">
        <v-btn color="blue" class="white--text" @click="openDialog()"
          >Tambah</v-btn
        >
      </div>
    </v-card-title>
    <v-card class="ma-5 pa-5 pt-0" elevation="10" v-if="!loading">
      <v-row>
        <v-autocomplete class="ma-5" :items="filteredMajor ? filteredMajor : majors" item-text="name" item-value="objectId" label="Pilih Jurusan" v-model="major" auto-select-first clearable></v-autocomplete>
        <v-autocomplete class="ma-5" :items="filteredClass ? filteredClass : classes" item-text="name" item-value="objectId" label="Pilih Kelas" v-model="klass" auto-select-first clearable></v-autocomplete>
      </v-row>
      <v-data-table :headers="headers" :items="filteredStudent ? filteredStudent : students" :search="search">
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
            <td>
              <v-icon small class="mr-2" color="primary" @click="openDialog('update', props.item)">
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
                    :rules="[rules.required]"
                    type="number"
                    class="inputNumber"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="Nama Siswa"
                    v-model="inputData.name"
                    :rules="[rules.required]"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    :items="genders"
                    item-text="label"
                    item-value="value"
                    v-model="inputData.gender"
                    label="Jenis Kelamin"
                    auto-select-first
                    :rules="[rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="majors"
                    item-text="name"
                    item-value="objectId"
                    v-model="inputData.major"
                    label="Kompetensi keahlian"
                    auto-select-first
                    :rules="[rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="filteredClass ? filteredClass : classes"
                    item-text="name"
                    item-value="objectId"
                    v-model="inputData.class"
                    label="Kelas"
                    auto-select-first
                    :rules="[rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="schoolYears"
                    item-text="year"
                    item-value="objectId"
                    v-model="inputData.schoolYears"
                    label="Tahun Masuk"
                    auto-select-first
                    :rules="[rules.required]"
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
          <v-btn color="blue darken-1" text @click="save()"> {{ update ? 'Edit' : 'Simpan' }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingPage from '../../components/LoadingPage'

export default {
  components: {
    LoadingPage,
  },
  data() {
    return {
      filteredStudent: null,
      filteredMajor: null,
      filteredClass: null,
      genders: [
        { label: 'Laki-laki', value: 'L' },
        { label: 'Perempuan', value: 'P' }
      ],
      major: '',
      klass: '',
      headers: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name', },
        { text: 'Jenis Kelamin', value: 'gender'},
        { text: 'Kompetensi Keahlian', value: 'major' },
        { text: 'Kelas', value: 'class' },
        { text: 'Tahun Masuk', value: 'schoolYears' },
        { text: 'Biaya SPP', value: 'spp' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        objectId: '',
        name: '',
        nis: '',
        gender: '',
        major: '',
        class: '',
        schoolYears: '',
      },
      rules: {
        required: (v) => !!v || 'Required.',
      },
      loading: true
    }
  },
  watch: {
    // filtering students by major
    major(val){
      if(val){
        let res = this.students.filter(item => item.major.objectId == val)
        this.filteredStudent = res

        // filtering classes by major
        let fileredClass = this.classes.filter(item => item.major.objectId == val)
        this.filteredClass = fileredClass
      }
      else {
        this.filteredStudent = null
        this.filteredClass =  null
      }
    },
    // filtering classes in form by major
    'inputData.major'(val){
      if(val){
        let fileredClass = this.classes.filter(item => item.major.objectId == val)
        this.filteredClass = fileredClass
      }
      else {
        this.filteredClass = null
      }
    },
    // filtering students by class
    klass(val){
      // filtering students by major & class
      if(val && this.major){
        let res = this.students.filter(item => item.class.objectId == val && item.major.objectId == this.major)
        this.filteredStudent = res
      }
      // filtering students by class only
      else if(val && !this.major){
        let res = this.students.filter(item => item.class.objectId == val)
        this.filteredStudent = res
      }
      else {
        this.filteredStudent = null
      }
    },
  },
  computed: {
    ...mapGetters({
      students: 'students/getStudents',
      classes: 'classes/getClasses',
      majors: 'majors/getMajors',
      schoolYears: 'years/getSchoolYears',
    })
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

    this.loading = false

  },
  methods: {
    openDialog: async function(type = 'new', data) {
      this.dialog = true
      if(type == 'update') {
        this.update = true
        for (const key in this.inputData) {
          this.inputData[key] = data[key]
        }
      }
    },
    save: async function() {
      if(this.update) {
        await this.$store.dispatch('student/updateStudent', this.inputData)
      }
      else {
        await this.$store.dispatch('students/addStudent', this.inputData)
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
          await this.$store.dispatch('students/deleteStudent', objectId)
          this.$swal("Berhasil", "Siswa berhasil dihapus", "success")
        }
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
.inputNumber input[type='number']{
  -moz-appearance:textfield
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

</style>
