<template>
    <v-app>
        <v-container
            class="purple darken-4"
            fluid
            fill-height
            style="height: 100vh"
        >
            <v-layout align-center justify-center>
                <v-card height="400px" width="600px" elevation="5">
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-card-text
                                class="text-center display-1 font-weight-bold"
                            >
                                LOGIN
                            </v-card-text>
                            <v-flex>
                                <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                    class="pa-12"
                                >
                                    <v-layout row wrap>
                                        <v-flex xs12 md12>
                                            <v-text-field
                                                v-model="inputs.username"
                                                label="Username"
                                                :rules="[rules.required]"
                                                required
                                                clearable
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md12>
                                            <v-text-field
                                                v-model="inputs.password"
                                                :append-icon="
                                                    showPassword
                                                        ? 'mdi-eye'
                                                        : 'mdi-eye-off'
                                                "
                                                :rules="[
                                                    rules.required,
                                                    rules.min,
                                                ]"
                                                :type="
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                "
                                                label="Password"
                                                hint="At least 8 characters"
                                                counter
                                                @click:append="
                                                    showPassword = !showPassword
                                                "
                                                clearable
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs12 md6>
                                            <v-btn color="error" @click="reset"
                                                >Reset</v-btn
                                            >
                                        </v-flex>
                                        <v-flex class="d-flex justify-end">
                                            <v-btn
                                                :disabled="!valid"
                                                color="primary"
                                                @click="login"
                                                >Login</v-btn
                                            >
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        valid: true,
        inputs: {
            username: '',
            password: '',
        },
        showPassword: false,
        rules: {
            required: (v) => !!v || 'Required',
            min: (v) => (v && v.length) >= 8 || 'Min 8 karakter',
        },
        error: false,
    }),

    methods: {
        async login() {
            if (this.$refs.form.validate()) {
                await this.$store.dispatch('auth/login', this.inputs)
                this.snackbar('Selamat Datang', 'success', 3000)
                this.$router.push('/dashboard')
            }
        },
        reset() {
            this.$refs.form.reset()
        },
    },
}
</script>
