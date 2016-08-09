<template>
    <div class="ready">
        <h1>Hey, {{ $root.user.username }}!</h1>

        <p class="control">
            <button class="button" @click="random" :disabled="matching">
                match a random opponent
            </button>

            <span class="help is-danger" v-show="randomError">
                {{ randomError }}
            </span>
        </p>

        <p class="control">
            <input type="text" class="input" v-model="username">

            <button class="button" @click="user" :disabled="!username.length || matching" style="margin-top: 5px">
                match with him/her ^
            </button>

            <span class="help is-danger" v-show="usernameError">
                {{ usernameError }}
            </span>
        </p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                usernameError: null,
                randomError: null,
                matching: false,
            }
        },

        methods: {
            random() {
                this.$root.socket.emit('match-random')
            },

            user() {
                this.$root.socket.emit('match-with', this.username)
            },
        },

        ready() {
            this.$root.socket.on('match-failed', response => {
                this.usernameError = response
            })
        }
    }
</script>

<style lang="scss" scoped>
    .ready {
        margin: 50px 0;

        .button {
            width: 100%
        }
    }
</style>
