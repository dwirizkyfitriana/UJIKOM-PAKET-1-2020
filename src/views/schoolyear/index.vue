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
            <td>{{ props.item.year }}</td>
            <td>{{ props.item.amountPaid }}</td>
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
          <span class="headline">Tambah Tahun Masuk</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Tahun Masuk"
                    v-model="inputData.year"
                    :rules="[inputData.rules.required]"
                    type="number"
                    class="inputNumber"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Biaya SPP"
                    v-model="inputData.amountPaid"
                    :rules="[inputData.rules.required]"
                    type="number"
                    class="inputNumber"
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
import Years from '../../services/years'

export default {
  data() {
    return {
      items: [],
      headers: [
        { text: 'NIS', value: 'year' },
        { text: 'Biaya Spp', value: 'amountPaid' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        id: '',
        year: '',
        amountPaid: '',
        rules: {
          required: (v) => !!v || 'Required.',
        },
      },
    }
  },
  async mounted() {
    // get all years
    if(this.$store.getters['years/getAllYears'] == null){
      this.getAllData()
    }
    else{
      this.items = this.$store.getters['years/getAllYears']
    }
  },
  methods: {
    async getAllData() {
      await Years.getAllSchoolYears().then((res) => {
        console.log('data tahun ajaran', res)
        this.$store.commit('years/SET_ALL_YEARS', res)
        this.items = this.$store.getters['years/getAllYears']
      })
    },
    async register() {
      await Years.addYears(this.inputData).then((res) => {
        this.$swal('Berhasil', `Siswa ${res.name} berhasil ditambahkan`, 'success')
      })
      this.reset()
    },
    async edit(id) {
      console.log(id)
      this.update = true
      this.dialog = !this.dialog
      await Years.getSchoolyearById(id).then((res) => {
        this.inputData.id = id
        this.inputData.year = res.year
        this.inputData.amountPaid = res.amountPaid
      })
    },
    async editData() {
      await Years.updateSchoolYears(this.inputData).then(() => {
        this.$swal('Berhasil', 'Tahun Masuk berhasil diubah', 'success')
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
          Years.deleteSchoolYears(id)
          this.$swal('Deleted!', 'Years has been deleted.', 'success')
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
