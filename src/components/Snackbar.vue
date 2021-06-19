<template>
    <v-snackbar v-model="show" :color="color" :timeout="timeout" top right>
        {{ text }}
        <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
                Close
            </v-btn>
        </template> 
    </v-snackbar>
</template>

<script>
export default {
    data: () => {
        return {
            show: false,
            text: '',
            color: '',
            timeout: 3000
        }
    },
    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == 'snackbar/SNACKBAR') {
                this.text = state.snackbar.text
                this.color = state.snackbar.color
                this.timeout = state.snackbar.timeout
                this.show = true
            }
        })
    }
}
</script>

<style></style>
