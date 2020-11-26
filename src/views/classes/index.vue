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
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.major.name }}</td>
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
          <span class="headline">Tambah Kelas</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Kelas"
                    v-model="inputData.name"
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="majors"
                    item-text="name"
                    item-value="objectId"
                    v-model="inputData.major"
                    label="Kompetensi keahlian"
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
import Classes from '../../services/classes'
import Majors from '../../services/majors'

export default {
  data() {
    return {
      items: [],
      majors: [],
      headers: [
        { text: 'Kelas', value: 'name' },
        { text: 'kompetensi Keahlian', value: 'major' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        id: '',
        name: '',
        major: '',
        rules: {
          required: (v) => !!v || 'Required.',
        },
      },
    }
  },
  async mounted() {
    // get all Classes
    if(this.$store.getters['classes/getAllClasses'] == null){
      this.getAllData()
    }
    else{
      this.items = this.$store.getters['classes/getAllClasses']
    }

    // get all majors
    if(this.$store.getters['majors/getAllMajors'] == null){
      await Majors.getAllMajors().then((res) => {
        this.$store.commit('majors/SET_ALL_MAJORS', res)
        this.majors = res
      })
    }
    else{
      let res = this.$store.getters['majors/getAllMajors']
      this.majors = res
    }
  },
  methods: {
    async getAllData() {
      await Classes.getAllClasses().then((res) => {
        console.log('data kelas', res)
        this.$store.commit('classes/SET_ALL_CLASSES', res)
        this.items = this.$store.getters['classes/getAllClasses']
      })
    },
    async register() {
      await Classes.addClass(this.inputData).then((res) => {
        this.$swal('Berhasil', `Kelas ${res.name} berhasil ditambahkan`, 'success')
      })
      this.reset()
    },
    async edit(id) {
      console.log(id)
      this.update = true
      this.dialog = !this.dialog
      await Classes.getClassById(id).then((res) => {
        this.inputData.id = id
        this.inputData.name = res.name
        this.inputData.major = res.major.objectId
      })
    },
    async editData() {
      await Classes.updateClass(this.inputData).then(() => {
        this.$swal('Berhasil', 'Kelas berhasil diubah', 'success')
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
          Classes.deleteClass(id)
          this.$swal('Deleted!', 'Class has been deleted.', 'success')
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
</style>
