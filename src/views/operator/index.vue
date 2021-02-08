<template>
  <v-app>
    <v-card-title>
      Data Petugas
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
    <v-card class="ma-5" elevation="10">
      <v-data-table :headers="headers" :items="operators" :search="search">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.level }}</td>
            <td>
              <v-icon
                small
                class="mr-2"
                color="primary"
                @click="openDialog('update', props.item)"
              >
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
          <span class="headline">Tambah Petugas</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Nama Petugas"
                    v-model="inputData.name"
                    :rules="[
                      rules.required,
                      rules.counterMinName,
                      rules.counterMax,
                    ]"
                    counter
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Username"
                    v-model="inputData.username"
                    :rules="[
                      rules.required,
                      rules.counterMinName,
                    ]"
                    counter
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    v-model="inputData.email"
                    :rules="[rules.required, rules.email]"
                    clearable
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Password"
                    v-model="inputData.password"
                    :rules="[
                      rules.required,
                      rules.counterMin,
                    ]"
                    :append-icon="
                      showPass ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="showPass ? 'text' : 'password'"
                    clearable
                    @click:append="showPass = !showPass"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Confirm Password"
                    v-model="confirmPassword"
                    :rules="[
                      rules.required,
                      rules.counterMin,
                      rules.passConfirm,
                    ]"
                    :append-icon="
                      showPass2 ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="showPass2 ? 'text' : 'password'"
                    clearable
                    @click:append="showPass2 = !showPass2"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="['Admin', 'Petugas']"
                    v-model="inputData.level"
                    label="Level"
                    :rules="[rules.required]"
                    clearable
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="reset()">Close</v-btn>
          <v-btn v-if="update == false" color="blue darken-1" text @click="register()" > Save </v-btn>
          <v-btn v-else color="blue darken-1" text @click="editData()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      headers: [
        { text: 'Nama', value: 'name' },
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Level', value: 'level' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      valid: true,
      update: false,
      inputData: {
        objectId: '',
        name: '',
        username: '',
        email: '',
        password: '',
        level: '',
      },
      confirmPassword: '',
      rules: {
          required: (v) => !!v || 'Required.',
          counterMax: (v) => (v && v.length) <= 50 || 'Max 50 characters',
          counterMin: (v) => (v && v.length) >= 8 || 'Min 8 characters',
          counterMinName: (v) => (v && v.length) >= 3 || 'Min 3 characters',
          email: (v) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(v) || 'Invalid e-mail.'
          },
          passConfirm: (v) =>
            v === this.inputData.password || 'Passwords do not match',
      },
      showPass: false,
      showPass2: false,
    }
  },
  computed: {
    ...mapGetters({
      operators: 'operators/getOperators'
    })
  },
  async mounted() {
    await this.$store.dispatch('operators/fetchOperators')
  },
  methods: {
    openDialog: async function(type = 'new', data){
      this.dialog = true
      if(type == 'update'){
        console.log(data)
        this.update = true
        for (const key in this.inputData) {
          this.inputData[key] = data[key]
        }
      }
    },
    register: async function() {
      await this.$store.dispatch('operators/addOperator', this.inputData)
      this.reset()
    },
    editData: async function() {
      await this.$store.dispatch('operators/updateOperator', this.inputData)
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
            await this.$store.dispatch('operators/deleteOperator', objectId)
            this.$swal("Berhasil", "Petugas Berhasil dihapus", "success")
          }
        })
    },
    reset: function() {
      this.$refs.form.reset()
      this.dialog = false
      this.update = false
    },
  },
}
</script>

<style></style>
