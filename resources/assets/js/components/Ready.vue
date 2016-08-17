<template>
    <div class="ready">
        <h1>Hey, {{ $root.user.username }}!</h1>

        <p class="control">
            <span class="help is-danger" v-show="randomError">
                {{ randomError }}
            </span>
        </p>

        <p class="control">
            <input type="text" class="input" v-model="username" :disabled="matching">

            <span class="help is-danger" v-show="usernameError">
                {{ usernameError }}
            </span>

            <button class="button is-primary" @click="user" :disabled="!username.length || matching" style="margin-top: 5px">
                <span v-if="matching">waiting for {{ username }}'s response</span>
                <span v-else>
                    <span v-if="username.length">send request to {{ username }}</span>
                    <span v-else>type in your friend's username to above</span>
                </span>
            </button>
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
                this.matching = true
            },
        },

        ready() {
            this.$root.socket.on('match-failed', response => {
                this.usernameError = response
                this.matching = false
            })

            this.$root.socket.on('match-denied', response => {
                alert(this.username + ' denied your request')
                this.usernameError = null
                this.matching = false
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
