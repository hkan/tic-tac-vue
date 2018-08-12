<template>
    <div class="welcome has-text-centered">
        <h1>Welcome to TicTacVue!</h1>

        <div v-if="!isConnected">Just a sec, awaiting server connection...</div>

        <div v-else>
            <form @submit.prevent="submit">
                <div class="field">
                    <div :class="['control', {'has-icon has-icon-right': error}]">
                        <input type="text"
                            :class="['input', {'is-danger': error}]"
                            autofocus
                            v-model="username"
                            @input="clearErrors"
                            placeholder="Choose your username..."
                            :disabled="loading"
                        >

                        <p class="help is-danger" v-if="error">
                            {{ error }}
                        </p>
                    </div>
                </div>

                <div class="field">
                    <div class="control">
                        <button type="submit"
                            :class="['button', 'is-primary', {'is-loading': loading}]"
                            :disabled="loading"
                        >Start</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomePage',

    data() {
        return {
            username: '',
            loading: false,
            error: null,
        }
    },

    computed: {
        isConnected() {
            return this.$store.state.app.isConnected
        },
    },

    methods: {
        clearErrors() {
            this.error = null
        },

        submit() {
            this.loading = true

            this.$store.dispatch('user/register', { username: this.username })
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                    }, 300);
                })
                .then(response => {
                    return this.$router.push('/lobby')
                })
                .catch(err => {
                    this.error = err.toString()
                    this.$el.querySelector('input[type=text]').focus()
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.welcome {
    width: 350px;

    form {
        [type="submit"] {
            width: 100%;
        }
    }
}
</style>
