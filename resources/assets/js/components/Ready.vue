<template>
    <div class="ready">
        <h1>Hey, {{ $root.user.username }}!</h1>

        <p class="control">
            <span class="help is-danger" v-show="randomError">
                {{ randomError }}
            </span>
        </p>

        <form @submit.prevent="user">
            <p class="control">
                <input type="text" class="input" v-model="username" :disabled="matching">

                <span class="help is-danger" v-show="usernameError">
                    {{ usernameError }}
                </span>

                <button class="button is-primary" type="submit" :disabled="!username.length || matching" style="margin-top: 5px">
                    <span v-if="matching && username.length">waiting for {{ username }}'s response</span>
                    <span v-else>
                        <span v-if="username.length">send request to {{ username }}</span>
                        <span v-else>type in your friend's username to above</span>
                    </span>
                </button>
            </p>
        </form>

        <p class="has-text-centered">
            or
        </p>

        <p class="control">
            <button class="button is-primary" :disabled="matching" @click.prevent="random">
                <span v-if="matching">looking for opponents</span>
                <span v-else>match random players</span>
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
                this.$root.socket.emit('match-random', {}, () => {
                    this.$dispatch('new-random-game')
                })
                this.matching = true
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

            this.$el.querySelector('.input').focus()
        }
    }
</script>

<style lang="scss" scoped>
    .ready {
        margin: 50px auto;
        width: 300px;

        .button {
            width: 100%
        }
    }
</style>
