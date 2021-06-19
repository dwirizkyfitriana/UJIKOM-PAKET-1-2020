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
            <v-data-table
                :headers="headers"
                :items="schoolYears"
                :search="search"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.year }}</td>
                        <td>{{ props.item.amountPaid }}</td>
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
                                        :rules="[rules.required]"
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
                                        :rules="[rules.required]"
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
                    <v-btn color="blue darken-1" text @click="save()">
                        {{ update ? 'Edit' : 'Simpan' }}
                    </v-btn>
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
                objectId: '',
                year: '',
                amountPaid: '',
            },
            rules: {
                required: (v) => !!v || 'Required.',
            },
            loading: true,
        }
    },
    computed: {
        ...mapGetters({
            schoolYears: 'years/getSchoolYears',
        }),
    },
    async mounted() {
        // get all years
        await this.$store.dispatch('years/fetchSchoolYears')
        this.loading = false
    },
    methods: {
        openDialog: async function(type = 'new', data) {
            this.dialog = true
            if (type == 'update') {
                this.update = true
                for (const key in this.inputData) {
                    this.inputData[key] = data[key]
                }
            }
        },
        save: async function() {
            if (this.update) {
                await this.$store.dispatch(
                    'years/updateSchoolYear',
                    this.inputData
                )
            } else {
                await this.$store.dispatch(
                    'years/addSchoolYear',
                    this.inputData
                )
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
                    await this.$store.dispatch(
                        'years/deleteSchoolYears',
                        objectId
                    )
                    this.snackbar('Tahun Ajaran Berhasil dihapus', 'success', 3000)
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
