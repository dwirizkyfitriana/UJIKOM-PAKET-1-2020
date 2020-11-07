<template>
  <v-app>
    <Navigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navigation from './views/Navigation'
export default {
  name: 'App',
  components: {
    Navigation
  },
  data: () => ({
    //
  }),
};
</script>
