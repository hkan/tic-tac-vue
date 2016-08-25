<template>
    <div class="welcome">
        <h1>Welcome to TicTacVue!</h1>

        <div v-if="!connected">Waiting for socket connection...</div>

        <div v-else>
            <form @submit.prevent="submit">
                <p :class="['control', {'has-icon has-icon-right': failResponse}]">
                    <input type="text"
                        :class="['input', {'is-danger': failResponse}]"
                        autofocus
                        v-model="username"
                        placeholder="Choose your username...">

                    <span v-if="failResponse" class="help is-danger">
                        {{ failResponse }}
                    </span>
                </p>

                <p class="control">
                    <button
                        type="submit"
                        :class="['button', 'is-primary', {'is-loading': loading}]"
                    >Start</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                loading: false,
                failResponse: null,
            }
        },

        computed: {
            connected() {
                return this.$root.connected
            },
        },

        events: {
            registered() {
                this.loading = false
                this.$dispatch('user-ready', {username: this.username})
            },

            'register-failed'(response) {
                this.username = ''
                this.loading = false
                this.failResponse = response
            },
        },

        methods: {
            submit() {
                this.loading = true
                this.$dispatch('register', {username: this.username})
            },
        },
    }
</script>

<style lang="scss" scoped>
    .welcome {
        margin: 50px auto;
        width: 300px;

        form {
            [type="submit"] {
                width: 100%
            }
        }
    }
</style>
