import Socket from 'socket.io-client'
import Vue from 'vue'
import TicTacToe from './components/TicTacToe.vue'

Vue.options.debug = true

new Vue({
    el: '#app',

    data: {
        socket: null,
        connected: false,
        opponent: null,
        showReplayConfirmation: false
    },

    computed: {
        shareLink() {
            return 'http://tic-tac-vue.dev/?opponent=' + this.socket.id
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
        },

        restart() {
            this.socket.emit('restart')
        },

        'opponent-wants-again'() {
            this.showReplayConfirmation = true
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
            this.$set('connected', true)
        })

        this.socket.on('game', (data) => {
            console.log('game', data)

            this.opponent = data.opponent
            this.$broadcast('game', data.game)

            if (data.starts) {
                this.$broadcast('start')
            }
        })

        this.socket.on('opponent-disconnected', () => {
            this.opponent = null
            this.$broadcast('opponent-disconnected')
        })

        this.socket.on('opponent-played', (row, column) => {
            this.$broadcast('opponent-played', row, column)
        })

        this.socket.on('opponent-wants-again', () => {
            this.$emit('opponent-wants-again')
        })
    }
})
