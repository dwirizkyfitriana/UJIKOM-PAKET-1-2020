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
        <v-autocomplete class="ma-5" :items="items" label="Pilih Jurusan" auto-select-first clearable></v-autocomplete>
        <v-autocomplete class="ma-5" :items="items" label="Pilih Kelas" auto-select-first clearable></v-autocomplete>
      </v-row>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.nis }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.class }}</td>
            <td>{{ props.item.schoolYears }}</td>
            <td>{{ props.item.spp }}</td>
            <td>
              <v-icon small class="mr-2" color="primary" @click="editData()">
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
                    :items="['Admin', 'Petugas']"
                    v-model="inputData.level"
                    label="Kelas"
                    auto-select-first
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :items="['Admin', 'Petugas']"
                    v-model="inputData.level"
                    label="Kelas"
                    auto-select-first
                    :rules="[inputData.rules.required]"
                    clearable
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Tahun Ajaran"
                    v-model="inputData.name"
                    :rules="[inputData.rules.required]"
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
          <v-btn color="blue darken-1" text @click="register()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Operators from '../../services/oprators'

export default {
  data() {
    return {
      items: [],
      headers: [
        { text: 'NIS', value: 'nis' },
        { text: 'Nama Siswa', value: 'name' },
        { text: 'Kelas', value: 'class' },
        { text: 'Tahun Ajaran', value: 'schoolYears' },
        { text: 'Biaya SPP', value: 'spp' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      inputData: {
        name: '',
        nis: '',
        majors: '',
        class: '',
        rules: {
          required: (v) => !!v || 'Required.',
          showPass: false,
          showPass2: false,
        },
      },
    }
  },
  mounted() {
    // this.getAllData()
  },
  methods: {
    async getAllData() {
      this.items = await Operators.getAllOperators()
    },
    async register() {
      await Operators.addOperator(this.inputData)
      this.reset()
    },
    async editData(id) {
      console.log(id)
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
          Operators.deleteOperators(id)
          this.$swal('Deleted!', 'Operator has been deleted.', 'success')
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
