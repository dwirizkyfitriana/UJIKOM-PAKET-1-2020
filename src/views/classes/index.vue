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
            <v-data-table :headers="headers" :items="classes" :search="search">
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.major.name }}</td>
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
                                        :rules="[rules.required]"
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
                    <v-btn color="blue darken-1" text @click="save()">{{
                        update ? 'Edit' : 'Simpan'
                    }}</v-btn>
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
                objectId: '',
                name: '',
                major: '',
            },
            rules: {
                required: (v) => !!v || 'Required.',
            },
            loading: true,
        }
    },
    computed: {
        ...mapGetters({
            classes: 'classes/getClasses',
            majors: 'majors/getMajors',
        }),
    },
    async mounted() {
        await this.$store.dispatch('classes/fetchClasses')
        await this.$store.dispatch('majors/fetchMajors')

        this.loading = false
    },
    methods: {
        openDialog: async function(type = 'new', data) {
            this.dialog = true
            if (type == 'update') {
                this.update = true
                console.log('DATA', data)
                for (const key in this.inputData) {
                    this.inputData[key] = data[key]
                }
            }
        },
        save: async function() {
            if (this.update) {
                await this.$store.dispatch(
                    'classes/updateClass',
                    this.inputData
                )
            } else {
                await this.$store.dispatch('classes/addClass', this.inputData)
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
                    await this.$store.dispatch('classes/deleteClass', objectId)
                    this.snackbar('Kelas berhasil dihapus', 'success', 3000)
                },
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

<style></style>
