<template>
    <div class="ready has-text-centered">
        <h1>Hey, {{ username }}!</h1>

        <form @submit.prevent="user">
            <p class="control">
                <input
                    type="text"
                    :class="['input', { 'is-danger': matchError }]"
                    v-model="opponent"
                    :disabled="matching"
                >

                <span class="help is-danger" v-show="matchError">
                    {{ matchError }}
                </span>
            </p>

            <p class="control">
                <button :class="['button is-primary', { 'is-loading': this.requesting }]" type="submit" :disabled="!opponent.length || matching">
                    <template v-if="matching && opponent.length">waiting for {{ opponent }}'s response</template>
                    <template v-else-if="requesting"></template>
                    <template v-else-if="opponent.length">send request to {{ opponent }}</template>
                    <template v-else>type in a username above</template>
                </button>
            </p>
        </form>

        <p>
            <small>({{ randomPoolCount }} players in pool)</small>
        </p>

        <Request v-for="request in requests" :key="request.by" :request="request" />
    </div>
</template>

<script>
import socket from '../../socket'
import Request from './Request.vue'

export default {
    data() {
        return {
            opponent: '',
            matchError: null,
            randomPoolCount: 0,
            matching: false,
            requesting: false,
            requests: [],
        }
    },

    components: {
        Request,
    },

    computed: {
        username() {
            return this.$store.state.user.username
        }
    },

    methods: {
        user() {
            this.requesting = true
            this.matchError = null

            this.$store.dispatch('lobby/sendRequestToUser', { username: this.opponent })
                .then(() => {
                    this.matching = true
                })
                .finally(() => {
                    this.requesting = false
                })
                .catch(err => {
                    this.matchError = err
                })
        },

        handleOffline({ username }) {
            if (username === this.opponent) {
                this.matchError = this.opponent + ' went offline'
                this.opponent = ''
                this.matching = false
            }
        },

        handleGameRequest(request) {
            this.requests.push(request)
        },
    },

    created() {
        socket.on('offline', this.handleOffline)
        socket.on('game-requested', this.handleGameRequest)
    },

    beforeDestroy() {
        socket.off('offline', this.handleOffline)
        socket.off('game-requested', this.handleGameRequest)
    }
}
</script>

<style lang="scss" scoped>
.ready {
  margin: 50px auto;
  max-width: 400px;

  .button {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>