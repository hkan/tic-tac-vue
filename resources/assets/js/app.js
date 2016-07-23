import Socket from 'socket.io-client'
import Vue from 'vue'
import TicTacToe from './components/TicTacToe.vue'

Vue.options.debug = true

new Vue({
    el: '#app',

    data: {
        socket: null,
        id: null
    },

    computed: {
        shareLink() {
            return 'http://localhost:3000/?id=' + this.id
        }
    },

    components: {
        TicTacToe
    },

    ready() {
        var queryString = []

        var match = window.location.search.match(/\bopponent\=([a-zA-Z0-9]+)\b/)

        if (match) {
            queryString.push('opponent=' + match[1])
        }

        this.socket = new Socket('127.0.0.1:3080' + (queryString.length ? '?' + queryString.join('&') : ''))

        this.socket.on('connect', () => {
            this.$set('id', this.socket.id)
        })
    }
})
