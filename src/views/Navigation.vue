<template>
  <div>
    <v-app-bar fixed app color="primary" class="white--text">
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title v-text="$route.name"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text icon color="white" v-on="on">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="selectedAction" color="primary">
              <v-list-item @click="logout()">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="#3c4b64" dark fixed app>
      <v-toolbar flat color="#3c4b64">
        <img src="../assets/smk1logo.png" alt="Spp-Logo" width="30" height="30" />
        Aplikasi Pembayaran SPP
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(item, i) in computedItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAction: 1,
      drawer: null,
      items: [
        {
          icon: 'mdi-view-dashboard-outline',
          title: 'Dashboard',
          to: '/dashboard',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-account-outline',
          title: 'Data Petugas',
          to: '/operator',
          role: ['Admin']
        },
        {
          icon: 'mdi-calendar-range',
          title: 'Tahun Ajaran',
          to: '/school-years',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-account-group-outline',
          title: 'Data Siswa',
          to: '/student',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-school-outline',
          title: 'Kompetensi Keahlian',
          to: '/majors',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-google-classroom',
          title: 'Kelas',
          to: '/classes',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-finance',
          title: 'Transaksi Spp',
          to: '/transaction',
          role: ['Admin', 'Petugas']
        },
        {
          icon: 'mdi-clipboard-text-outline',
          title: 'Laporan',
          to: '/report',
          role: ['Admin']
        },
      ],
    }
  },
  computed: {
    computedItems: function() {
      let role = localStorage.getItem('level')
      return this.items.filter((item) => item.role.indexOf(role) !== -1)
    }
  },
  methods: {
    async logout(){
      await this.$store.dispatch('auth/logout')
      this.$swal('Keluar', 'Anda Berhasil Logout.', 'success')
      this.$router.push('/login')
    }
  }
}
</script>
