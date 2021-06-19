<template>
    <v-app class="blue-grey lighten-5">
        <Navigation v-if="$route.path != '/login'" />
        <v-main class="blue-grey lighten-5">
            <router-view class="blue-grey lighten-5" />
        </v-main>
    </v-app>
</template>

<script>
import Navigation from './views/Navigation'

export default {
    name: 'App',
    components: {
        Navigation,
    },
    data: () => ({
        //
    }),
}
</script>
