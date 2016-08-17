import Socket from 'socket.io-client'
import Vue from 'vue'

import Leaderboard from './components/Leaderboard.vue'
import Game from './components/Game.vue'
import Welcome from './components/Welcome.vue'
import Ready from './components/Ready.vue'
import MatchRequest from './components/MatchRequest.vue'

Vue.options.debug = true

new Vue({
    el: '#app',

    data: {
        currentView: 'welcome',
        socket: null,
        connected: false,
        user: null,
        matchRequest: null,
        leaderboard: null
    },

    components: {
        Leaderboard,
        Game,
        Welcome,
        Ready,
    },

    events: {
        play(row, column) {
            this.socket.emit('play', row, column)
        },

        'play-again'() {
            this.socket.emit('play-again')
        },

        'opponent-wants-again'() {
            this.$broadcast('opponent-wants-again')
        },

        register(data) {
            this.socket.emit('register', data)
        },

        'game-component-ready'() {
            this.socket.emit('ready-to-begin')
        },

        'user-ready'(user) {
            this.user = user
            this.currentView = 'ready'
        },

        'game-over'(winner) {
            this.socket.emit('game-over', winner)
        },

        'leaderboard-data'(str) {
            this.leaderboard = str
        },

        'leaderboard-update'(str) {
            this.leaderboard = str
        },
    },

    ready() {
        this.socket = new Socket('http://' + window.location.host + ':3080')

        this.socket.on('connect', () => {
            this.$set('connected', true)
        })

        this.socket.on('game', (data) => {
            this.opponent = data.opponent
            this.$broadcast('game', data.game)

            if (data.starts) {
                this.$broadcast('start')
            }
        })

        this.socket.on('match-request', data => {
            this.matchRequest = new MatchRequest({
                data,
                parent: this
            })
            this.matchRequest.$mount().$appendTo(document.body)
        })

        this.socket.on('match-successful', () => {
            if (this.matchRequest) {
                this.matchRequest.$remove();
                this.$set('matchRequest', null)
            }

            this.currentView = 'game'
        })

        this.socket.on('restart', data => {
            this.$broadcast('restart')

            if (data.starts) {
                this.$broadcast('start')
            }
        })

        this.socket.on('registered', () => {
            this.$broadcast('registered')
        })

        this.socket.on('register-failed', response => {
            this.$broadcast('register-failed', response)
        })

        this.socket.on('opponent-disconnected', () => {
            this.opponent = null
            this.$broadcast('opponent-disconnected')
            this.currentView = 'ready'
        })

        this.socket.on('opponent-played', (row, column) => {
            this.$broadcast('opponent-played', row, column)
        })

        this.socket.on('opponent-wants-again', () => {
            this.$emit('opponent-wants-again')
        })

        this.socket.on('leaderboard-data', (data) => {
            this.$emit('leaderboard-data', data)
        })

        this.socket.on('leaderboard-update', (data) => {
            this.$emit('leaderboard-update', data)
        })
    }
})
