<template>
    <v-app>
        <v-card-title>
            Data Petugas
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Cari"
                single-line
                hide-details
                solo
                clearable
            ></v-text-field>
            <div class="ml-5">
                <v-btn
                    color="green accent-4"
                    class="white--text"
                    to="/operator-add"
                    >Tambah</v-btn
                >
            </div>
        </v-card-title>
        <v-card class="ma-5">
            <v-data-table :headers="headers" :items="items" :search="search">
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.nama_petugas }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.nama_petugas }}</td>
                        <td>
                            <router-link
                                :to="'/operator-edit/' + props.item.id_petugas"
                            >
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
    </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>
