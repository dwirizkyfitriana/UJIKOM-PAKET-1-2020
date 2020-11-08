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
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.nama_petugas }}</td>
            <td>
              <router-link :to="'/operator-edit/' + props.item.id_petugas">
                <v-icon small class="mr-2" color="primary">
                  mdi-pencil
                </v-icon>
              </router-link>
              <v-icon
                small
                color="error"
                @click="deleteData(props.item.id_petugas)"
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
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nama Petugas"
                  v-model="inputData.name"
                  :rules="[
                    inputData.rules.required,
                    inputData.rules.counterMinName,
                    inputData.rules.counterMax,
                  ]"
                  counter
                  clearable
                  required
                ></v-text-field>
              </v-col>
                <v-col cols="12">
                <v-text-field
                  label="Username"
                  v-model="inputData.username"
                  :rules="[
                    inputData.rules.required,
                    inputData.rules.counterMinName
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
                  :rules="[inputData.rules.required, inputData.rules.email]"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password"
                  v-model="inputData.password"
                  :rules="[
                    inputData.rules.required,
                    inputData.rules.counterMin,
                  ]"
                  :append-icon="inputData.showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="inputData.showPass ? 'text' : 'password'"
                  clearable
                  @click:append="inputData.showPass = !inputData.showPass"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Confirm Password"
                  v-model="inputData.confirmPassword"
                  :rules="[
                    inputData.rules.required,
                    inputData.rules.counterMin,
                    inputData.rules.passConfirm,
                  ]"
                  :append-icon="inputData.showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="inputData.showPass2 ? 'text' : 'password'"
                  clearable
                  @click:append="inputData.showPass2 = !inputData.showPass2"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="['Admin', 'Petugas']"
                  v-model="inputData.level"
                  label="Level"
                  :rules="[inputData.rules.required]"
                  clearable
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
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
import Operators from '../../services/operators'

export default {
  data() {
    return {
      items: [],
      headers: [
        { text: 'Nama', value: 'nama_petugas' },
        { text: 'Email', value: 'email' },
        { text: 'Level', value: 'level' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      search: '',
      dialog: false,
      inputData: {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        level: '',
        rules: {
          required: (value) => !!value || 'Required.',
          counterMax: (value) => value.length <= 50 || 'Max 50 characters',
          counterMin: (value) => value.length >= 8 || 'Min 8 characters',
          counterMinName: (value) => value.length >= 3 || 'Min 3 characters',
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
          passConfirm: (value) => value === this.inputData.password || 'Passwords do not match'
        },
        showPass: false,
        showPass2: false,
      },
    }
  },
  async mounted() {
    this.items = await Operators.getAllOperators()
  },
  methods: {
      async register(){
          await Operators.addOperator(this.inputData)
      }
  },
}
</script>

<style></style>
