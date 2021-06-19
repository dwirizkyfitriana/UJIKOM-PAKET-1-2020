<template>
    <v-app>
        <Navigation v-if="$route.path != '/login' && $route.name != 'Not Found'" />
        <v-main class="blue-grey lighten-5">
            <snackbar></snackbar>
            <router-view class="blue-grey lighten-5" />
        </v-main>
    </v-app>
</template>

<script>
import Navigation from './views/Navigation'
import Snackbar from './components/Snackbar'

export default {
    name: 'App',
    components: {
        Navigation,
        Snackbar,
    },
    data: () => ({
        //
    })
}
</script>

<style>
.inputNumber input[type='number'] {
    -moz-appearance: textfield;
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
