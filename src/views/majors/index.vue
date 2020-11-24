<template>
  <v-app>
    <v-card-title>
      Data Kompetensi Keahlian
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
    <v-card class="ma-5" elevation="10">
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.code }}</td>
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
          <span class="headline">Tambah Kompetensi Keahlian</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Nama Kompetensi Keahlian"
                    v-model="inputData.name"
                    :rules="[inputData.rules.required]"
                    counter
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="kode"
                    v-model="inputData.code"
                    :rules="[inputData.rules.required]"
                    counter
                    clearable
                    required
                  ></v-text-field>
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
import Majors from '../../services/majors'

export default {
  data() {
    return {
      items: [],
      headers: [
        { text: 'Nama', value: 'name' },
        { text: 'Kode', value: 'code' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        id: '',
        name: '',
        code: '',
        rules: {
          required: (v) => !!v || 'Required.',
        },
      },
    }
  },
  mounted() {
    console.log('stored data majors', this.$store.getters['majors/getAllMajors'])
    if(this.$store.getters['majors/getAllMajors'] == null){
      this.getAllData()
    }
    else this.items = this.$store.getters['majors/getAllMajors']
  },
  methods: {
    async getAllData() {
      await Majors.getAllMajors().then((res) => {
        console.log(res)
        this.$store.commit('majors/SET_ALL_MAJORS', res)
        this.items = this.$store.getters['majors/getAllMajors']
      })
    },
    async register() {
      await Majors.addMajor(this.inputData).then((res) => {
        this.$swal('Berhasil', `Kompetensi Keahlian ${res.name} berhasil ditambahkan`, 'success')
      })
      this.reset()
    },
    async edit(id){
      console.log(id)
      this.update = true
      this.dialog = !this.dialog
      await Majors.getMajorById(id).then((res) => {
        this.inputData.id = id
        this.inputData.name = res.name
        this.inputData.code = res.code
      })
    },
    async editData() {
      await Majors.updateMajor(this.inputData).then(() => {
        this.$swal('Berhasil', 'Kompetensi Keahlian berhasil diubah', 'success')
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
          Majors.deleteMajor(id)
          this.$swal('Deleted!', 'Major has been deleted.', 'success')
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

<style></style>
