import Socket from 'socket.io-client'
import Vue from 'vue'
import TicTacToe from './components/TicTacToe.vue'

Vue.options.debug = true

new Vue({
    el: '#app',

    data: {
        socket: null,
        id: null,
        opponent: null
    },

    computed: {
        shareLink() {
            return 'http://tic-tac-vue.dev/?opponent=' + this.id
        }
    },

    components: {
        TicTacToe
    },

    methods: {
        select(e) {
            e.target.select()
        }
    },

    events: {
        play(row, column) {
            this.socket.emit('play', row, column)
        }
    },

    ready() {
        var queryString = []

        var match = window.location.search.match(/\bopponent\=([a-zA-Z0-9\-\_]+)\b/)

        if (match) {
            this.opponent = match[1]
            queryString.push('opponent=' + match[1])
        }

        this.socket = new Socket('http://tic-tac-vue.dev:3080' + (queryString.length ? '?' + queryString.join('&') : ''))

        this.socket.on('connect', () => {
            this.$set('id', this.socket.id)

            if (this.opponent) {
                this.$broadcast('start')
            }
        })

        this.socket.on('opponent-connected', (opponent) => {
            this.opponent = opponent.id
        })

        this.socket.on('opponent-played', (row, column) => {
            this.$broadcast('opponent-played', row, column)
        })
    }
})
